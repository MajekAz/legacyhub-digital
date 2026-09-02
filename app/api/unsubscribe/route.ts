import { z } from 'zod';
import { unsubscribeEmail } from '@/lib/unsubscribe-client.server';
import { allowRequest } from '@/lib/rate-limit.server';
export const runtime = 'nodejs';
const schema = z.object({ token: z.string().regex(/^[a-f0-9]{64}$/) }).strict();
const json = (body: object, status = 200) =>
  Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' },
  });
export async function POST(request: Request) {
  const allowed =
    process.env.NODE_ENV === 'production'
      ? ['https://legacyhubdigital.com', 'https://www.legacyhubdigital.com']
      : ['http://127.0.0.1:3100', 'http://localhost:3100'];
  if (!allowed.includes(request.headers.get('origin') || '')) return json({ ok: false }, 403);
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type') || ''))
    return json({ ok: false }, 415);
  if (!allowRequest('unsubscribe', 60)) return json({ ok: false }, 429);
  let token: string;
  try {
    const reader = request.body?.getReader();
    if (!reader) return json({ ok: false, error: 'invalid_token' }, 400);
    const chunks: Uint8Array[] = [];
    let length = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        length += value.byteLength;
        if (length > 1024) {
          await reader.cancel();
          throw new Error('size');
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    token = schema.parse(JSON.parse(Buffer.concat(chunks).toString('utf8'))).token;
  } catch {
    return json({ ok: false, error: 'invalid_token' }, 400);
  }
  try {
    const result = await unsubscribeEmail(token);
    return json(result, result.ok ? 200 : 400);
  } catch {
    return json({ ok: false, error: 'temporary_error' }, 503);
  }
}
