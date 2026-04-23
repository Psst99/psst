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

export function interpolateEmailText(value: string, variables: EmailVariables) {
  return value.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key: string) => valueForPath(variables, key))
}

function mergeMessage(key: EmailTemplateKey, remote?: Partial<EmailMessage> | null): EmailMessage {
  return {
    ...DEFAULT_EMAIL_MESSAGES[key],
    ...(remote ?? {}),
    enabled: remote?.enabled ?? DEFAULT_EMAIL_MESSAGES[key].enabled,
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
