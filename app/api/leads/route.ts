import { leadSchema, CONSENT_VERSION } from '@/lib/lead-schema';
import { createCrmLead } from '@/lib/crm-client.server';
import { allowRequest } from '@/lib/rate-limit.server';
export const runtime = 'nodejs';
const json = (body: object, status = 200) =>
  Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  });
async function readBody(req: Request) {
  if (Number(req.headers.get('content-length')) > 16384) throw new Error('too_large');
  const reader = req.body?.getReader();
  if (!reader) throw new Error('empty');
  const decoder = new TextDecoder();
  let size = 0;
  let text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16384) {
        await reader.cancel();
        throw new Error('too_large');
      }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally {
    reader.releaseLock();
  }
}
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const allowed =
    process.env.NODE_ENV === 'production'
      ? ['https://legacyhubdigital.com', 'https://www.legacyhubdigital.com']
      : ['http://127.0.0.1:3100', 'http://localhost:3100'];
  if (!origin || !allowed.includes(origin))
    return json({ ok: false, error: 'Request could not be accepted.' }, 403);
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))
    return json({ ok: false, error: 'Please submit the website form.' }, 415);
  if (!allowRequest('global', 120))
    return json({ ok: false, error: 'Please wait a minute before trying again.' }, 429);
  let body: unknown;
  try {
    body = await readBody(request);
  } catch {
    return json({ ok: false, error: 'Please check your form and try again.' }, 400);
  }
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] || 'form');
      if (field !== 'website') fields[field] = issue.message;
    }
    return json({ ok: false, error: 'Please check the highlighted fields.', fields }, 400);
  }
  const { requestId, website: _honeypot, ...data } = parsed.data;
  void _honeypot;
  if (!allowRequest(`email:${data.email}`, 5))
    return json({ ok: false, error: 'Please wait a minute before trying again.' }, 429);
  try {
    const leadId = await createCrmLead(
      {
        ...data,
        source: data.type === 'consultation' ? 'Website consultation' : 'Website contact',
        consentVersion: CONSENT_VERSION,
      },
      requestId,
    );
    return json({ ok: true, leadId });
  } catch {
    console.warn('lead_delivery_unconfirmed');
    return json(
      {
        ok: false,
        error:
          'We could not confirm your enquiry just now. Please retry shortly; do not assume it has been received.',
      },
      503,
    );
  }
}
