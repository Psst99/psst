'use server'

import {client} from '@/sanity/lib/client'
import {RANDOM_SORT_FETCH_LIMIT, seededShuffleById} from '@/lib/seededShuffle'

export interface PaginatedResourcesParams {
  tagSlugs: string[]
  categorySlugs: string[]
  mode: string
  search: string
  sort: string
  seed?: string
  page: number
  pageSize: number
}

export async function getResourcesPaginated(params: PaginatedResourcesParams) {
  const {tagSlugs, categorySlugs, mode, search, sort, seed, page = 1, pageSize = 20} = params

  const skip = (page - 1) * pageSize
  const take = pageSize + 1

  // Generate order clause
  let orderClause
  switch (sort) {
    case 'chrono':
      orderClause = '| order(publishedAt desc)'
      break
    case 'random':
      orderClause = '| order(title asc)'
      break
    default: // alpha
      orderClause = '| order(title asc)'
  }

  // Build the query
  let query = `*[_type == "resource"`
  const conditions = ['approved == true']

  if (tagSlugs.length > 0) {
    if (mode === 'all') {
      conditions.push(
        `count((tags[]->slug.current)[@ in [${tagSlugs.map((slug) => `"${slug}"`).join(',')}]]) == ${tagSlugs.length}`,
      )
    } else {
      conditions.push(
        `count((tags[]->slug.current)[@ in [${tagSlugs.map((slug) => `"${slug}"`).join(',')}]]) > 0`,
      )
    }
  }

  if (categorySlugs.length > 0) {
    conditions.push(
      `count((categories[]->slug.current)[@ in [${categorySlugs.map((slug) => `"${slug}"`).join(',')}]]) > 0`,
    )
  }

  if (search) {
    conditions.push(`(title match "*${search}*" || description match "*${search}*")`)
  }

  if (conditions.length > 0) {
    query += ` && ${conditions.join(' && ')}`
  }

  const queryStart = sort === 'random' ? 0 : skip
  const queryEnd = sort === 'random' ? RANDOM_SORT_FETCH_LIMIT : skip + take

  query += `] ${orderClause} [${queryStart}...${queryEnd}] {
    _id,
    title,
    description,
    url,
    fileUrl,
    category,
    "categories": categories[]-> {
      _id,
      title,
      "slug": slug.current
    },
    image,
    publishedAt,
    "tags": tags[]-> {
      _id,
      title,
      "slug": slug.current
    }
  }`

  // Count total items
  const countQuery = `count(*[_type == "resource"${
    conditions.length > 0 ? ` && ${conditions.join(' && ')}` : ''
  }])`

  // Execute queries
  const fetchedResources = await client.fetch(query)
  const totalCount = await client.fetch(countQuery)
  const pageResources =
    sort === 'random'
      ? seededShuffleById(fetchedResources, seed).slice(skip, skip + take)
      : fetchedResources
  const resources = pageResources.slice(0, pageSize)

  return {
    resources,
    hasNextPage: pageResources.length > pageSize,
    totalCount,
  }
}
