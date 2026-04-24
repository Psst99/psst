export const EMAIL_TEMPLATE_KEYS = [
  'databaseReceived',
  'databaseApproved',
  'resourceReceived',
  'resourceApproved',
  'workshopReceived',
  'workshopApproved',
  'pssoundRequestReceived',
  'pssoundRequestApproved',
  'pssoundMembershipReceived',
  'pssoundMembershipApproved',
] as const

export type EmailTemplateKey = (typeof EMAIL_TEMPLATE_KEYS)[number]

export type EmailMessage = {
  enabled: boolean
  subject: string
  previewText: string
  heading: string
  intro: string
  notice: string
  footer: string
  disclaimer: string
}

export type EmailSettings = {
  fromName: string
  fromEmail: string
  replyTo?: string
} & Record<EmailTemplateKey, EmailMessage>

export const DEFAULT_EMAIL_MESSAGES: Record<EmailTemplateKey, EmailMessage> = {
  databaseReceived: {
    enabled: true,
    subject: 'We received your database submission: {{artistName}}',
    previewText: 'Your database submission is waiting for review.',
    heading: 'We received your database submission',
    intro:
      'Thanks for adding {{artistName}} to the database. The team will review the entry before it appears publicly.',
    notice:
      'You will receive another email when the card is approved and live. Reply to this email if anything needs to be corrected before review.',
    footer: 'With care,\nPSST',
    disclaimer: 'Automated confirmation for {{email}}.',
  },
  databaseApproved: {
    enabled: true,
    subject: 'Your PSST database card is live: {{artistName}}',
    previewText: 'Your database card has been approved and published.',
    heading: 'Your database card is live',
    intro:
      'The team reviewed and approved {{artistName}}. The card is now visible in the PSST database.',
    notice: '',
    footer: '',
    disclaimer: 'Sent automatically for {{email}}.',
  },
  resourceReceived: {
    enabled: true,
    subject: 'We received your resource submission: {{title}}',
    previewText: 'Your resource submission is waiting for review.',
    heading: 'We received your resource submission',
    intro:
      'Thanks for sharing {{title}}. The team will review the resource before it appears publicly.',
    notice:
      'You will receive another email when the resource is approved and live. Reply to this email if anything needs to be corrected before review.',
    footer: 'With care,\nPSST',
    disclaimer: 'Automated confirmation for {{email}}.',
  },
  resourceApproved: {
    enabled: true,
    subject: 'Your PSST resource is live: {{title}}',
    previewText: 'Your resource has been approved and published.',
    heading: 'Your resource is live',
    intro: 'The team reviewed and approved {{title}}. The card is now visible in Resources.',
    notice: 'The card preview below matches the public entry. Reply if something needs updating.',
    footer: 'With care,\nPSST',
    disclaimer: 'Automated approval confirmation for {{email}}.',
  },
  workshopReceived: {
    enabled: true,
    subject: 'We received your workshop request: {{workshopTitle}}',
    previewText: 'Your workshop registration is waiting for review.',
    heading: 'We received your workshop request',
    intro:
      'Thanks {{name}}. Your request for {{workshopTitle}} has been received and is waiting for team review.',
    notice:
      'You will receive another email if your place is approved. Selected date(s): {{selectedDates}}.',
    footer: 'With care,\nPSST',
    disclaimer: 'Automated confirmation for {{email}}.',
  },
  workshopApproved: {
    enabled: true,
    subject: 'Your workshop place is approved: {{workshopTitle}}',
    previewText: 'Your workshop registration has been approved.',
    heading: 'Your workshop place is approved',
    intro:
      'Hi {{name}}, your place for {{workshopTitle}} has been approved. The workshop details are below.',
    notice: 'Selected date(s): {{selectedDates}}. Reply if you need to change anything.',
    footer: 'With care,\nPSST',
    disclaimer: 'Automated approval confirmation for {{email}}.',
  },
  pssoundRequestReceived: {
    enabled: true,
    subject: 'We received your Pssound request: {{eventTitle}}',
    previewText: 'Your sound system loan request has been received.',
    heading: 'We received your sound system request',
    intro:
      'Thanks {{collectiveName}}. Your request for {{eventTitle}} has been received by the team.',
    notice: 'Event date: {{eventDate}}. Pick-up: {{pickupDate}}. Return: {{returnDate}}.',
    footer: 'With care,\nPSST',
    disclaimer: 'Automated confirmation for {{collectiveName}}.',
  },
  pssoundRequestApproved: {
    enabled: true,
    subject: 'Your Pssound request is confirmed: {{eventTitle}}',
    previewText: 'Your sound system loan request has been confirmed.',
    heading: 'Your sound system request is confirmed',
    intro:
      'Hi {{collectiveName}}, your Pssound loan request for {{eventTitle}} has been confirmed. The selected loan period is now reserved.',
    notice:
      'Event date: {{eventDate}}. Pick-up: {{pickupDate}}. Return: {{returnDate}}. Reply if any detail needs to change.',
    footer: 'With care,\nPSST',
    disclaimer: 'Automated confirmation for {{collectiveName}}.',
  },
  pssoundMembershipReceived: {
    enabled: true,
    subject: 'We received your Pssound membership request: {{collectiveName}}',
    previewText: 'Your Pssound membership request is waiting for review.',
    heading: 'We received your membership request',
    intro:
      'Thanks for applying for Pssound membership as {{collectiveName}}. The team will review the request.',
    notice: 'You will receive another email when the membership is approved.',
    footer: 'With care,\nPSST',
    disclaimer: 'Automated confirmation for {{email}}.',
  },
  pssoundMembershipApproved: {
    enabled: true,
    subject: 'Your Pssound membership is approved: {{collectiveName}}',
    previewText: 'Your Pssound membership has been approved.',
    heading: 'Your membership is approved',
    intro:
      '{{collectiveName}} is now approved for Pssound membership. You can use the calendar request flow for future loan requests.',
    notice: 'Membership start date: {{startDate}}.',
    footer: 'With care,\nPSST',
    disclaimer: 'Automated approval confirmation for {{email}}.',
  },
}

export const DEFAULT_EMAIL_SETTINGS: EmailSettings = {
  fromName: 'PSST',
  fromEmail: 'info@psst.space',
  replyTo: 'info@psst.space',
  ...DEFAULT_EMAIL_MESSAGES,
}
