import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { createHash, createHmac } from 'node:crypto';
import { beforeEach, it, expect, vi } from 'vitest';
import { leadSchema, CONSENT_VERSION } from '@/lib/lead-schema';
class Sheet {
  rows: unknown[][] = [];
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
      computeHmacSha256Signature: (value: string, key: string) =>
        Array.from(createHmac('sha256', key).update(value).digest()),
    },
    MailApp: { sendEmail: mail },
    ContentService: {
      MimeType: { JSON: 'json' },
      createTextOutput: (value: string) => ({ setMimeType: () => value }),
    },
  });
  for (const file of ['Schema', 'Security', 'Main', 'Notifications'])
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
  const payload = JSON.stringify({
    ...data,
    consentVersion: CONSENT_VERSION,
    source: 'Website consultation',
    ...patch,
  });
  const timestamp = Date.now();
  const signature = createHmac('sha256', secret)
    .update(`${timestamp}.${requestId}.${payload}`)
    .digest('hex');
  return { version: 1, action: 'createLead', requestId, timestamp, payload, signature };
}
const send = (e: ReturnType<typeof envelope>) =>
  JSON.parse(ctx.doPost({ postData: { type: 'application/json', contents: JSON.stringify(e) } }));
it('creates the exact seven CRM tabs and stable headers', () => {
  expect([...sheets.keys()]).toEqual([
    'Leads',
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
it('rejects tampering, expired signatures and missing consent without saving', () => {
  const bad = envelope();
  bad.signature = '0'.repeat(64);
  expect(send(bad).ok).toBe(false);
  const old = envelope();
  old.timestamp = 0;
  expect(send(old).ok).toBe(false);
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
