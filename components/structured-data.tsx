const origin = 'https://legacyhubdigital.com';
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
export function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${origin}/#organization`,
        name: 'LegacyHub Digital Heritage',
        url: origin,
        description:
          'Done-for-you digital heritage website service for families, individuals, leaders and organisations.',
        areaServed: [
          { '@type': 'Country', name: 'United Kingdom' },
          { '@type': 'Place', name: 'Glasgow, Scotland' },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        name: 'LegacyHub Digital Heritage',
        url: origin,
        publisher: { '@id': `${origin}/#organization` },
        inLanguage: 'en-GB',
      },
      {
        '@type': 'Service',
        name: 'Done-for-You Digital Heritage Website Service',
        serviceType: 'Digital heritage website planning, design, development and launch',
        url: 'https://legacyhubdigital.com/services',
        description:
          'Complete digital heritage websites deployed to each client’s hosting account and custom domain.',
        provider: { '@id': `${origin}/#organization` },
        areaServed: { '@type': 'Country', name: 'United Kingdom' },
      },
      {
        '@type': 'WebPage',
        '@id': `${origin}/#homepage`,
        url: origin,
        name: 'LegacyHub Digital Heritage',
        description:
          'Complete, done-for-you digital heritage websites for families, individuals, leaders and organisations.',
        isPartOf: { '@id': `${origin}/#website` },
        about: { '@id': `${origin}/#organization` },
        inLanguage: 'en-GB',
      },
    ],
  };
  // Static, first-party data only; escape HTML delimiters before placing JSON in a script.
  return <JsonLd data={data} />;
}

export function PageStructuredData({
  title,
  description,
  path,
  kind = 'WebPage',
  breadcrumbs,
  faq,
}: {
  title: string;
  description: string;
  path: string;
  kind?: 'WebPage' | 'Service';
  breadcrumbs?: readonly [string, string][];
  faq?: readonly (readonly [string, string])[];
}) {
  const url = `${origin}${path}`;
  const graph: object[] = [
    {
      '@type': kind,
      '@id': `${url}#page`,
      url,
      name: title,
      description,
      inLanguage: 'en-GB',
      isPartOf: { '@id': `${origin}/#website` },
      ...(kind === 'Service'
        ? {
            provider: { '@id': `${origin}/#organization` },
            areaServed: { '@type': 'Country', name: 'United Kingdom' },
          }
        : {}),
    },
  ];
  if (breadcrumbs)
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map(([name, item], index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name,
        item: `${origin}${item}`,
      })),
    });
  if (faq?.length)
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faq.map(([name, text]) => ({
        '@type': 'Question',
        name,
        acceptedAnswer: { '@type': 'Answer', text },
      })),
    });
  return <JsonLd data={{ '@context': 'https://schema.org', '@graph': graph }} />;
}
