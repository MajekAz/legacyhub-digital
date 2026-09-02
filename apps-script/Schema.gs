/* Stable contract: append-only schema changes require coordinated migration. */
var LEAD_HEADERS = [
  'Lead_ID',
  'Created_At',
  'Name',
  'Email',
  'Phone',
  'Country',
  'Legacy_Subject_Type',
  'Subject_Name',
  'Living_Status',
  'Materials_Available',
  'Photo_Count_Range',
  'Service_Interest',
  'Preferred_Contact_Method',
  'Message',
  'Source',
  'Source_Page',
  'Landing_Page',
  'Referrer',
  'UTM_Source',
  'UTM_Medium',
  'UTM_Campaign',
  'UTM_Content',
  'UTM_Term',
  'Status',
  'Lead_Score',
  'Priority',
  'Assigned_To',
  'Next_Follow_Up',
  'Last_Contacted',
  'Admin_Notes',
  'Proposal_Status',
  'Quoted_Amount',
  'Deposit_Status',
  'Project_Status',
  'Updated_At',
  'Enquiry_Type',
  'Enquiry_Category',
  'Consent',
  'Consent_At',
  'Consent_Version',
  'Request_ID',
  'Payload_Hash',
  'Marketing_Consent',
  'Marketing_Consent_At',
  'Marketing_Consent_Version',
];
var PIPELINE = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'CONSULTATION_BOOKED',
  'PROPOSAL_SENT',
  'WON',
  'LOST',
  'ARCHIVED',
];
var FIELD_COLUMNS = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  country: 'Country',
  legacySubjectType: 'Legacy_Subject_Type',
  subjectName: 'Subject_Name',
  livingStatus: 'Living_Status',
  materialsAvailable: 'Materials_Available',
  photoCountRange: 'Photo_Count_Range',
  serviceInterest: 'Service_Interest',
  preferredContactMethod: 'Preferred_Contact_Method',
  message: 'Message',
  source: 'Source',
  sourcePage: 'Source_Page',
  landingPage: 'Landing_Page',
  referrer: 'Referrer',
  utmSource: 'UTM_Source',
  utmMedium: 'UTM_Medium',
  utmCampaign: 'UTM_Campaign',
  utmContent: 'UTM_Content',
  utmTerm: 'UTM_Term',
  type: 'Enquiry_Type',
  category: 'Enquiry_Category',
  consentVersion: 'Consent_Version',
  marketingConsent: 'Marketing_Consent',
  marketingConsentVersion: 'Marketing_Consent_Version',
};
function openCrm() {
  var id = PropertiesService.getScriptProperties().getProperty('CRM_SPREADSHEET_ID');
  if (!id) throw new Error('configuration');
  return SpreadsheetApp.openById(id);
}
function verifyHeaders(sheet, headers) {
  if (!sheet || sheet.getMaxColumns() < headers.length) throw new Error('schema');
  var actual = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  if (JSON.stringify(actual) !== JSON.stringify(headers)) throw new Error('schema');
}
function setupCrm() {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var book = openCrm();
    var tabs = {
      Leads: LEAD_HEADERS,
      Email_Nurture: NURTURE_HEADERS,
      Email_Suppression: SUPPRESSION_HEADERS,
      Email_Send_Log: SEND_HEADERS,
      Follow_Ups: ['Follow_Up_ID', 'Lead_ID', 'Due_At', 'Owner', 'Status', 'Notes'],
      Proposals: ['Proposal_ID', 'Lead_ID', 'Status', 'Quoted_Amount', 'Updated_At'],
      Projects: ['Project_ID', 'Lead_ID', 'Project_Status', 'Updated_At'],
      Business_Profile: ['Key', 'Value'],
      System_Config: ['Key', 'Value'],
      Activity_Log: ['Timestamp', 'Lead_ID', 'Event', 'Outcome'],
    };
    Object.keys(tabs).forEach(function (name) {
      var sheet = book.getSheetByName(name) || book.insertSheet(name);
      if (sheet.getMaxColumns() < tabs[name].length)
        sheet.insertColumnsAfter(sheet.getMaxColumns(), tabs[name].length - sheet.getMaxColumns());
      if (sheet.getLastRow() === 0) {
        sheet.getRange(1, 1, 1, tabs[name].length).setValues([tabs[name]]);
        sheet.setFrozenRows(1);
      } else if (name === 'Leads') {
        var previousHeaders = LEAD_HEADERS.slice(0, 42);
        var addedHeaders = LEAD_HEADERS.slice(42);
        verifyHeaders(sheet, previousHeaders);
        var existingTail = sheet
          .getRange(1, previousHeaders.length + 1, 1, addedHeaders.length)
          .getValues()[0];
        if (
          existingTail.every(function (value) {
            return value === '' || value === null;
          })
        )
          sheet
            .getRange(1, previousHeaders.length + 1, 1, addedHeaders.length)
            .setValues([addedHeaders]);
        else if (JSON.stringify(existingTail) !== JSON.stringify(addedHeaders))
          throw new Error('schema');
      } else verifyHeaders(sheet, tabs[name]);
    });
    var leads = book.getSheetByName('Leads');
    var props = PropertiesService.getScriptProperties();
    if (!props.getProperty('LEAD_COUNTER')) {
      if (leads.getLastRow() > 1) throw new Error('counter_requires_manual_recovery');
      props.setProperty('LEAD_COUNTER', '0');
    }
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(PIPELINE, true)
      .setAllowInvalid(false)
      .build();
    leads
      .getRange(2, LEAD_HEADERS.indexOf('Status') + 1, Math.max(leads.getMaxRows() - 1, 1))
      .setDataValidation(rule);
  } finally {
    lock.releaseLock();
  }
}
