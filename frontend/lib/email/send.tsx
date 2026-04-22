import 'server-only'

import {render} from '@react-email/components'
import * as React from 'react'
import {Resend} from 'resend'
import {PsstFormEmail} from '@/emails/psst-form-email'
import {getResolvedEmailContent, type EmailVariables} from './content'
import type {EmailTemplateKey} from './defaults'
import {getResolvedEmailTheme} from './theme.server'
import type {EmailCard} from './types'

export type SendPsstEmailResult =
  | {sent: true}
  | {sent: false; reason: 'disabled' | 'missing-api-key' | 'missing-recipient'}

type SendPsstEmailOptions = {
  to?: string | null
  templateKey: EmailTemplateKey
  variables: EmailVariables
  card?: EmailCard
}

export async function sendPsstEmail({
  to,
  templateKey,
  variables,
  card,
}: SendPsstEmailOptions): Promise<SendPsstEmailResult> {
  if (!to) return {sent: false, reason: 'missing-recipient'}

  const content = await getResolvedEmailContent(templateKey, variables)
  if (!content.enabled) return {sent: false, reason: 'disabled'}

  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) return {sent: false, reason: 'missing-api-key'}

  const theme = await getResolvedEmailTheme(templateKey)
  const html = await render(React.createElement(PsstFormEmail, {content, card, theme}))
  const resend = new Resend(resendApiKey)

  await resend.emails.send({
    from: content.from,
    to,
    subject: content.subject,
    html,
    ...(content.replyTo ? {replyTo: content.replyTo} : {}),
  })

  return {sent: true}
}
