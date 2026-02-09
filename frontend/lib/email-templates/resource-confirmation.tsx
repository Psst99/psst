import {render} from '@react-email/components'
import * as React from 'react'
import {ResourceConfirmationEmail} from '../../emails/resource-confirmation'
import {getTagColors} from '@/lib/tags'

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
    React.createElement(ResourceConfirmationEmail, {
      ...data,
      tags: tagsWithColors,
    }),
  )

  return html
}
