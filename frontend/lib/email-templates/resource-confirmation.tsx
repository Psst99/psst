import {render} from '@react-email/components'
import * as React from 'react'
import {PsstFormEmail} from '../../emails/psst-form-email'
import {buildEmailContentFromDefaults} from '../email/preview'
import {getResolvedEmailTheme} from '../email/theme.server'

interface ResourceConfirmationEmailProps {
  title: string
  email: string
  categories: string[]
  tags: {_id: string; title: string}[]
  description: string
  url?: string
  fileName?: string
}

export const generateResourceConfirmationEmail = async (data: ResourceConfirmationEmailProps) => {
  const content = buildEmailContentFromDefaults('resourceReceived', {
    title: data.title,
    email: data.email,
  })
  const theme = await getResolvedEmailTheme('resourceReceived')

  const html = await render(
    React.createElement(PsstFormEmail, {
      content,
      theme,
    }),
  )

  return html
}
