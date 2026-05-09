import {createClient} from '@sanity/client'
import fs from 'node:fs'
import path from 'node:path'

type SeoDefaults = {
  metaTitle: string
  metaDescription: string
  noIndex?: boolean
}

type PageSettingsDefaults = {
  title: string
  seo: SeoDefaults
}

const SITE_URL = 'https://psst.space'

const PAGE_SETTINGS_DEFAULTS: Record<string, PageSettingsDefaults> = {
  'database-pageSettings': {
    title: 'Database',
    seo: {
      metaTitle: 'Database',
      metaDescription:
        'This database brings together MaGe artists in the Belgian music scene and the sectors that revolve around it.',
      noIndex: false,
    },
  },
  'resources-pageSettings': {
    title: 'Resources',
    seo: {
      metaTitle: 'Resources',
      metaDescription:
        'Explore resources for nightlife, music, accessibility, safer spaces and community-led cultural work.',
      noIndex: false,
    },
  },
  'workshops-pageSettings': {
    title: 'Workshops',
    seo: {
      metaTitle: 'Workshops',
      metaDescription:
        'Psst workshops give underrepresented people access to practices from DJing to construction and scenography.',
      noIndex: false,
    },
  },
  'events-pageSettings': {
    title: 'Events',
    seo: {
      metaTitle: 'Events',
      metaDescription:
        'Find upcoming and past Psst events, parties, talks and community gatherings around nightlife, music and inclusion.',
      noIndex: false,
    },
  },
  'archive-pageSettings': {
    title: 'Archive',
    seo: {
      metaTitle: 'Archive',
      metaDescription:
        'Browse a glimpse of what Psst has done since 2018, from early events and aftermovies to party pictures and documentation.',
      noIndex: false,
    },
  },
  'pssound-request-pageSettings': {
    title: 'Request PSƧOUND System',
    seo: {
      metaTitle: 'Request PSƧOUND System',
      metaDescription:
        'Request the PSƧOUND System for a collective, artist-led or community event.',
      noIndex: false,
    },
  },
  'pssound-archive-pageSettings': {
    title: 'PSƧOUND Archive',
    seo: {
      metaTitle: 'PSƧOUND Archive',
      metaDescription: 'Browse the PSƧOUND System archive and past sound system projects.',
      noIndex: false,
    },
  },
  'pssound-manifesto-pageSettings': {
    title: 'Manifesto',
    seo: {
      metaTitle: 'PSƧOUND Manifesto',
      metaDescription:
        'Read the PSƧOUND System manifesto and the values behind Psst sound system access.',
      noIndex: false,
    },
  },
  'pssound-about-pageSettings': {
    title: 'About PSƧOUND System',
    seo: {
      metaTitle: 'About PSƧOUND System',
      metaDescription:
        'Learn about PSƧOUND System, Psst sound system sharing and its community-led approach.',
      noIndex: false,
    },
  },
}

const SINGLETON_DEFAULTS: Record<string, {type: string; title?: string; seo: SeoDefaults}> = {
  membershipPage: {
    type: 'membershipPage',
    title: 'Membership',
    seo: {
      metaTitle: 'PSƧOUND Membership',
      metaDescription:
        'Apply to join the PSƧOUND System community and help make sound system access more collective.',
      noIndex: false,
    },
  },
}

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return

  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/)
    if (!match) continue

    const key = match[1]
    if (process.env[key]) continue

    let value = match[2].trim()
    if (value.startsWith('"')) {
      value = value.slice(1, value.indexOf('"', 1))
    } else {
      value = value.replace(/\s+#.*$/, '')
    }

    process.env[key] = value
  }
}

function repoRoot() {
  return path.basename(process.cwd()) === 'frontend' ? path.dirname(process.cwd()) : process.cwd()
}

function plainText(value: unknown) {
  if (!Array.isArray(value)) return ''

  return value
    .map((block: any) => {
      if (!Array.isArray(block?.children)) return ''
      return block.children.map((child: any) => child?.text || '').join(' ')
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function excerpt(value: string, fallback: string) {
  const text = value || fallback
  if (text.length <= 165) return text

  const trimmed = text.slice(0, 162)
  const lastSpace = trimmed.lastIndexOf(' ')
  return `${trimmed.slice(0, lastSpace > 120 ? lastSpace : 162).trim()}...`
}

function seoPatch(current: any, defaults: SeoDefaults) {
  const set: Record<string, string | boolean> = {}

  if (!current?.metaTitle) set['seo.metaTitle'] = defaults.metaTitle
  if (!current?.metaDescription) set['seo.metaDescription'] = defaults.metaDescription
  if (current?.noIndex === undefined) set['seo.noIndex'] = defaults.noIndex ?? false

  return set
}

async function upsertKnownDocument(
  client: ReturnType<typeof createClient>,
  id: string,
  type: string,
  defaults: {title?: string; seo: SeoDefaults},
) {
  const document = await client.fetch(
    `*[_id == $id][0]{_id, title, seo}`,
    {id},
    {cache: 'no-store'},
  )

  if (!document) {
    await client.createIfNotExists({
      _id: id,
      _type: type,
      ...(defaults.title ? {title: defaults.title} : {}),
      seo: defaults.seo,
    })
    return 'created'
  }

  const set = seoPatch(document.seo, defaults.seo)
  if (defaults.title && !document.title) set.title = defaults.title
  if (Object.keys(set).length === 0) return 'unchanged'

  await client.patch(id).set(set).commit()
  return 'updated'
}

async function patchSections(client: ReturnType<typeof createClient>) {
  const sections = await client.fetch(
    `*[_type in ["psstSection", "pssoundSection"]]{
      _id,
      _type,
      title,
      content,
      seo
    }`,
    {},
    {cache: 'no-store'},
  )
  let updated = 0

  for (const section of sections || []) {
    const fallback =
      section._type === 'pssoundSection'
        ? 'Learn about PSƧOUND System, Psst sound system sharing and its community-led approach.'
        : 'Learn about Psst, its manifesto, collective work, values and community platform.'
    const defaults = {
      metaTitle: section.title || 'Psst',
      metaDescription: excerpt(plainText(section.content), fallback),
      noIndex: false,
    }
    const set = seoPatch(section.seo, defaults)

    if (Object.keys(set).length === 0) continue
    await client.patch(section._id).set(set).commit()
    updated += 1
  }

  return updated
}

async function upsertSettings(client: ReturnType<typeof createClient>) {
  const settings = await client.fetch(
    `*[_id == "siteSettings"][0]{_id, title, siteUrl}`,
    {},
    {cache: 'no-store'},
  )

  if (!settings) {
    await client.createIfNotExists({
      _id: 'siteSettings',
      _type: 'settings',
      title: 'Psst',
      siteUrl: SITE_URL,
    })
    return 'created'
  }

  const set: Record<string, string> = {}
  if (!settings.title) set.title = 'Psst'
  if (!settings.siteUrl) set.siteUrl = SITE_URL
  if (Object.keys(set).length === 0) return 'unchanged'

  await client.patch('siteSettings').set(set).commit()
  return 'updated'
}

async function main() {
  const root = repoRoot()
  loadEnvFile(path.join(root, 'frontend/.env.local'))
  loadEnvFile(path.join(root, 'studio/.env'))

  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET
  const token = process.env.SANITY_API_WRITE_TOKEN
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-28'

  if (!projectId || !dataset || !token) {
    throw new Error('Missing Sanity project ID, dataset, or write token.')
  }

  const client = createClient({projectId, dataset, token, apiVersion, useCdn: false})
  const counts = {created: 0, updated: 0, unchanged: 0}

  const settingsState = await upsertSettings(client)
  counts[settingsState as keyof typeof counts] += 1

  for (const [id, defaults] of Object.entries(PAGE_SETTINGS_DEFAULTS)) {
    const state = await upsertKnownDocument(client, id, 'pageSettings', defaults)
    counts[state as keyof typeof counts] += 1
  }

  for (const [id, defaults] of Object.entries(SINGLETON_DEFAULTS)) {
    const state = await upsertKnownDocument(client, id, defaults.type, {
      title: defaults.title,
      seo: defaults.seo,
    })
    counts[state as keyof typeof counts] += 1
  }

  const updatedSections = await patchSections(client)

  console.log(
    `SEO seed complete: ${counts.created} created, ${counts.updated + updatedSections} updated, ${counts.unchanged} unchanged.`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
