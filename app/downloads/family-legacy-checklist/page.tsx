import { redirect } from 'next/navigation';
import { familyLegacyChecklist } from '@/content/lead-magnets';

export default function Page() {
  redirect(familyLegacyChecklist.downloadPath);
}
