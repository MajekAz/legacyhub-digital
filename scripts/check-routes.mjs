const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3100';
const paths = [
  '/',
  '/services',
  '/how-it-works',
  '/who-we-serve',
  '/case-studies',
  '/case-studies/baba-muyi',
  '/packages',
  '/about',
  '/contact',
  '/book-consultation',
  '/privacy',
  '/terms',
  '/landing/family-legacy',
  '/landing/diaspora-family-archive',
  '/landing/memorial-archive',
  '/landing/leaders-and-veterans',
  '/landing/organisations',
];
for (const path of paths) {
  const response = await fetch(base + path);
  const html = await response.text();
  if (response.status !== 200 || !html.includes('<h1') || !html.includes('LegacyHub'))
    throw Error(`Failed ${path}: ${response.status}`);
  if (!html.includes(`href="https://legacyhubdigital.com${path === '/' ? '' : path}`))
    throw Error(`Missing canonical ${path}`);
  if (html.includes('GOOGLE_CRM_SHARED_SECRET') || html.includes('script.google.com/macros'))
    throw Error(`Server config leaked ${path}`);
  console.log(`PASS ${path}`);
}
for (const path of ['/sitemap.xml', '/robots.txt', '/og.png']) {
  const response = await fetch(base + path);
  if (response.status !== 200) throw Error(`Failed ${path}`);
  console.log(`PASS ${path}`);
}
if ((await fetch(base + '/api/leads')).status !== 405) throw Error('API GET not rejected');
if ((await fetch(base + '/landing/not-a-campaign')).status !== 404)
  throw Error('Unknown campaign not rejected');
console.log('PASS API method and unknown campaign checks');
