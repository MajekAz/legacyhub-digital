export function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://legacyhubdigital.com/#website',
        name: 'LegacyHub Digital Heritage',
        url: 'https://legacyhubdigital.com',
        inLanguage: 'en-GB',
      },
      {
        '@type': 'Service',
        name: 'Digital Legacy Archive Service',
        serviceType: 'Done-for-you digital heritage archives',
        url: 'https://legacyhubdigital.com/services',
        description: 'Digital Legacy Archives for Families, Leaders and Organisations.',
      },
    ],
  };
  // Static, first-party data only; escape HTML delimiters before placing JSON in a script.
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
