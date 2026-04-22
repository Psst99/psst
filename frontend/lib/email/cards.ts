import {getTagColors} from '../tags'
import type {EmailCard, EmailTag} from './types'

type TagLike = {
  title?: string | null
}

type LinkLike = {
  platform?: string | null
  url?: string | null
}

function formatDate(value?: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatDateList(values?: string[] | null) {
  return values?.map(formatDate).filter(Boolean).join(', ') || ''
}

export function emailTags(tags?: TagLike[] | null): EmailTag[] {
  return (tags ?? [])
    .map((tag) => tag.title?.trim())
    .filter((title): title is string => !!title)
    .map((title) => {
      const colors = getTagColors(title.toLowerCase())
      return {
        title,
        bg: colors.bg,
        fg: colors.fg,
        bd: colors.bd,
      }
    })
}

export function artistEmailCard(data: {
  artistName: string
  description?: string | null
  categories?: TagLike[] | null
  tags?: TagLike[] | null
  links?: LinkLike[] | null
  publicUrl?: string
}): EmailCard {
  const links =
    data.links
      ?.filter((link): link is {platform: string; url: string} => !!link.platform && !!link.url)
      .map((link) => ({label: link.platform, url: link.url})) ?? []

  return {
    title: data.artistName,
    description: data.description || undefined,
    categories:
      data.categories
        ?.map((category) => category.title?.trim())
        .filter((title): title is string => !!title) ?? [],
    tags: emailTags(data.tags),
    actionUrl: data.publicUrl,
    links,
  }
}

export function resourceEmailCard(data: {
  title: string
  description?: string | null
  category?: string | null
  categories?: string[] | null
  tags?: TagLike[] | null
  url?: string | null
  fileUrl?: string | null
  publicUrl?: string
}): EmailCard {
  const categoryLabels =
    data.categories && data.categories.length > 0
      ? data.categories
      : data.category
        ? [data.category.toUpperCase()]
        : []

  const links = [
    data.url ? {label: 'Open link', url: data.url} : null,
    data.fileUrl ? {label: 'Open file', url: data.fileUrl} : null,
  ].filter((link): link is {label: string; url: string} => !!link)

  return {
    title: data.title,
    description: data.description || undefined,
    categories: categoryLabels,
    tags: emailTags(data.tags),
    actionUrl: data.publicUrl,
    links,
  }
}

export function workshopEmailCard(data: {
  title: string
  description?: string | null
  location?: string | null
  dates?: string[] | null
  selectedDates?: string[] | null
  imageUrl?: string | null
  tags?: TagLike[] | null
  publicUrl?: string
}): EmailCard {
  const links: Array<{label: string; url: string}> = []
  const meta = [
    data.location ? {label: 'Location', value: data.location} : null,
    data.dates?.length ? {label: 'Workshop dates', value: formatDateList(data.dates)} : null,
    data.selectedDates?.length
      ? {label: 'Selected dates', value: formatDateList(data.selectedDates)}
      : null,
  ].filter((item): item is {label: string; value: string} => !!item)

  return {
    title: data.title,
    description: data.description || undefined,
    imageUrl: data.imageUrl || undefined,
    tags: emailTags(data.tags),
    meta,
    actionUrl: data.publicUrl,
    links,
  }
}
