import {render} from '@react-email/components'
import * as React from 'react'
import {ArtistConfirmationEmail} from '../../emails/artist-confirmation'
import {getTagColors} from '@/lib/tags'

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
  // Add colors to tags
  const tagsWithColors = data.tags.map((tag) => {
    const colors = getTagColors(tag.title.toLowerCase())
    return {
      title: tag.title,
      bg: colors.bg,
      fg: colors.fg,
      bd: colors.bd,
    }
  })

  const html = await render(
    React.createElement(ArtistConfirmationEmail, {
      ...data,
      tags: tagsWithColors,
    }),
  )

  return html
}
