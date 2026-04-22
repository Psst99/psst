import {render} from '@react-email/components'
import * as React from 'react'
import {PsstFormEmail} from '../../emails/psst-form-email'
import {buildEmailContentFromDefaults} from '../email/preview'
import {getResolvedEmailTheme} from '../email/theme.server'

interface ArtistConfirmationEmailProps {
  artistName: string
  pronouns: string
  customPronouns?: string
  email: string
  categories: {_id: string; title: string}[]
  tags: {_id: string; title: string}[]
  links: {url: string; platform: string}[]
  description: string
}

export const generateArtistConfirmationEmail = async (data: ArtistConfirmationEmailProps) => {
  const content = buildEmailContentFromDefaults('databaseReceived', {
    artistName: data.artistName,
    email: data.email,
  })
  const theme = await getResolvedEmailTheme('databaseReceived')

  const html = await render(
    React.createElement(PsstFormEmail, {
      content,
      theme,
    }),
  )

  return html
}
