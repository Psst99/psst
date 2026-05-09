import type {Metadata} from 'next'

import {resolveOpenGraphImage} from '@/sanity/lib/utils'

export const DEFAULT_SITE_URL = 'https://psst.space'

export type SeoFields = {
  metaTitle?: string | null
  metaDescription?: string | null
  ogImage?: unknown
  noIndex?: boolean | null
}

type PageMetadataInput = {
  title?: string | null
  description?: unknown
  seo?: SeoFields | null
  path?: string
  image?: unknown
  absoluteTitle?: boolean
}

function cleanText(value?: string | null) {
  return value?.replace(/\s+/g, ' ').trim() || undefined
}

export function toPlainText(value: unknown) {
  if (!value) return undefined
  if (typeof value === 'string') return cleanText(value)
  if (!Array.isArray(value)) return undefined

  const text = value
    .map((block: any) => {
      if (!Array.isArray(block?.children)) return ''
      return block.children.map((child: any) => child?.text || '').join(' ')
    })
    .join(' ')

  return cleanText(text)
}

function trimMetaDescription(value?: string) {
  if (!value) return undefined
  if (value.length <= 165) return value

  const trimmed = value.slice(0, 162)
  const lastSpace = trimmed.lastIndexOf(' ')
  return `${trimmed.slice(0, lastSpace > 120 ? lastSpace : 162).trim()}...`
}

export function resolveSiteUrl(value?: string | null) {
  const raw = cleanText(value) || process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL

  try {
    return new URL(raw).origin
  } catch {
    return DEFAULT_SITE_URL
  }
}

export function createMetadataBase(value?: string | null) {
  return new URL(resolveSiteUrl(value))
}

export function buildPageMetadata({
  title,
  description,
  seo,
  path,
  image,
  absoluteTitle,
}: PageMetadataInput): Metadata {
  const metaTitle = cleanText(seo?.metaTitle) || cleanText(title)
  const metaDescription = trimMetaDescription(
    cleanText(seo?.metaDescription) || toPlainText(description),
  )
  const ogImage = resolveOpenGraphImage(seo?.ogImage || image)
  const metadata: Metadata = {}

  if (metaTitle) metadata.title = absoluteTitle ? {absolute: metaTitle} : metaTitle
  if (metaDescription) metadata.description = metaDescription
  if (path) metadata.alternates = {canonical: path}
  if (seo?.noIndex) metadata.robots = {index: false, follow: false}

  if (metaTitle || metaDescription || ogImage || path) {
    metadata.openGraph = {
      ...(metaTitle ? {title: metaTitle} : {}),
      ...(metaDescription ? {description: metaDescription} : {}),
      ...(path ? {url: path} : {}),
      ...(ogImage ? {images: [ogImage]} : {}),
    }
  }

  if (metaTitle || metaDescription || ogImage) {
    metadata.twitter = {
      card: ogImage ? 'summary_large_image' : 'summary',
      ...(metaTitle ? {title: metaTitle} : {}),
      ...(metaDescription ? {description: metaDescription} : {}),
      ...(ogImage?.url ? {images: [ogImage.url]} : {}),
    }
  }

  return metadata
}
