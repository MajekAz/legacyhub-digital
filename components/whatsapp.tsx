import { whatsappUrl } from '@/lib/whatsapp';
export function WhatsApp() {
  const url = whatsappUrl(process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP);
  return url ? (
    <a
      className="text-link"
      href={url}
      data-event="whatsapp_click"
      rel="noopener noreferrer"
      target="_blank"
    >
      Talk to us on WhatsApp ↗
    </a>
  ) : null;
}
