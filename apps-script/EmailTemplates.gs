function guideDeliveryBody(name) {
  var firstName = String(name || '').trim().split(/\s+/)[0] || 'there';

  return (
    'Hello ' +
    firstName +
    ',\n\n' +
    'Thank you for requesting A Legacy to Last: 25 Steps to Safeguard Family Memories from LegacyHub Digital Heritage.\n\n' +
    'Your guide is ready here:\n' +
    'https://legacyhubdigital.com/downloads/LegacyHub_Family_Legacy_Preservation_Guide.pdf\n\n' +
    'A simple place to begin is with one photograph, one document and one conversation. Add the names, dates, places and stories you already know, and do not worry about organising everything at once.\n\n' +
    'We hope the guide helps you take a meaningful first step towards preserving your family story.\n\n' +
    'Warm regards,\n' +
    'LegacyHub Digital Heritage\n' +
    'Preserve a Life. Protect a Story. Connect Generations.\n' +
    'https://legacyhubdigital.com\n\n' +
    'You are receiving this message because you requested the Family Legacy Preservation Guide.'
  );
}

function nurtureTemplate(number, name, token) {
  var firstName = String(name || '').trim().split(/\s+/)[0] || 'there';

  var templates = {
    2: [
      'The stories photographs cannot tell by themselves',
      'A photograph may preserve a face or a moment, but on its own it may not tell future generations who the people were, where the photograph was taken, when it happened or why the moment mattered.\n\n' +
        'This is where context becomes part of preservation.\n\n' +
        'Choose 10 family photographs and write down what you know about each one:\n\n' +
        '• Who is pictured?\n' +
        '• When was it taken?\n' +
        '• Where was it taken?\n' +
        '• How are the people related?\n' +
        '• What was happening at the time?\n' +
        '• Why is the photograph important to your family?\n\n' +
        'If you are unsure about something, simply mark it as uncertain. You can ask another relative later.\n\n' +
        'Your small action today: choose 10 photographs and give them a story.',
    ],

    3: [
      '5 family stories worth recording',
      'Photographs preserve moments, but conversations preserve voices, emotions, humour, memories and lessons that may never have been written down.\n\n' +
        'Here are five useful places to begin:\n\n' +
        '1. Childhood — What was home like when you were growing up?\n\n' +
        '2. Migration — What do you remember about moving from one town, region or country to another?\n\n' +
        '3. Career or business — Which experience shaped your working life the most?\n\n' +
        '4. Family traditions — Which customs, celebrations or practices should future generations remember?\n\n' +
        '5. Challenges and turning points — What difficult experience changed you, and what lesson did you take from it?\n\n' +
        'You do not need a formal interview. One meaningful question can begin an important family conversation.\n\n' +
        'Your small action today: ask one relative one question and listen without rushing them.\n\n' +
        'If you would like to record the conversation, ask their permission first.',
    ],

    4: [
      'From scattered memories to a family archive',
      'Family history is often scattered across many places: photographs in albums, documents in drawers, videos on phones, voice notes in WhatsApp, certificates in folders and stories remembered by different relatives.\n\n' +
        'A digital family archive brings those pieces together with context.\n\n' +
        'It can include:\n\n' +
        '• photographs and captions\n' +
        '• biographies and personal stories\n' +
        '• important documents\n' +
        '• family timelines\n' +
        '• audio interviews\n' +
        '• video memories\n' +
        '• family-tree information\n' +
        '• important places and migration history\n\n' +
        'The aim is not simply to collect files. It is to organise them so future generations can understand the people, relationships and experiences behind them.\n\n' +
        'You can start with whatever material you already have, while deciding carefully what should remain private.\n\n' +
        'See how LegacyHub works:\n' +
        'https://legacyhubdigital.com/how-it-works',
    ],

    5: [
      'Would you like help preserving your family story?',
      'By now, you may have begun identifying photographs, documents, memories or relatives whose stories you would like to preserve.\n\n' +
        'You do not need to have everything organised before speaking with LegacyHub Digital Heritage.\n\n' +
        'A few photographs, some documents, a family story or simply an idea of whose legacy matters to you can be enough to begin the conversation.\n\n' +
        'During a Legacy Consultation, we can discuss:\n\n' +
        '• whose story you want to preserve\n' +
        '• what materials you currently have\n' +
        '• what may still need to be collected\n' +
        '• the type of digital archive that could suit your family\n' +
        '• a sensible next step\n\n' +
        'There is no need to rush or have everything ready first.\n\n' +
        'Book a Legacy Consultation:\n' +
        'https://legacyhubdigital.com/book-consultation',
    ],
  };

  if (!templates[number]) {
    throw new Error('template');
  }

  return {
    subject: templates[number][0],

    body:
      'Hello ' +
      firstName +
      ',\n\n' +
      templates[number][1] +
      '\n\nWarm regards,\n' +
      'LegacyHub Digital Heritage\n' +
      'Preserve a Life. Protect a Story. Connect Generations.\n' +
      'https://legacyhubdigital.com\n\n' +
      'You are receiving these practical family-legacy emails because you chose to receive them when requesting the Family Legacy Preservation Guide.\n\n' +
      'Unsubscribe from future marketing emails:\n' +
      'https://legacyhubdigital.com/unsubscribe#token=' +
      token,
  };
}
