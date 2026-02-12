import {slugifyTag} from './tags'

export function getResourceSlug(title: string | undefined, id: string): string {
  const base = slugifyTag(title || 'resource')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return `${base || 'resource'}--${id}`
}

export function getResourceIdFromSlug(slug: string): string | null {
  const decoded = decodeURIComponent(slug)
  const markerIndex = decoded.lastIndexOf('--')
  if (markerIndex === -1) return null

  const id = decoded.slice(markerIndex + 2).trim()
  return id.length > 0 ? id : null
}
