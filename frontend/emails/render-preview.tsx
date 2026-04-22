import {PsstFormEmail} from './psst-form-email'
import {getPreviewDefinition} from '../lib/email/preview'
import {getResolvedEmailContent} from '../lib/email/content'
import {getResolvedEmailTheme} from '../lib/email/theme.server'
import type {EmailTemplateKey} from '../lib/email/defaults'

export async function getPreviewEmailProps(templateKey: EmailTemplateKey) {
  const preview = getPreviewDefinition(templateKey)
  const [content, theme] = await Promise.all([
    getResolvedEmailContent(templateKey, preview.variables),
    getResolvedEmailTheme(templateKey),
  ])

  return {
    content,
    card: preview.card,
    theme,
  }
}

export async function renderPreviewEmail(templateKey: EmailTemplateKey) {
  return <PsstFormEmail {...await getPreviewEmailProps(templateKey)} />
}
