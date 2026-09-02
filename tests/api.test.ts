import { beforeEach, afterEach, it, expect, vi } from 'vitest';
vi.mock('@/lib/crm-client.server', () => ({ createCrmLead: vi.fn() }));
vi.mock('@/lib/rate-limit.server', () => ({ allowRequest: vi.fn(() => true) }));
import { POST } from '@/app/api/leads/route';
import { createCrmLead } from '@/lib/crm-client.server';
import { allowRequest } from '@/lib/rate-limit.server';
const valid = {
  requestId: '550e8400-e29b-41d4-a716-446655440000',
  type: 'contact',
  name: 'Test Person',
  email: 'person@example.test',
  consent: true,
};
const request = (data: unknown = valid, headers: Record<string, string> = {}) =>
  new Request('http://localhost:3100/api/leads', {
    method: 'POST',
    headers: { origin: 'http://localhost:3100', 'content-type': 'application/json', ...headers },
    body: JSON.stringify(data),
  });
beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'test');
  vi.mocked(allowRequest).mockReturnValue(true);
  vi.mocked(createCrmLead).mockResolvedValue('LHD-0001');
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});
it('saves a valid contact in the same CRM and prevents caching', async () => {
  const res = await POST(request());
  expect(res.status).toBe(200);
  expect(res.headers.get('cache-control')).toBe('no-store');
  expect(await res.json()).toEqual({ ok: true, leadId: 'LHD-0001' });
  expect(createCrmLead).toHaveBeenCalledWith(
    expect.objectContaining({ source: 'Website contact', consentVersion: '2026-08-28-v1' }),
    valid.requestId,
  );
});
it.each([
  ['facebook', 'Facebook'],
  ['instagram', 'Instagram'],
  ['', 'Lead Magnet'],
])('maps checklist attribution %s to %s without changing campaign fields', async (utmSource, source) => {
  const leadMagnet = {
    ...valid,
    type: 'lead_magnet',
    category: 'Family Legacy Checklist',
    serviceInterest: 'Not sure yet',
    marketingConsent: false,
    marketingConsentVersion: '2026-08-31-v1',
    sourcePage: '/resources/family-legacy-checklist',
    landingPage: '/resources/family-legacy-checklist',
    utmSource,
    utmMedium: 'paid_social',
    utmCampaign: 'family_legacy_uk',
    utmContent: 'video_01',
  };
  expect((await POST(request(leadMagnet))).status).toBe(200);
  expect(createCrmLead).toHaveBeenCalledWith(
    expect.objectContaining({
      source,
      utmSource,
      utmMedium: 'paid_social',
      utmCampaign: 'family_legacy_uk',
      utmContent: 'video_01',
    }),
    valid.requestId,
  );
});
it.each([
  { consent: false },
  { email: 'invalid' },
  { website: 'bot' },
  { message: 'x'.repeat(3001) },
])('rejects invalid form before CRM', async (patch) => {
  expect((await POST(request({ ...valid, ...patch }))).status).toBe(400);
  expect(createCrmLead).not.toHaveBeenCalled();
});
it('rejects foreign origins', async () => {
  expect((await POST(request(valid, { origin: 'https://attacker.test' }))).status).toBe(403);
});
it('rejects a non-JSON request', async () => {
  expect((await POST(request(valid, { 'content-type': 'text/plain' }))).status).toBe(415);
});
it('rejects oversized request bodies', async () => {
  expect((await POST(request({ ...valid, message: 'x'.repeat(17000) }))).status).toBe(400);
});
it('rejects malformed JSON', async () => {
  expect(
    (
      await POST(
        new Request('http://localhost:3100/api/leads', {
          method: 'POST',
          headers: { origin: 'http://localhost:3100', 'content-type': 'application/json' },
          body: '{',
        }),
      )
    ).status,
  ).toBe(400);
});
it('enforces rate limits', async () => {
  vi.mocked(allowRequest).mockReturnValue(false);
  expect((await POST(request())).status).toBe(429);
});
it('returns generic CRM errors without leaking secrets', async () => {
  vi.mocked(createCrmLead).mockRejectedValue(new Error('SECRET spreadsheet-id private message'));
  const res = await POST(request());
  expect(res.status).toBe(503);
  const text = await res.text();
  expect(text).not.toContain('SECRET');
  expect(text).not.toContain('spreadsheet-id');
  expect(console.warn).toHaveBeenCalledWith('lead_delivery_unconfirmed');
});
