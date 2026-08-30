import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { leadSchema, CONSENT_VERSION } from '@/lib/lead-schema';
import { createCrmLead } from '@/lib/crm-client.server';

const input = {
  requestId: '550e8400-e29b-41d4-a716-446655440000',
  type: 'consultation',
  name: 'Test Family',
  email: 'family@example.test',
  consent: true,
};
const secret = 'test-secret-not-a-real-credential-123456789';
function crmData() {
  const { requestId, website, ...data } = leadSchema.parse(input);
  void requestId;
  void website;
  return { ...data, source: 'Website consultation', consentVersion: CONSENT_VERSION };
}
beforeEach(() => {
  vi.stubEnv('GOOGLE_CRM_WEBAPP_URL', 'https://script.google.com/macros/s/test-deployment/exec');
  vi.stubEnv('GOOGLE_CRM_SHARED_SECRET', secret);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.useRealTimers();
});
describe('lead validation', () => {
  it('normalises valid data and defaults optional fields', () => {
    expect(
      leadSchema.parse({ ...input, name: ' Test Family ', email: 'FAMILY@example.test' }),
    ).toMatchObject({
      name: 'Test Family',
      email: 'family@example.test',
      materialsAvailable: [],
      preferredContactMethod: 'Email',
    });
  });
  it.each([
    { email: 'bad' },
    { consent: false },
    { consent: undefined },
    { website: 'spam' },
    { message: 'x'.repeat(3001) },
    { preferredContactMethod: 'WhatsApp' },
    { requestId: 'invalid' },
    { sourcePage: '/contact?email=private' },
    { secret: 'do-not-accept' },
    { materialsAvailable: ['invalid'] },
  ])('rejects invalid input %j', (patch) => {
    expect(leadSchema.safeParse({ ...input, ...patch }).success).toBe(false);
  });
  it('accepts the full consultation options', () => {
    expect(
      leadSchema.safeParse({
        ...input,
        legacySubjectType: 'Parent',
        livingStatus: 'Living',
        materialsAvailable: ['Photographs'],
        photoCountRange: '50–200',
        serviceInterest: 'Family Heritage Archive',
        preferredContactMethod: 'Phone',
        phone: '+44 1234567890',
      }).success,
    ).toBe(true);
  });
});
describe('CRM client', () => {
  it('sends an authenticated server request and returns only the reference', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ ok: true, leadId: 'LHD-0001' })));
    vi.stubGlobal('fetch', fetcher);
    expect(await createCrmLead(crmData(), input.requestId)).toBe('LHD-0001');
    const body = JSON.parse(fetcher.mock.calls[0][1].body);
    expect(body.action).toBe('createLead');
    expect(body.secret).toBe(secret);
    expect(body.data).toEqual(crmData());
    expect(body.requestId).toBe(input.requestId);
  });
  it.each([
    '<html>login</html>',
    '{}',
    '{"ok":false,"error":"private detail"}',
    '{"ok":true,"leadId":"sheet-id"}',
  ])('rejects malformed/failed CRM responses', async (response) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(response)));
    await expect(createCrmLead(crmData(), input.requestId)).rejects.toThrow();
  });
  it('rejects HTTP failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 500 })));
    await expect(createCrmLead(crmData(), input.requestId)).rejects.toThrow();
  });
  it('times out an unresponsive CRM', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_u, options) =>
          new Promise((_resolve, reject) =>
            options.signal.addEventListener('abort', () => reject(new Error('aborted'))),
          ),
      ),
    );
    const assertion = expect(createCrmLead(crmData(), input.requestId)).rejects.toThrow('aborted');
    await vi.advanceTimersByTimeAsync(12001);
    await assertion;
  });
  it.each([
    'http://script.google.com/macros/s/test/exec',
    'https://example.com/exec',
    'https://script.google.com/macros/s/test/dev',
  ])('rejects unsafe CRM configuration', async (url) => {
    vi.stubEnv('GOOGLE_CRM_WEBAPP_URL', url);
    await expect(createCrmLead(crmData(), input.requestId)).rejects.toThrow();
  });
  it('fails closed without secrets', async () => {
    vi.stubEnv('GOOGLE_CRM_SHARED_SECRET', '');
    await expect(createCrmLead(crmData(), input.requestId)).rejects.toThrow('crm_unconfigured');
  });
});
it('follows the Google result redirect without forwarding credentials', async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(
      new Response(null, {
        status: 302,
        headers: {
          location: 'https://script.googleusercontent.com/macros/echo?user_content_key=test',
        },
      }),
    )
    .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, leadId: 'LHD-0002' })));
  vi.stubGlobal('fetch', fetcher);
  expect(await createCrmLead(crmData(), input.requestId)).toBe('LHD-0002');
  expect(fetcher.mock.calls[1][1]).toMatchObject({ method: 'GET', redirect: 'error' });
  expect(fetcher.mock.calls[1][1]).not.toHaveProperty('body');
  expect(JSON.stringify(fetcher.mock.calls[1])).not.toContain(secret);
});
it.each([
  'https://attacker.test/',
  'http://script.googleusercontent.com/macros/echo',
  'https://script.googleusercontent.com:8443/macros/echo',
])('rejects unsafe redirect %s', async (location) => {
  const fetcher = vi
    .fn()
    .mockResolvedValue(new Response(null, { status: 302, headers: { location } }));
  vi.stubGlobal('fetch', fetcher);
  await expect(createCrmLead(crmData(), input.requestId)).rejects.toThrow();
  expect(fetcher).toHaveBeenCalledTimes(1);
});
it.each([301, 307, 308])('never replays the secret POST on HTTP %i', async (status) => {
  const fetcher = vi
    .fn()
    .mockResolvedValue(
      new Response(null, {
        status,
        headers: { location: 'https://script.googleusercontent.com/macros/echo' },
      }),
    );
  vi.stubGlobal('fetch', fetcher);
  await expect(createCrmLead(crmData(), input.requestId)).rejects.toThrow();
  expect(fetcher).toHaveBeenCalledTimes(1);
});
it('rejects oversized CRM responses', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('x'.repeat(4097))));
  await expect(createCrmLead(crmData(), input.requestId)).rejects.toThrow('crm_malformed');
});
