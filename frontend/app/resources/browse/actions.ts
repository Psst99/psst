'use server'

import { client } from '@/sanity/lib/client'

export interface PaginatedResourcesParams {
  tagSlugs: string[]
  categorySlugs: string[]
  mode: string
  search: string
  sort: string
  page: number
  pageSize: number
}

export async function getResourcesPaginated(params: PaginatedResourcesParams) {
  const {
    tagSlugs,
    categorySlugs,
    mode,
    search,
    sort,
    page = 1,
    pageSize = 20,
  } = params

  const skip = (page - 1) * pageSize

  // Generate order clause
  let orderClause
  switch (sort) {
    case 'chrono':
      orderClause = '| order(publishedAt desc)'
      break
    case 'random':
      orderClause =
        '| order(_id) | order(string::split(string(_id), "-")[4] asc)'
      break
    default: // alpha
      orderClause = '| order(title asc)'
  }

  // Build the query
  let query = `*[_type == "resource"`
  const conditions = []

  if (tagSlugs.length > 0) {
    if (mode === 'all') {
      conditions.push(
        `count((tags[]->slug.current)[@ in [${tagSlugs.map((slug) => `"${slug}"`).join(',')}]]) == ${tagSlugs.length}`
      )
    } else {
      conditions.push(
        `count((tags[]->slug.current)[@ in [${tagSlugs.map((slug) => `"${slug}"`).join(',')}]]) > 0`
      )
    }
  }

  if (categorySlugs.length > 0) {
    conditions.push(
      `category in [${categorySlugs.map((slug) => `"${slug}"`).join(',')}]`
    )
  }

  if (search) {
    conditions.push(
      `(title match "*${search}*" || description match "*${search}*")`
    )
  }

  if (conditions.length > 0) {
    query += ` && ${conditions.join(' && ')}`
  }

  query += `] ${orderClause} [${skip}...${skip + pageSize}] {
    _id,
    title,
    description,
    url,
    fileUrl,
    category,
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
  const resources = await client.fetch(query)
  const totalCount = await client.fetch(countQuery)

  return {
    resources,
    hasNextPage: resources.length >= pageSize,
    totalCount,
  }
}
