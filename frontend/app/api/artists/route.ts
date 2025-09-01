import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

export const runtime = 'edge'
export const revalidate = 0

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2025-01-01',
  useCdn: true,
})

const getOrderClause = (sortType?: string) => {
  switch (sortType) {
    case 'alpha':
      return '| order(artistName asc)'
    case 'chrono':
      return '| order(_createdAt desc)'
    case 'random':
      return '| order(_id) [0...100] | order(string::split(string(_id), "-")[4] asc)'
    default:
      return '| order(artistName asc)'
  }
}

const sliceQuery = (orderClause: string) => /* groq */ `
*[
  _type == "artist"
  && (!defined($search) || $search == "" || artistName match $search + "*")
  && (
    count($tagSlugs) == 0 ||
    ($mode == "all"
      => count(tags[@->slug.current in $tagSlugs]) == count($tagSlugs),
         count(tags[@->slug.current in $tagSlugs]) > 0)
  )
  && (
    count($categorySlugs) == 0 ||
    count(categories[@->slug.current in $categorySlugs]) > 0
  )
]
${orderClause}
[$start...$end]{
  _id,
  artistName,
  slug,
  categories[]->{_id, title, slug},
  tags[]{_key, title}
}
`

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const page = Number(searchParams.get('page') ?? '1')
  const limit = Math.min(Number(searchParams.get('limit') ?? '20'), 100)

  const tags = (searchParams.get('tags') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const category = (searchParams.get('category') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const params = {
    tagSlugs: tags,
    categorySlugs: category,
    mode: (searchParams.get('mode') as 'any' | 'all') ?? 'any',
    search: searchParams.get('search') ?? '',
    start: (page - 1) * limit,
    end: page * limit,
  }

  const orderClause = getOrderClause(searchParams.get('sort') ?? 'alpha')

  const artists = await client.fetch(sliceQuery(orderClause), params, {
    perspective: 'published',
  })

  return NextResponse.json(artists, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
