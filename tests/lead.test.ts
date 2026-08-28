import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { leadSchema, CONSENT_VERSION } from '@/lib/lead-schema';
import { createCrmLead } from '@/lib/crm-client.server';
import { createHmac } from 'node:crypto';
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
  it('sends a signed server request and returns only the reference', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ ok: true, leadId: 'LHD-0001' })));
    vi.stubGlobal('fetch', fetcher);
    expect(await createCrmLead(crmData(), input.requestId)).toBe('LHD-0001');
    const body = JSON.parse(fetcher.mock.calls[0][1].body);
    expect(body.action).toBe('createLead');
    expect(body.signature).toBe(
      createHmac('sha256', secret)
        .update(`${body.timestamp}.${body.requestId}.${body.payload}`)
        .digest('hex'),
    );
    expect(JSON.stringify(body)).not.toContain(secret);
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
