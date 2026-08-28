import 'server-only';
import { createHmac } from 'node:crypto';
import { z } from 'zod';
import type { CrmData } from './lead-schema';
const responseSchema = z.object({ ok: z.literal(true), leadId: z.string().regex(/^LHD-\d{4,}$/) });
export async function createCrmLead(data: CrmData, requestId: string): Promise<string> {
  const url = process.env.GOOGLE_CRM_WEBAPP_URL;
  const secret = process.env.GOOGLE_CRM_SHARED_SECRET;
  if (!url || !secret || secret.length < 32) throw new Error('crm_unconfigured');
  const endpoint = new URL(url);
  if (
    endpoint.protocol !== 'https:' ||
    endpoint.hostname !== 'script.google.com' ||
    !/^\/macros\/s\/[\w-]+\/exec$/.test(endpoint.pathname) ||
    endpoint.search ||
    endpoint.hash
  )
    throw new Error('crm_configuration');
  const payload = JSON.stringify(data);
  const timestamp = Date.now();
  const signature = createHmac('sha256', secret)
    .update(`${timestamp}.${requestId}.${payload}`)
    .digest('hex');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        version: 1,
        action: 'createLead',
        timestamp,
        requestId,
        payload,
        signature,
      }),
      signal: controller.signal,
      cache: 'no-store',
      redirect: 'follow',
    });
    if (!res.ok) throw new Error('crm_failed');
    const text = await res.text();
    if (text.length > 4096) throw new Error('crm_malformed');
    const parsed = responseSchema.safeParse(JSON.parse(text));
    if (!parsed.success) throw new Error('crm_malformed');
    return parsed.data.leadId;
  } finally {
    clearTimeout(timer);
  }
}
