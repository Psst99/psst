import type {EmailTemplateKey} from './defaults'

const CARD_ONLY_TEMPLATES = new Set<EmailTemplateKey>([
  'databaseApproved',
  'resourceApproved',
  'workshopApproved',
])

const NOTICELESS_TEMPLATES = new Set<EmailTemplateKey>([
  ...CARD_ONLY_TEMPLATES,
  'newsletterReceived',
  'pssoundRequestReceived',
  'pssoundRequestApproved',
  'pssoundMembershipReceived',
  'pssoundMembershipApproved',
])

const FOOTERLESS_TEMPLATES = new Set<EmailTemplateKey>([
  ...CARD_ONLY_TEMPLATES,
  'databaseReceived',
  'resourceReceived',
  'workshopReceived',
  'newsletterReceived',
  'pssoundRequestReceived',
  'pssoundRequestApproved',
  'pssoundMembershipReceived',
  'pssoundMembershipApproved',
])

const DISCLAIMERLESS_TEMPLATES = new Set<EmailTemplateKey>()

export function getEmailFieldVisibility(key: EmailTemplateKey) {
  const isCardOnly = CARD_ONLY_TEMPLATES.has(key)

  return {
    hideHeading: isCardOnly,
    hideIntro: isCardOnly,
    hideNotice: NOTICELESS_TEMPLATES.has(key),
    hideFooter: FOOTERLESS_TEMPLATES.has(key),
    hideDisclaimer: DISCLAIMERLESS_TEMPLATES.has(key),
  }
}
