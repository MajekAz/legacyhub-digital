function safeActivity(leadId, event, outcome) {
  try {
    openCrm()
      .getSheetByName('Activity_Log')
      .appendRow([new Date().toISOString(), sheetText(leadId), event, outcome]);
  } catch (err) {
    /* Do not expose or log personal data. */
  }
}
function notifyLead(data, leadId) {
  var props = PropertiesService.getScriptProperties();
  var name = props.getProperty('EMAIL_FROM_NAME') || props.getProperty('BUSINESS_NAME');
  var replyTo = props.getProperty('EMAIL_REPLY_TO') || props.getProperty('BUSINESS_REPLY_TO');
  if (props.getProperty('EMAIL_ENABLED') !== 'true' || !name || !replyTo) {
    safeActivity(leadId, 'email', 'disabled');
    return;
  }
  try {
    MailApp.sendEmail({
      to: data.email,
      subject:
        data.type === 'lead_magnet'
          ? 'Your Family Legacy Preservation Guide'
          : 'We received your LegacyHub Digital Heritage enquiry',
      name: name,
      replyTo: replyTo,
      body:
        data.type === 'lead_magnet'
          ? guideDeliveryBody(data.name)
          : 'Hello ' +
            data.name +
            ',\n\nThank you for contacting LegacyHub Digital Heritage. We have received your enquiry and will follow up using your preferred contact method.\n\nReference: ' +
            leadId +
            '\n\nThis acknowledgement does not confirm an appointment or create a contract.\n\n' +
            name,
    });
    safeActivity(
      leadId,
      data.type === 'lead_magnet' ? 'guide_delivery' : 'acknowledgement',
      'sent',
    );
  } catch (err) {
    safeActivity(
      leadId,
      data.type === 'lead_magnet' ? 'guide_delivery' : 'acknowledgement',
      'failed',
    );
  }
  var internal = props.getProperty('LEGACYHUB_LEADS_EMAIL');
  if (!internal) {
    safeActivity(leadId, 'internal_notification', 'disabled');
    return;
  }
  try {
    MailApp.sendEmail({
      to: internal,
      name: name,
      replyTo: replyTo,
      subject:
        'New LegacyHub Digital lead: ' + (data.serviceInterest || data.category || 'Enquiry'),
      body: [
        'Lead ID: ' + leadId,
        'Name: ' + data.name,
        'Email: ' + data.email,
        'Phone: ' + data.phone,
        'Country: ' + data.country,
        'Service interest: ' + data.serviceInterest,
        'Preferred contact: ' + data.preferredContactMethod,
        'Source: ' + data.source,
        'Campaign: ' + data.utmCampaign,
        'Open your private LegacyHub CRM in Google Drive and find the Lead ID.',
      ].join('\n'),
    });
    safeActivity(leadId, 'internal_notification', 'sent');
  } catch (err) {
    safeActivity(leadId, 'internal_notification', 'failed');
  }
}
