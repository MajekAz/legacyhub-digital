import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/unsubscribe/route';
import { unsubscribeEmail } from '@/lib/unsubscribe-client.server';
vi.mock('@/lib/rate-limit.server', () => ({ allowRequest: vi.fn(() => true) }));
import { allowRequest } from '@/lib/rate-limit.server';
const token = 'a'.repeat(64);
const secret = 'synthetic-server-only-secret-123456789';
const fetchMock = vi.fn();
const request = (body: unknown = { token }, origin = 'http://localhost:3100') =>
  new Request('http://localhost:3100/api/unsubscribe', {
    method: 'POST',
    headers: { origin, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'test');
  vi.stubEnv('GOOGLE_CRM_WEBAPP_URL', 'https://script.google.com/macros/s/test/exec');
  vi.stubEnv('GOOGLE_CRM_SHARED_SECRET', secret);
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockReset();
  vi.mocked(allowRequest).mockReturnValue(true);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
it.each(['unsubscribed', 'already_unsubscribed'])(
  'returns safe %s responses and forwards only a server-authenticated action',
  async (status) => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true, status })));
    const res = await POST(request());
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(await res.json()).toEqual({ ok: true, status });
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).not.toContain(secret);
    expect(url).not.toContain(token);
    expect(JSON.parse(options.body)).toEqual({ secret, action: 'unsubscribe', data: { token } });
  },
);
it('forwards ContentService redirect only as a credential-free GET', async () => {
  fetchMock
    .mockResolvedValueOnce(
      new Response(null, {
        status: 302,
        headers: { location: 'https://script.googleusercontent.com/macros/echo?result=test' },
      }),
    )
    .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, status: 'unsubscribed' })));
  await unsubscribeEmail(token);
  expect(fetchMock.mock.calls[1][1]).not.toHaveProperty('body');
  expect(fetchMock.mock.calls[1][1].method).toBe('GET');
});
it('rejects an untrusted redirect without forwarding credentials', async () => {
  fetchMock.mockResolvedValue(
    new Response(null, { status: 302, headers: { location: 'https://attacker.test/' } }),
  );
  expect((await POST(request())).status).toBe(503);
  expect(fetchMock).toHaveBeenCalledTimes(1);
});
it.each([{ token: 'bad' }, { token, extra: true }, { token: 'a'.repeat(2000) }])(
  'rejects invalid/oversized input before CRM',
  async (data) => {
    expect((await POST(request(data))).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  },
);
it('rejects unknown tokens without exposing data', async () => {
  fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: false, error: 'invalid_token' })));
  expect(await (await POST(request())).json()).toEqual({ ok: false, error: 'invalid_token' });
});
it.each(['not JSON', JSON.stringify({ ok: true, email: 'private' }), 'x'.repeat(5000)])(
  'handles malformed CRM responses safely',
  async (body) => {
    fetchMock.mockResolvedValue(new Response(body));
    const res = await POST(request());
    expect(res.status).toBe(503);
    expect(await res.text()).toBe('{"ok":false,"error":"temporary_error"}');
  },
);
it('does not leak exceptions or secrets', async () => {
  fetchMock.mockRejectedValue(new Error(secret));
  expect(await (await POST(request())).text()).not.toContain(secret);
});
it('aborts slow CRM responses', async () => {
  vi.useFakeTimers();
  try {
    fetchMock.mockImplementation(
      (_url, options) =>
        new Promise((_resolve, reject) => {
          options.signal.addEventListener('abort', () => reject(new Error('aborted')));
        }),
    );
    const result = POST(request());
    await vi.advanceTimersByTimeAsync(12001);
    expect((await result).status).toBe(503);
  } finally {
    vi.useRealTimers();
  }
});
it('rejects foreign origins and rate limited calls', async () => {
  expect((await POST(request({ token }, 'https://attacker.test'))).status).toBe(403);
  vi.mocked(allowRequest).mockReturnValue(false);
  expect((await POST(request())).status).toBe(429);
  expect(fetchMock).not.toHaveBeenCalled();
});
