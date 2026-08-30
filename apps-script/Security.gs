function hex(bytes) {
  return bytes
    .map(function (b) {
      return ('0' + ((b + 256) % 256).toString(16)).slice(-2);
    })
    .join('');
}
function constantEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
function authenticate(envelope) {
  var secret = PropertiesService.getScriptProperties().getProperty('GOOGLE_CRM_SHARED_SECRET');
  if (!secret || secret.length < 32) throw new Error('configuration');
  if (
    !envelope ||
    typeof envelope !== 'object' ||
    Array.isArray(envelope) ||
    envelope.action !== 'createLead' ||
    typeof envelope.secret !== 'string' ||
    envelope.secret.length > 1024 ||
    !constantEqual(envelope.secret, secret)
  )
    throw new Error('unauthorised');
  if (
    envelope.requestId !== undefined &&
    (typeof envelope.requestId !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(envelope.requestId))
  )
    throw new Error('invalid');
}
function validateLead(data) {
  if (
    !data ||
    typeof data !== 'object' ||
    Array.isArray(data) ||
    data.consent !== true ||
    data.consentVersion !== '2026-08-28-v1'
  )
    throw new Error('invalid');
  var enums = {
    type: ['consultation', 'contact'],
    legacySubjectType: [
      '',
      'Parent',
      'Grandparent',
      'Family',
      'Traditional/community leader',
      'Veteran/professional',
      'Business founder',
      'Organisation',
      'Other',
    ],
    livingStatus: ['', 'Living', 'Late', 'Not applicable'],
    photoCountRange: ['', 'Under 50', '50–200', '200–500', 'More than 500', 'Not sure'],
    serviceInterest: [
      '',
      'Legacy Starter',
      'Family Heritage Archive',
      'Complete Digital Legacy Archive',
      'Documentary & Heritage Project',
      'Not sure yet',
    ],
    preferredContactMethod: ['WhatsApp', 'Email', 'Phone'],
    category: [
      '',
      'General enquiry',
      'Legacy project',
      'Partnership',
      'Media/documentary',
      'Technical',
      'Other',
    ],
  };
  var limits = {
    name: 100,
    email: 254,
    phone: 40,
    country: 80,
    subjectName: 150,
    message: 3000,
    sourcePage: 250,
    landingPage: 250,
    referrer: 250,
  };
  Object.keys(data).forEach(function (key) {
    if (key !== 'consent' && !Object.prototype.hasOwnProperty.call(FIELD_COLUMNS, key))
      throw new Error('unknown_field');
    if (key === 'consent' || key === 'materialsAvailable') return;
    if (typeof data[key] !== 'string' || data[key].length > (limits[key] || 120))
      throw new Error('invalid');
  });
  if (
    typeof data.name !== 'string' ||
    data.name.trim().length < 2 ||
    typeof data.email !== 'string' ||
    !/^\S+@\S+\.\S+$/.test(data.email)
  )
    throw new Error('invalid');
  Object.keys(enums).forEach(function (key) {
    if (enums[key].indexOf(data[key]) === -1) throw new Error('invalid');
  });
  var allowed = [
    'Photographs',
    'Documents',
    'Videos',
    'Audio recordings',
    'Written biography',
    'Family stories',
    'Other',
  ];
  if (
    !Array.isArray(data.materialsAvailable) ||
    data.materialsAvailable.length > 7 ||
    data.materialsAvailable.some(function (v) {
      return allowed.indexOf(v) === -1;
    })
  )
    throw new Error('invalid');
  if (data.phone && !/^[+()\d\s.-]{7,40}$/.test(data.phone)) throw new Error('invalid');
  if (data.preferredContactMethod !== 'Email' && !data.phone) throw new Error('invalid');
  ['sourcePage', 'landingPage'].forEach(function (k) {
    if (data[k] && !/^\/[a-zA-Z0-9/_-]*$/.test(data[k])) throw new Error('invalid');
  });
  if (data.referrer && !/^https?:\/\/[^/?#]+\/?$/.test(data.referrer)) throw new Error('invalid');
}
function sheetText(value) {
  if (value === null || value === undefined) return '';
  var text = String(value);
  return /^[\s]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text) ? "'" + text : text;
}
