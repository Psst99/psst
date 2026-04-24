import {
  DEFAULT_EMAIL_MESSAGES,
  DEFAULT_EMAIL_SETTINGS,
  EMAIL_TEMPLATE_KEYS,
  type EmailMessage,
  type EmailSettings,
  type EmailTemplateKey,
} from './defaults'
import {emailSanityClient} from './sanity-client'
import type {EmailRenderContent} from './types'

export type EmailVariables = Record<string, string | number | boolean | null | undefined>

export type ResolvedEmailContent = EmailRenderContent

const settingsFields = EMAIL_TEMPLATE_KEYS.map(
  (key) => `${key}{enabled, subject, previewText, heading, intro, notice, footer, disclaimer}`,
).join(',\n')

const emailSettingsQuery = `*[_type == "emailSettings" && _id == "emailSettings"][0]{
  fromName,
  fromEmail,
  replyTo,
  ${settingsFields}
}`

function valueForPath(variables: EmailVariables, path: string) {
  const value = path.split('.').reduce<unknown>((current, part) => {
    if (current && typeof current === 'object' && part in current) {
      return (current as Record<string, unknown>)[part]
    }
    return undefined
  }, variables)

  if (value === null || value === undefined) return ''
  return String(value)
}

function normalizeInterpolatedText(value?: string | null) {
  return typeof value === 'string' ? value : ''
}

export function interpolateEmailText(value: string | null | undefined, variables: EmailVariables) {
  const normalizedValue = normalizeInterpolatedText(value)

  if (!normalizedValue) return ''

  return normalizedValue.replace(
    /\{\{\s*([\w.]+)\s*\}\}/g,
    (_, key: string) => valueForPath(variables, key),
  )
}

function resolveRequiredField(
  remote: Partial<EmailMessage> | null | undefined,
  key: keyof Pick<
    EmailMessage,
    'subject' | 'previewText' | 'heading' | 'intro' | 'disclaimer'
  >,
  fallback: string,
) {
  const value = remote?.[key]
  return typeof value === 'string' ? value : fallback
}

function resolveOptionalField(
  remote: Partial<EmailMessage> | null | undefined,
  key: keyof Pick<EmailMessage, 'notice' | 'footer'>,
  fallback: string,
) {
  if (!remote || !Object.prototype.hasOwnProperty.call(remote, key)) {
    return fallback
  }

  const value = remote[key]
  return typeof value === 'string' ? value : ''
}

function mergeMessage(key: EmailTemplateKey, remote?: Partial<EmailMessage> | null): EmailMessage {
  const defaults = DEFAULT_EMAIL_MESSAGES[key]
  const isCardOnlyApproval =
    key === 'databaseApproved' || key === 'resourceApproved' || key === 'workshopApproved'
  const isSubmissionConfirmation =
    key === 'databaseReceived' || key === 'resourceReceived' || key === 'workshopReceived'
  const forceBlankNotice = isCardOnlyApproval
  const forceBlankFooter = isCardOnlyApproval || isSubmissionConfirmation
  const forceBlankHeading = isCardOnlyApproval
  const forceBlankIntro = isCardOnlyApproval

  return {
    ...defaults,
    ...(remote ?? {}),
    enabled: remote?.enabled ?? defaults.enabled,
    subject: resolveRequiredField(remote, 'subject', defaults.subject),
    previewText: resolveRequiredField(remote, 'previewText', defaults.previewText),
    heading: forceBlankHeading ? '' : resolveRequiredField(remote, 'heading', defaults.heading),
    intro: forceBlankIntro ? '' : resolveRequiredField(remote, 'intro', defaults.intro),
    notice: forceBlankNotice ? '' : resolveOptionalField(remote, 'notice', defaults.notice),
    footer: forceBlankFooter ? '' : resolveOptionalField(remote, 'footer', defaults.footer),
    disclaimer: resolveRequiredField(remote, 'disclaimer', defaults.disclaimer),
  }
}

async function fetchEmailSettings(): Promise<EmailSettings> {
  if (!emailSanityClient) return DEFAULT_EMAIL_SETTINGS

  const settings = await emailSanityClient
    .fetch<Partial<EmailSettings> | null>(emailSettingsQuery)
    .catch(() => null)

  if (!settings) return DEFAULT_EMAIL_SETTINGS

  return {
    fromName: settings.fromName || DEFAULT_EMAIL_SETTINGS.fromName,
    fromEmail: settings.fromEmail || DEFAULT_EMAIL_SETTINGS.fromEmail,
    replyTo: settings.replyTo || DEFAULT_EMAIL_SETTINGS.replyTo,
    databaseReceived: mergeMessage('databaseReceived', settings.databaseReceived),
    databaseApproved: mergeMessage('databaseApproved', settings.databaseApproved),
    resourceReceived: mergeMessage('resourceReceived', settings.resourceReceived),
    resourceApproved: mergeMessage('resourceApproved', settings.resourceApproved),
    workshopReceived: mergeMessage('workshopReceived', settings.workshopReceived),
    workshopApproved: mergeMessage('workshopApproved', settings.workshopApproved),
    pssoundRequestReceived: mergeMessage('pssoundRequestReceived', settings.pssoundRequestReceived),
    pssoundRequestApproved: mergeMessage('pssoundRequestApproved', settings.pssoundRequestApproved),
    pssoundMembershipReceived: mergeMessage(
      'pssoundMembershipReceived',
      settings.pssoundMembershipReceived,
    ),
    pssoundMembershipApproved: mergeMessage(
      'pssoundMembershipApproved',
      settings.pssoundMembershipApproved,
    ),
  }
}

export async function getResolvedEmailContent(
  key: EmailTemplateKey,
  variables: EmailVariables,
): Promise<ResolvedEmailContent> {
  const settings = await fetchEmailSettings()
  const message = settings[key]

  return {
    enabled: message.enabled,
    subject: interpolateEmailText(message.subject, variables),
    previewText: interpolateEmailText(message.previewText, variables),
    heading: interpolateEmailText(message.heading, variables),
    intro: interpolateEmailText(message.intro, variables),
    notice: interpolateEmailText(message.notice, variables),
    footer: interpolateEmailText(message.footer, variables),
    disclaimer: interpolateEmailText(message.disclaimer, variables),
    from: `${settings.fromName} <${settings.fromEmail}>`,
    replyTo: settings.replyTo,
  }
}
