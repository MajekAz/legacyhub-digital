import 'server-only';
import { createHash } from 'node:crypto';
const buckets = new Map<string, { count: number; expires: number }>();
export function allowRequest(key: string, limit: number, now = Date.now()): boolean {
  for (const [id, bucket] of buckets) if (bucket.expires <= now) buckets.delete(id);
  const id = createHash('sha256').update(key).digest('hex');
  const bucket = buckets.get(id);
  if (bucket) {
    bucket.count++;
    return bucket.count <= limit;
  }
  if (buckets.size > 10000) return false;
  buckets.set(id, { count: 1, expires: now + 60000 });
  return true;
}
