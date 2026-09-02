function output(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
function doPost(e) {
  try {
    if (
      !e ||
      !e.postData ||
      !/^application\/json(?:;|$)/i.test(e.postData.type) ||
      e.postData.contents.length > 24000
    )
      return output({ ok: false, error: 'invalid_request' });
    var envelope = JSON.parse(e.postData.contents);
    authenticate(envelope);
    var data = envelope.data;
    validateLead(data);
    // The website always supplies requestId. Direct integrations may omit it,
    // but cannot safely retry without supplying their own stable UUID.
    var requestId = envelope.requestId || Utilities.getUuid();
    var payload = JSON.stringify(data, Object.keys(data).sort());
    var result = saveLead(data, requestId, payload);
    if (result.created) {
      try {
        notifyLead(data, result.leadId);
      } catch (err) {
        safeActivity(result.leadId, 'notifications', 'failed');
      }
    }
    return output({ ok: true, leadId: result.leadId });
  } catch (err) {
    return output({ ok: false, error: 'internal_error' });
  }
}
function doGet() {
  return output({ ok: false, error: 'method_not_allowed' });
}
function saveLead(data, requestId, payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var book = openCrm();
    var sheet = book.getSheetByName('Leads');
    verifyHeaders(sheet, LEAD_HEADERS);
    var hash = hex(
      Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, payload, Utilities.Charset.UTF_8),
    );
    if (sheet.getLastRow() > 1) {
      var existing = sheet
        .getRange(2, LEAD_HEADERS.indexOf('Request_ID') + 1, sheet.getLastRow() - 1, 1)
        .createTextFinder(requestId)
        .matchEntireCell(true)
        .findNext();
      if (existing) {
        var row = sheet.getRange(existing.getRow(), 1, 1, LEAD_HEADERS.length).getValues()[0];
        if (row[LEAD_HEADERS.indexOf('Payload_Hash')] !== hash)
          throw new Error('idempotency_conflict');
        ensureFollowUp(book, row[0], row[LEAD_HEADERS.indexOf('Next_Follow_Up')]);
        return { leadId: row[0], created: false };
      }
    }
    var props = PropertiesService.getScriptProperties();
    var counter = Number(props.getProperty('LEAD_COUNTER'));
    if (props.getProperty('LEAD_COUNTER') === null || !Number.isSafeInteger(counter) || counter < 0)
      throw new Error('counter');
    if (counter >= Number.MAX_SAFE_INTEGER) throw new Error('counter_exhausted');
    counter++;
    props.setProperty('LEAD_COUNTER', String(counter));
    var leadId = 'LHD-' + String(counter).padStart(4, '0');
    if (
      sheet.getLastRow() > 1 &&
      sheet
        .getRange(2, 1, sheet.getLastRow() - 1, 1)
        .createTextFinder(leadId)
        .matchEntireCell(true)
        .findNext()
    )
      throw new Error('counter_collision');
    var now = new Date().toISOString();
    var score = data.type === 'consultation' ? 60 : 30;
    if (data.phone) score += 10;
    if (data.serviceInterest && data.serviceInterest !== 'Not sure yet') score += 10;
    if (data.materialsAvailable.length) score += 10;
    var record = {
      Lead_ID: leadId,
      Created_At: now,
      Status: 'NEW',
      Lead_Score: score,
      Priority: score >= 80 ? 'Hot' : score >= 50 ? 'Warm' : 'Cold',
      Updated_At: now,
      Consent: true,
      Consent_At: now,
      Request_ID: requestId,
      Payload_Hash: hash,
      Project_Status: 'NOT_STARTED',
    };
    if (typeof data.marketingConsent === 'boolean') {
      record.Marketing_Consent = data.marketingConsent;
      record.Marketing_Consent_At = now;
    }
    Object.keys(FIELD_COLUMNS).forEach(function (key) {
      record[FIELD_COLUMNS[key]] = Array.isArray(data[key]) ? data[key].join('; ') : data[key];
    });
    var days = Number(props.getProperty('FOLLOW_UP_DAYS'));
    if (Number.isInteger(days) && days > 0 && days <= 365)
      record.Next_Follow_Up = new Date(Date.now() + days * 86400000).toISOString();
    sheet.appendRow(
      LEAD_HEADERS.map(function (key) {
        return typeof record[key] === 'number' || typeof record[key] === 'boolean'
          ? record[key]
          : sheetText(record[key]);
      }),
    );
    SpreadsheetApp.flush();
    safeActivity(leadId, 'lead_created', 'saved');
    ensureFollowUp(book, leadId, record.Next_Follow_Up);
    return { leadId: leadId, created: true };
  } finally {
    lock.releaseLock();
  }
}

// Called under the lead lock, including on retries, to repair partial follow-up writes.
function ensureFollowUp(book, leadId, dueAt) {
  if (!dueAt) return;
  try {
    var sheet = book.getSheetByName('Follow_Ups');
    verifyHeaders(sheet, ['Follow_Up_ID', 'Lead_ID', 'Due_At', 'Owner', 'Status', 'Notes']);
    var followUpId = 'FU-' + leadId;
    if (
      sheet.getLastRow() > 1 &&
      sheet
        .getRange(2, 1, sheet.getLastRow() - 1, 1)
        .createTextFinder(followUpId)
        .matchEntireCell(true)
        .findNext()
    )
      return;
    sheet.appendRow([followUpId, leadId, dueAt, '', 'PENDING', 'Initial enquiry follow-up']);
    SpreadsheetApp.flush();
    safeActivity(leadId, 'follow_up', 'created');
  } catch (err) {
    safeActivity(leadId, 'follow_up', 'failed');
  }
}
