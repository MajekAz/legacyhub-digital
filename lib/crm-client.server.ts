import 'server-only';
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
    endpoint.hash ||
    endpoint.username ||
    endpoint.password ||
    endpoint.port
  )
    throw new Error('crm_configuration');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    let res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, action: 'createLead', data, requestId }),
      signal: controller.signal,
      cache: 'no-store',
      // Never automatically replay a credential-bearing POST to a redirect target.
      redirect: 'manual',
    });
    if (res.status === 302 || res.status === 303) {
      const location = res.headers.get('location');
      if (!location) throw new Error('crm_redirect');
      const target = new URL(location, url);
      if (
        target.protocol !== 'https:' ||
        target.hostname !== 'script.googleusercontent.com' ||
        target.username ||
        target.password ||
        target.port ||
        target.pathname !== '/macros/echo'
      )
        throw new Error('crm_redirect');
      await res.body?.cancel();
      // ContentService returns the result from Google on a one-time GET URL.
      res = await fetch(target, {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-store',
        redirect: 'error',
      });
    }
    if (!res.ok) throw new Error('crm_failed');
    const reader = res.body?.getReader();
    if (!reader) throw new Error('crm_malformed');
    const decoder = new TextDecoder();
    let text = '';
    let bytes = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > 4096) {
          await reader.cancel();
          throw new Error('crm_malformed');
        }
        text += decoder.decode(value, { stream: true });
      }
      text += decoder.decode();
    } finally {
      reader.releaseLock();
    }
    const parsed = responseSchema.safeParse(JSON.parse(text));
    if (!parsed.success) throw new Error('crm_malformed');
    return parsed.data.leadId;
  } finally {
    clearTimeout(timer);
  }
}
