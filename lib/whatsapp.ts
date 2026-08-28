export function whatsappUrl(value: string | undefined) {
  if (!value) return null;
  const digits = value.replace(/[+\s()-]/g, '');
  if (!/^[1-9]\d{7,14}$/.test(digits)) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent('Hello, I saw LegacyHub Digital Heritage and I am interested in creating a digital legacy archive.')}`;
}
