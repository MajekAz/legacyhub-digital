import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { createHash, randomUUID } from 'node:crypto';
import { beforeEach, it, expect, vi } from 'vitest';
import { leadSchema, CONSENT_VERSION } from '@/lib/lead-schema';
class Sheet {
  rows: unknown[][] = [];
  columns = 26;
  getMaxColumns() {
    return this.columns;
  }
  insertColumnsAfter(_after: number, count: number) {
    this.columns += count;
  }
  getLastRow() {
    return this.rows.length;
  }
  getMaxRows() {
    return Math.max(100, this.rows.length);
  }
  setFrozenRows() {}
  appendRow(row: unknown[]) {
    this.rows.push(row);
  }
  getRange(row: number, col: number, count = 1, width = 1) {
    if (col + width - 1 > this.columns) throw Error('column capacity');
    return {
      getRow: () => row,
      getValues: () =>
        Array.from(
          { length: count },
          (_, i) => this.rows[row - 1 + i]?.slice(col - 1, col - 1 + width) || [],
        ),
      setValues: (values: unknown[][]) => {
        values.forEach((value, i) => {
          this.rows[row - 1 + i] = [...value];
        });
      },
      setDataValidation: () => {},
      createTextFinder: (needle: string) => ({
        matchEntireCell: () => ({
          findNext: () => {
            for (let i = row - 1; i < this.rows.length; i++)
              if (this.rows[i][col - 1] === needle) return { getRow: () => i + 1 };
            return null;
          },
        }),
      }),
    };
  }
}
const secret = 'test-shared-secret-not-production-12345678';
const props = new Map<string, string>();
const sheets = new Map<string, Sheet>();
const lock = { waitLock: vi.fn(), releaseLock: vi.fn() };
const mail = vi.fn();
let ctx: ReturnType<typeof createContext>;
beforeEach(() => {
  props.clear();
  props.set('CRM_SPREADSHEET_ID', 'test-sheet');
  props.set('GOOGLE_CRM_SHARED_SECRET', secret);
  sheets.clear();
  mail.mockReset();
  lock.waitLock.mockClear();
  lock.releaseLock.mockClear();
  const book = {
    getSheetByName: (name: string) => sheets.get(name),
    insertSheet: (name: string) => {
      const sheet = new Sheet();
      sheets.set(name, sheet);
      return sheet;
    },
  };
  ctx = createContext({
    Date,
    JSON,
    Number,
    String,
    Object,
    Array,
    Error,
    RegExp,
    Math,
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (key: string) => props.get(key) ?? null,
        setProperty: (key: string, value: string) => props.set(key, value),
      }),
    },
    LockService: { getScriptLock: () => lock },
    SpreadsheetApp: {
      openById: () => book,
      flush: () => {},
      newDataValidation: () => ({
        requireValueInList: () => ({ setAllowInvalid: () => ({ build: () => ({}) }) }),
      }),
    },
    Utilities: {
      Charset: { UTF_8: 'utf8' },
      DigestAlgorithm: { SHA_256: 'sha256' },
      computeDigest: (_algo: string, value: string) =>
        Array.from(createHash('sha256').update(value).digest()),
      getUuid: randomUUID,
    },
    MailApp: {
      sendEmail: mail,
      getRemainingDailyQuota: () => Number(props.get('TEST_QUOTA') || '100'),
    },
    ContentService: {
      MimeType: { JSON: 'json' },
      createTextOutput: (value: string) => ({ setMimeType: () => value }),
    },
  });
  for (const file of [
    'Schema',
    'Security',
    'Main',
    'Notifications',
    'EmailTemplates',
    'EmailNurture',
  ])
    runInContext(readFileSync(`apps-script/${file}.gs`, 'utf8'), ctx);
  ctx.setupCrm();
});
function envelope(
  patch: Record<string, unknown> = {},
  requestId = '550e8400-e29b-41d4-a716-446655440000',
) {
  const {
    website,
    requestId: _id,
    ...data
  } = leadSchema.parse({
    requestId,
    type: 'consultation',
    name: 'Test Family',
    email: 'test@example.test',
    consent: true,
  });
  void website;
  void _id;
  return {
    secret,
    action: 'createLead',
    requestId,
    data: { ...data, consentVersion: CONSENT_VERSION, source: 'Website consultation', ...patch },
  };
}
const send = (e: ReturnType<typeof envelope>) =>
  JSON.parse(ctx.doPost({ postData: { type: 'application/json', contents: JSON.stringify(e) } }));
it('preserves CRM tabs and adds dedicated email tabs with stable headers', () => {
  expect([...sheets.keys()]).toEqual([
    'Leads',
    'Email_Nurture',
    'Email_Suppression',
    'Email_Send_Log',
    'Follow_Ups',
    'Proposals',
    'Projects',
    'Business_Profile',
    'System_Config',
    'Activity_Log',
  ]);
  expect(ctx.LEAD_HEADERS).toContain('Lead_ID');
  expect(ctx.LEAD_HEADERS).toContain('UTM_Campaign');
  expect(ctx.LEAD_HEADERS).toContain('Consent_Version');
  expect(ctx.LEAD_HEADERS.slice(-3)).toEqual([
    'Marketing_Consent',
    'Marketing_Consent_At',
    'Marketing_Consent_Version',
  ]);
});
it('generates central references under a script lock', () => {
  expect(send(envelope())).toEqual({ ok: true, leadId: 'LHD-0001' });
  expect(lock.waitLock).toHaveBeenCalled();
  expect(lock.releaseLock).toHaveBeenCalled();
  expect(props.get('LEAD_COUNTER')).toBe('1');
});
it('deduplicates retries and rejects changed payloads using the same request ID', () => {
  const e = envelope();
  expect(send(e).leadId).toBe('LHD-0001');
  expect(send(e).leadId).toBe('LHD-0001');
  expect(sheets.get('Leads')?.getLastRow()).toBe(2);
  expect(send(envelope({ message: 'changed' })).ok).toBe(false);
});
it('never derives IDs from row count', () => {
  send(envelope());
  sheets.get('Leads')?.rows.pop();
  expect(send(envelope({}, '550e8400-e29b-41d4-a716-446655440001')).leadId).toBe('LHD-0002');
});
it('rejects wrong secrets and missing consent without saving', () => {
  expect(send({ ...envelope(), secret: 'wrong' }).ok).toBe(false);
  expect(send({ ...envelope(), secret: '' }).ok).toBe(false);
  expect(send(envelope({ consent: false })).ok).toBe(false);
  expect(sheets.get('Leads')?.getLastRow()).toBe(1);
});
it('escapes formula-leading spreadsheet values', () => {
  send(envelope({ message: '=IMPORTXML("bad")' }));
  const row = sheets.get('Leads')!.rows[1];
  expect(row[ctx.LEAD_HEADERS.indexOf('Message')]).toBe('\'=IMPORTXML("bad")');
  expect(ctx.sheetText(' +test')).toBe("' +test");
});
it('rejects schema drift rather than shifting columns', () => {
  sheets.get('Leads')!.rows[0][0] = 'Renamed';
  expect(send(envelope()).ok).toBe(false);
});
it('email failures do not lose a successfully saved lead', () => {
  props.set('EMAIL_ENABLED', 'true');
  props.set('BUSINESS_NAME', 'Test Business');
  props.set('BUSINESS_REPLY_TO', 'reply@example.test');
  props.set('LEGACYHUB_LEADS_EMAIL', 'team@example.test');
  mail.mockImplementation(() => {
    throw Error('quota');
  });
  expect(send(envelope()).ok).toBe(true);
  expect(sheets.get('Activity_Log')!.rows.some((row) => row.includes('failed'))).toBe(true);
});
it('applies simple score, NEW status and configured follow-up date', () => {
  props.set('FOLLOW_UP_DAYS', '2');
  send(envelope({ phone: '+44 1234567890', serviceInterest: 'Family Heritage Archive' }));
  const row = sheets.get('Leads')!.rows[1];
  expect(row[ctx.LEAD_HEADERS.indexOf('Status')]).toBe('NEW');
  expect(row[ctx.LEAD_HEADERS.indexOf('Priority')]).toBe('Hot');
  expect(row[ctx.LEAD_HEADERS.indexOf('Next_Follow_Up')]).toBeTruthy();
});
it('expands a new Leads sheet to 45 columns', () => {
  expect(sheets.get('Leads')!.columns).toBe(45);
});
it('stores an explicit checklist marketing preference independently', () => {
  const e = envelope({
    type: 'lead_magnet',
    category: 'Family Legacy Checklist',
    serviceInterest: 'Not sure yet',
    source: 'Facebook',
    marketingConsent: false,
    marketingConsentVersion: '2026-08-31-v1',
  });
  expect(send(e).ok).toBe(true);
  const row = sheets.get('Leads')!.rows[1];
  expect(row[ctx.LEAD_HEADERS.indexOf('Marketing_Consent')]).toBe(false);
  expect(row[ctx.LEAD_HEADERS.indexOf('Marketing_Consent_At')]).toBeTruthy();
  expect(row[ctx.LEAD_HEADERS.indexOf('Marketing_Consent_Version')]).toBe('2026-08-31-v1');
});
it('creates only one follow-up when a lead is retried', () => {
  props.set('FOLLOW_UP_DAYS', '2');
  const e = envelope();
  send(e);
  send(e);
  expect(sheets.get('Follow_Ups')!.rows).toHaveLength(2);
  expect(sheets.get('Follow_Ups')!.rows[1][0]).toBe('FU-LHD-0001');
});
it.each(['', '0', '-1', '1.5', '366', 'bad'])('does not schedule invalid days %s', (days) => {
  props.set('FOLLOW_UP_DAYS', days);
  expect(send(envelope()).ok).toBe(true);
  expect(sheets.get('Follow_Ups')!.rows).toHaveLength(1);
});
it('repairs a failed follow-up on retry without duplicating the lead', () => {
  props.set('FOLLOW_UP_DAYS', '1');
  const sheet = sheets.get('Follow_Ups')!;
  vi.spyOn(sheet, 'appendRow').mockImplementationOnce(() => {
    throw Error('temporary');
  });
  const e = envelope();
  expect(send(e).ok).toBe(true);
  expect(sheet.rows).toHaveLength(1);
  expect(send(e).leadId).toBe('LHD-0001');
  expect(sheet.rows).toHaveLength(2);
  expect(sheets.get('Leads')!.rows).toHaveLength(2);
});
it('accepts the requested three-field envelope without a request ID', () => {
  const { requestId, ...e } = envelope();
  void requestId;
  const result = JSON.parse(
    ctx.doPost({ postData: { type: 'application/json', contents: JSON.stringify(e) } }),
  );
  expect(result).toEqual({ ok: true, leadId: 'LHD-0001' });
});
it('rejects counter collisions without saving a duplicate ID', () => {
  send(envelope());
  props.set('LEAD_COUNTER', '0');
  expect(send(envelope({}, '550e8400-e29b-41d4-a716-446655440001')).ok).toBe(false);
  expect(sheets.get('Leads')!.rows).toHaveLength(2);
});
it('sends configured emails only once per saved request', () => {
  props.set('EMAIL_ENABLED', 'true');
  props.set('BUSINESS_NAME', 'Test Business');
  props.set('BUSINESS_REPLY_TO', 'reply@example.test');
  props.set('LEGACYHUB_LEADS_EMAIL', 'team@example.test');
  const e = envelope();
  send(e);
  send(e);
  expect(mail).toHaveBeenCalledTimes(2);
});

function magnet(consent = true) {
  return envelope({
    type: 'lead_magnet',
    category: 'Family Legacy Checklist',
    serviceInterest: 'Not sure yet',
    marketingConsent: consent,
    marketingConsentVersion: '2026-08-31-v1',
  });
}
function enableEmails() {
  props.set('EMAIL_ENABLED', 'true');
  props.set('NURTURE_ENABLED', 'true');
  props.set('EMAIL_FROM_NAME', 'Test Business');
  props.set('EMAIL_REPLY_TO', 'reply@example.test');
}
function due() {
  sheets.get('Email_Nurture')!.rows[1][7] = '2020-01-01T00:00:00.000Z';
}
function unsubscribe(token: unknown) {
  return JSON.parse(
    ctx.doPost({
      postData: {
        type: 'application/json',
        contents: JSON.stringify({ secret, action: 'unsubscribe', data: { token } }),
      },
    }),
  );
}
it('delivers the requested guide with marketing OFF, with no enrolment or nurture sends', () => {
  enableEmails();
  send(magnet(false));
  ctx.processEmailNurtureQueue();
  expect(mail).toHaveBeenCalledTimes(1);
  expect(mail.mock.calls[0][0].subject).toBe('Your Family Legacy Preservation Guide');
  expect(mail.mock.calls[0][0].body).toContain(
    '/downloads/LegacyHub_Family_Legacy_Preservation_Guide.pdf',
  );
  expect(sheets.get('Email_Nurture')!.rows).toHaveLength(1);
  expect(
    sheets.get('Activity_Log')!.rows.some((r) => r[2] === 'guide_delivery' && r[3] === 'sent'),
  ).toBe(true);
});
it('enrols consented magnet once and schedules Day 2 from creation', () => {
  const e = magnet();
  send(e);
  send(e);
  const rows = sheets.get('Email_Nurture')!.rows;
  expect(rows).toHaveLength(2);
  expect(rows[1][0]).toBe('NUR-LHD-0001');
  expect(rows[1][4]).toBe('ACTIVE');
  expect(rows[1][6]).toBe(2);
  expect(Date.parse(String(rows[1][7])) - Date.parse(String(rows[1][5]))).toBe(2 * 86400000);
  expect(rows[1][14]).toMatch(/^[a-f0-9]{64}$/);
});
it.each(['consultation', 'contact'])('never enrols an existing %s enquiry', (type) => {
  enableEmails();
  send(envelope({ type }));
  ctx.processEmailNurtureQueue();
  expect(sheets.get('Email_Nurture')!.rows).toHaveLength(1);
  expect(mail.mock.calls[0][0].subject).toBe('We received your LegacyHub Digital Heritage enquiry');
});
it('requires the explicit processor switch even for ACTIVE due records', () => {
  send(magnet());
  due();
  ctx.processEmailNurtureQueue();
  expect(mail).not.toHaveBeenCalled();
});
it('unsubscribes all matching addresses without deleting consent evidence; replay is safe', () => {
  send(magnet());
  send({ ...magnet(), requestId: randomUUID() });
  const original = JSON.stringify(sheets.get('Leads')!.rows);
  const token = sheets.get('Email_Nurture')!.rows[1][14];
  expect(unsubscribe(token)).toEqual({ ok: true, status: 'unsubscribed' });
  expect(unsubscribe(token)).toEqual({ ok: true, status: 'already_unsubscribed' });
  expect(sheets.get('Email_Suppression')!.rows).toHaveLength(2);
  expect(
    sheets
      .get('Email_Nurture')!
      .rows.slice(1)
      .every((r) => r[4] === 'UNSUBSCRIBED' && r[10]),
  ).toBe(true);
  expect(JSON.stringify(sheets.get('Leads')!.rows)).toBe(original);
  enableEmails();
  ctx.processEmailNurtureQueue();
  expect(mail).not.toHaveBeenCalled();
  send({ ...magnet(), requestId: randomUUID() });
  expect(sheets.get('Email_Nurture')!.rows).toHaveLength(3);
});
it.each(['', 'a'.repeat(64), 'bad', null])('invalid token %s never mutates CRM', (token) => {
  send(magnet());
  const before = JSON.stringify([...sheets]);
  expect(unsubscribe(token)).toEqual({ ok: false, error: 'invalid_token' });
  expect(JSON.stringify([...sheets])).toBe(before);
});
it('suppression blocks enrolment and sends with normalized addresses', () => {
  sheets.get('Email_Suppression')!.appendRow([' TEST@EXAMPLE.TEST ', '', 'manual', '', 'admin']);
  send(magnet());
  expect(sheets.get('Email_Nurture')!.rows).toHaveLength(1);
  sheets.get('Email_Suppression')!.rows.pop();
  send(magnet());
  due();
  sheets.get('Email_Suppression')!.appendRow(['TEST@example.test', '', 'manual', '', 'admin']);
  enableEmails();
  ctx.processEmailNurtureQueue();
  expect(mail).not.toHaveBeenCalled();
  expect(sheets.get('Email_Nurture')!.rows[1][4]).toBe('PAUSED');
});
it.each([false, '', undefined, 'TRUE'])('fails closed when live consent becomes %s', (consent) => {
  send(magnet());
  due();
  enableEmails();
  sheets.get('Leads')!.rows[1][ctx.LEAD_HEADERS.indexOf('Marketing_Consent')] = consent;
  ctx.processEmailNurtureQueue();
  expect(mail).not.toHaveBeenCalled();
  expect(sheets.get('Email_Nurture')!.rows[1][4]).toBe('PAUSED');
});
it('sends each due email once and completes after Email 5', () => {
  send(magnet());
  enableEmails();
  for (let n = 2; n <= 5; n++) {
    due();
    ctx.processEmailNurtureQueue();
    ctx.processEmailNurtureQueue();
    expect(mail).toHaveBeenCalledTimes(n - 1);
    expect(sheets.get('Email_Nurture')!.rows[1][8]).toBe(n);
  }
  expect(sheets.get('Email_Nurture')!.rows[1][4]).toBe('COMPLETED');
  expect(sheets.get('Email_Nurture')!.rows[1][11]).toBeTruthy();
  expect(
    sheets
      .get('Email_Send_Log')!
      .rows.slice(1)
      .every((r) => r[3] === 'SENT' && r[4] && r[5]),
  ).toBe(true);
  expect(sheets.get('Activity_Log')!.rows.some((r) => r[2] === 'nurture_completed')).toBe(true);
  expect(
    mail.mock.calls.every(
      ([m]) => m.body.includes('/unsubscribe#token=') && !m.body.includes(secret),
    ),
  ).toBe(true);
});
it('repairs a SENT ledger entry without sending again', () => {
  send(magnet());
  due();
  enableEmails();
  ctx.processEmailNurtureQueue();
  const row = sheets.get('Email_Nurture')!.rows[1];
  row[6] = 2;
  row[8] = '';
  due();
  ctx.processEmailNurtureQueue();
  expect(mail).toHaveBeenCalledTimes(1);
  expect(sheets.get('Email_Nurture')!.rows[1][6]).toBe(3);
});
it('pauses ambiguous delivery rather than retrying a CLAIMED email', () => {
  send(magnet());
  due();
  enableEmails();
  mail.mockImplementationOnce(() => {
    throw new Error('private quota detail');
  });
  ctx.processEmailNurtureQueue();
  const row = sheets.get('Email_Nurture')!.rows[1];
  expect(row[4]).toBe('FAILED');
  row[4] = 'ACTIVE';
  ctx.processEmailNurtureQueue();
  expect(mail).toHaveBeenCalledTimes(1);
  expect(JSON.stringify([...sheets])).not.toContain('private quota detail');
});
it('defers on low quota without claiming a send', () => {
  send(magnet());
  due();
  enableEmails();
  props.set('TEST_QUOTA', '5');
  ctx.processEmailNurtureQueue();
  expect(mail).not.toHaveBeenCalled();
  expect(sheets.get('Email_Send_Log')!.rows).toHaveLength(1);
});
it('limits a processor run to its configured batch', () => {
  send(magnet());
  send({ ...magnet(), requestId: randomUUID() });
  for (const row of sheets.get('Email_Nurture')!.rows.slice(1)) row[7] = '2020-01-01T00:00:00.000Z';
  enableEmails();
  props.set('NURTURE_BATCH_SIZE', '1');
  ctx.processEmailNurtureQueue();
  expect(mail).toHaveBeenCalledTimes(1);
});
it('setup is repeatable and preserves all existing data', () => {
  send(magnet());
  const before = JSON.stringify([...sheets]);
  ctx.setupCrm();
  expect(JSON.stringify([...sheets])).toBe(before);
});
it('does not mutate unsubscribe state without the server credential', () => {
  send(magnet());
  const before = JSON.stringify([...sheets]);
  const result = JSON.parse(
    ctx.doPost({
      postData: {
        type: 'application/json',
        contents: JSON.stringify({
          action: 'unsubscribe',
          secret: 'wrong',
          data: { token: sheets.get('Email_Nurture')!.rows[1][14] },
        }),
      },
    }),
  );
  expect(result.ok).toBe(false);
  expect(JSON.stringify([...sheets])).toBe(before);
});
it('suppression remains effective if unsubscribe queue writes fail, and retry repairs them', () => {
  send(magnet());
  const token = sheets.get('Email_Nurture')!.rows[1][14];
  const sheet = sheets.get('Email_Nurture')!;
  const original = sheet.getRange.bind(sheet);
  vi.spyOn(sheet, 'getRange').mockImplementation((row, col, count, width) => {
    const range = original(row, col, count, width);
    return {
      ...range,
      setValues: () => {
        throw Error('temporary');
      },
    };
  });
  expect(unsubscribe(token).ok).toBe(false);
  expect(sheets.get('Email_Suppression')!.rows).toHaveLength(2);
  vi.mocked(sheet.getRange).mockRestore();
  enableEmails();
  due();
  ctx.processEmailNurtureQueue();
  expect(mail).not.toHaveBeenCalled();
  expect(unsubscribe(token).ok).toBe(true);
  expect(sheet.rows[1][4]).toBe('UNSUBSCRIBED');
});
it('schema failure in the queue does not break successful lead creation or guide delivery', () => {
  enableEmails();
  sheets.delete('Email_Nurture');
  expect(send(magnet()).ok).toBe(true);
  expect(mail).toHaveBeenCalledTimes(1);
  expect(sheets.get('Activity_Log')!.rows.some((r) => r[3] === 'enrolment_requires_review')).toBe(
    true,
  );
});
it('does not send future emails early or compress late sends into a burst', () => {
  send(magnet());
  enableEmails();
  ctx.processEmailNurtureQueue();
  expect(mail).not.toHaveBeenCalled();
  due();
  ctx.processEmailNurtureQueue();
  const row = sheets.get('Email_Nurture')!.rows[1];
  expect(Date.parse(String(row[7])) - Date.parse(String(row[9]))).toBeGreaterThanOrEqual(
    2 * 86400000,
  );
});
