import {MetadataRoute} from 'next'
import {headers} from 'next/headers'

import {getResourceSlug} from '@/lib/resources'
import {resolveSiteUrl} from '@/lib/seo'
import {sanityFetch} from '@/sanity/lib/live'
import {settingsQuery, sitemapData} from '@/sanity/lib/queries'

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>

const STATIC_ROUTES: Array<{
  path: string
  priority: number
  changeFrequency: ChangeFrequency
}> = [
  {path: '/database', priority: 0.8, changeFrequency: 'monthly'},
  {path: '/database/browse', priority: 0.7, changeFrequency: 'weekly'},
  {path: '/resources', priority: 0.8, changeFrequency: 'monthly'},
  {path: '/resources/browse', priority: 0.7, changeFrequency: 'weekly'},
  {path: '/workshops', priority: 0.8, changeFrequency: 'weekly'},
  {path: '/events', priority: 0.8, changeFrequency: 'weekly'},
  {path: '/archive', priority: 0.7, changeFrequency: 'monthly'},
  {path: '/pssound-system', priority: 0.8, changeFrequency: 'monthly'},
  {path: '/pssound-system/request', priority: 0.6, changeFrequency: 'monthly'},
  {path: '/pssound-system/membership', priority: 0.6, changeFrequency: 'monthly'},
  {path: '/pssound-system/archive', priority: 0.7, changeFrequency: 'monthly'},
]

function getFallbackOrigin(host: string | null) {
  if (!host) return undefined
  const protocol = host.includes('localhost') || host.startsWith('127.') ? 'http' : 'https'
  return `${protocol}://${host}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{data}, {data: settings}] = await Promise.all([
    sanityFetch({query: sitemapData, stega: false}),
    sanityFetch({query: settingsQuery, stega: false}),
  ])
  const headersList = await headers()
  const siteUrl = resolveSiteUrl(
    settings?.siteUrl ||
      settings?.ogImage?.metadataBase ||
      getFallbackOrigin(headersList.get('host')),
  )
  const sitemapEntries: MetadataRoute.Sitemap = []
  const seen = new Set<string>()

  function push(
    path: string,
    lastModified: Date | string = new Date(),
    priority = 0.5,
    changeFrequency: ChangeFrequency = 'monthly',
  ) {
    const url = new URL(path, siteUrl).toString()
    if (seen.has(url)) return
    seen.add(url)
    sitemapEntries.push({url, lastModified, priority, changeFrequency})
  }

  push('/', new Date(), 1, 'monthly')

  for (const route of STATIC_ROUTES) {
    push(route.path, new Date(), route.priority, route.changeFrequency)
  }

  const sitemapDataValue = data as any

  for (const page of sitemapDataValue?.pages || []) {
    push(`/${page.slug}`, page._updatedAt, 0.8, 'monthly')
  }

  for (const post of sitemapDataValue?.posts || []) {
    push(`/posts/${post.slug}`, post._updatedAt, 0.5, 'never')
  }

  for (const [index, section] of (sitemapDataValue?.psstSections || []).entries()) {
    push(index === 0 ? '/psst' : `/psst/${section.slug}`, section._updatedAt, 0.8, 'monthly')
  }

  for (const [index, section] of (sitemapDataValue?.pssoundSections || []).entries()) {
    push(
      index === 0 ? '/pssound-system' : `/pssound-system/${section.slug}`,
      section._updatedAt,
      0.8,
      'monthly',
    )
  }

  for (const artist of sitemapDataValue?.artists || []) {
    push(`/database/artists/${artist.slug}`, artist._updatedAt, 0.5, 'monthly')
  }

  for (const resource of sitemapDataValue?.resources || []) {
    push(
      `/resources/items/${getResourceSlug(resource.title, resource._id)}`,
      resource._updatedAt,
      0.5,
      'monthly',
    )
  }

  for (const event of sitemapDataValue?.events || []) {
    push(`/events/${event.slug}`, event._updatedAt, 0.5, 'monthly')
  }

  for (const workshop of sitemapDataValue?.workshops || []) {
    push(`/workshops/w/${workshop.slug}`, workshop._updatedAt, 0.5, 'monthly')
  }

  return sitemapEntries
}
