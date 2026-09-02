var NURTURE_HEADERS = [
  'Nurture_ID',
  'Lead_ID',
  'Email',
  'Sequence',
  'Status',
  'Enrolled_At',
  'Next_Email_Number',
  'Next_Send_At',
  'Last_Email_Number',
  'Last_Sent_At',
  'Unsubscribed_At',
  'Completed_At',
  'Last_Error',
  'Updated_At',
  'Unsubscribe_Token',
];
var SUPPRESSION_HEADERS = ['Email', 'Lead_ID', 'Reason', 'Suppressed_At', 'Source'];
// A durable claim before MailApp prevents retry duplicates, including ambiguous failures.
var SEND_HEADERS = ['Send_ID', 'Lead_ID', 'Email_Number', 'Status', 'Claimed_At', 'Sent_At'];
var NURTURE_DAYS = { 2: 2, 3: 4, 4: 7, 5: 10 };
function nurtureRows(book, name, headers) {
  var sheet = book.getSheetByName(name);
  verifyHeaders(sheet, headers);
  return sheet.getLastRow() > 1
    ? sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues()
    : [];
}
function nurtureWrite(book, rowNumber, row) {
  book
    .getSheetByName('Email_Nurture')
    .getRange(rowNumber, 1, 1, NURTURE_HEADERS.length)
    .setValues([row]);
  SpreadsheetApp.flush();
}
function normalEmail(email) {
  return String(email || '')
    .trim()
    .toLowerCase();
}
function isSuppressed(book, email) {
  return (
    nurtureRows(book, 'Email_Suppression', SUPPRESSION_HEADERS).some(function (r) {
      return normalEmail(r[0]) === normalEmail(email);
    }) ||
    nurtureRows(book, 'Email_Nurture', NURTURE_HEADERS).some(function (r) {
      return normalEmail(r[2]) === normalEmail(email) && (r[4] === 'UNSUBSCRIBED' || !!r[10]);
    })
  );
}
// Called only under saveLead's lock. A queue failure must not lose a CRM lead.
function safeEnrolNurture(book, leadId, data, createdAt) {
  if (
    data.type !== 'lead_magnet' ||
    data.category !== 'Family Legacy Checklist' ||
    data.marketingConsent !== true
  )
    return;
  try {
    var leads = nurtureRows(book, 'Leads', LEAD_HEADERS);
    var lead = leads.filter(function (r) {
      return r[0] === leadId;
    })[0];
    if (!lead || lead[LEAD_HEADERS.indexOf('Marketing_Consent')] !== true) return;
    var rows = nurtureRows(book, 'Email_Nurture', NURTURE_HEADERS);
    if (
      rows.some(function (r) {
        return r[0] === 'NUR-' + leadId;
      })
    )
      return;
    if (isSuppressed(book, data.email)) {
      safeActivity(leadId, 'nurture_suppressed', 'not_enrolled');
      return;
    }
    var now = new Date().toISOString();
    var enrolled = new Date(createdAt).toISOString();
    var token = (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '').toLowerCase();
    book
      .getSheetByName('Email_Nurture')
      .appendRow([
        'NUR-' + leadId,
        leadId,
        sheetText(normalEmail(data.email)),
        'family-legacy-v1',
        'ACTIVE',
        enrolled,
        2,
        new Date(Date.parse(enrolled) + 2 * 86400000).toISOString(),
        '',
        '',
        '',
        '',
        '',
        now,
        token,
      ]);
    SpreadsheetApp.flush();
    safeActivity(leadId, 'nurture_enrolled', 'email_2_scheduled');
  } catch (err) {
    safeActivity(leadId, 'nurture_failed', 'enrolment_requires_review');
  }
}
function unsubscribeNurture(data) {
  if (!data || typeof data.token !== 'string' || !/^[a-f0-9]{64}$/.test(data.token))
    return { ok: false, error: 'invalid_token' };
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var book = openCrm();
    var rows = nurtureRows(book, 'Email_Nurture', NURTURE_HEADERS);
    var found = rows.filter(function (r) {
      return constantEqual(r[14], data.token);
    })[0];
    if (!found) return { ok: false, error: 'invalid_token' };
    var email = normalEmail(found[2]);
    var already = found[4] === 'UNSUBSCRIBED';
    var suppressed = nurtureRows(book, 'Email_Suppression', SUPPRESSION_HEADERS);
    var now = new Date().toISOString();
    // Suppression first: even a partial row-update failure blocks further sends.
    if (
      !suppressed.some(function (r) {
        return normalEmail(r[0]) === email;
      })
    ) {
      book
        .getSheetByName('Email_Suppression')
        .appendRow([sheetText(email), found[1], 'unsubscribe', now, 'website']);
      SpreadsheetApp.flush();
    }
    rows.forEach(function (r, i) {
      if (normalEmail(r[2]) !== email) return;
      var changed = r[4] !== 'UNSUBSCRIBED';
      r[4] = 'UNSUBSCRIBED';
      r[7] = '';
      r[10] = r[10] || now;
      r[13] = now;
      nurtureWrite(book, i + 2, r);
      if (changed) safeActivity(r[1], 'nurture_unsubscribed', 'suppressed');
    });
    return { ok: true, status: already ? 'already_unsubscribed' : 'unsubscribed' };
  } finally {
    lock.releaseLock();
  }
}
function processEmailNurtureQueue() {
  var props = PropertiesService.getScriptProperties();
  if (
    props.getProperty('NURTURE_ENABLED') !== 'true' ||
    props.getProperty('EMAIL_ENABLED') !== 'true'
  )
    return;
  var name = props.getProperty('EMAIL_FROM_NAME') || props.getProperty('BUSINESS_NAME');
  var replyTo = props.getProperty('EMAIL_REPLY_TO') || props.getProperty('BUSINESS_REPLY_TO');
  if (!name || !replyTo) {
    safeActivity('', 'nurture_failed', 'sender_configuration');
    return;
  }
  var limit = Number(props.getProperty('NURTURE_BATCH_SIZE') || '10');
  if (!Number.isInteger(limit) || limit < 1 || limit > 25) return;
  var started = Date.now();
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var book = openCrm();
    var rows = nurtureRows(book, 'Email_Nurture', NURTURE_HEADERS);
    var attempts = 0;
    for (var i = 0; i < rows.length; i++) {
      if (attempts >= limit || Date.now() - started > 45000) break;
      var r = rows[i];
      if (r[4] !== 'ACTIVE') continue;
      if (!Number.isFinite(Date.parse(r[7]))) {
        r[4] = 'FAILED';
        r[12] = 'invalid_schedule';
        nurtureWrite(book, i + 2, r);
        continue;
      }
      if (Date.parse(r[7]) > Date.now()) continue;
      attempts++;
      try {
        // Fresh reads for each due send, never infer consent from enrolment.
        var lead = nurtureRows(book, 'Leads', LEAD_HEADERS).filter(function (l) {
          return l[0] === r[1];
        })[0];
        if (
          !lead ||
          lead[LEAD_HEADERS.indexOf('Marketing_Consent')] !== true ||
          lead[LEAD_HEADERS.indexOf('Enquiry_Type')] !== 'lead_magnet' ||
          normalEmail(lead[LEAD_HEADERS.indexOf('Email')]) !== normalEmail(r[2])
        ) {
          r[4] = 'PAUSED';
          r[12] = 'consent_or_recipient_unavailable';
          nurtureWrite(book, i + 2, r);
          safeActivity(r[1], 'nurture_suppressed', 'consent_unavailable');
          continue;
        }
        if (r[10] || isSuppressed(book, r[2])) {
          r[4] = r[10] ? 'UNSUBSCRIBED' : 'PAUSED';
          r[12] = 'suppressed';
          nurtureWrite(book, i + 2, r);
          safeActivity(r[1], 'nurture_suppressed', 'blocked');
          continue;
        }
        var number = Number(r[6]);
        if (!NURTURE_DAYS[number] || r[3] !== 'family-legacy-v1' || !/^[a-f0-9]{64}$/.test(r[14]))
          throw new Error('invalid_queue');
        var sendId = r[0] + '-E' + number;
        var ledger = nurtureRows(book, 'Email_Send_Log', SEND_HEADERS);
        var previous = ledger.filter(function (l) {
          return l[0] === sendId;
        })[0];
        if (previous && previous[3] === 'SENT') {
          advanceNurture(book, i + 2, r, number, previous[5]);
          continue;
        }
        if (previous || Number(r[8]) >= number) throw new Error('delivery_requires_review');
        if (MailApp.getRemainingDailyQuota() <= 5) {
          safeActivity(r[1], 'nurture_failed', 'quota_deferred');
          break;
        }
        var template = nurtureTemplate(number, lead[LEAD_HEADERS.indexOf('Name')], r[14]);
        var log = book.getSheetByName('Email_Send_Log');
        var claimedAt = new Date().toISOString();
        log.appendRow([sendId, r[1], number, 'CLAIMED', claimedAt, '']);
        SpreadsheetApp.flush();
        var logRow = log.getLastRow();
        MailApp.sendEmail({
          to: normalEmail(r[2]),
          name: name,
          replyTo: replyTo,
          subject: template.subject,
          body: template.body,
        });
        var sentAt = new Date().toISOString();
        log
          .getRange(logRow, 1, 1, SEND_HEADERS.length)
          .setValues([[sendId, r[1], number, 'SENT', claimedAt, sentAt]]);
        SpreadsheetApp.flush();
        safeActivity(r[1], 'nurture_email_' + number, 'sent');
        advanceNurture(book, i + 2, r, number, sentAt);
      } catch (err) {
        r[4] = 'FAILED';
        r[12] = 'delivery_requires_review';
        r[13] = new Date().toISOString();
        nurtureWrite(book, i + 2, r);
        safeActivity(r[1], 'nurture_failed', 'delivery_requires_review');
      }
    }
  } finally {
    lock.releaseLock();
  }
}
function advanceNurture(book, rowNumber, row, number, sentAt) {
  row[8] = number;
  row[9] = sentAt;
  row[12] = '';
  row[13] = new Date().toISOString();
  if (number === 5) {
    row[4] = 'COMPLETED';
    row[6] = '';
    row[7] = '';
    row[11] = sentAt;
  } else {
    row[6] = number + 1;
    // Missed triggers must not cause a burst of catch-up messages.
    row[7] = new Date(
      Math.max(
        Date.parse(row[5]) + NURTURE_DAYS[number + 1] * 86400000,
        Date.parse(sentAt) + (NURTURE_DAYS[number + 1] - NURTURE_DAYS[number]) * 86400000,
      ),
    ).toISOString();
  }
  nurtureWrite(book, rowNumber, row);
  if (number === 5) safeActivity(row[1], 'nurture_completed', 'completed');
}
