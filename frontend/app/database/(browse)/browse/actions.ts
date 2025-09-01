'use server'

import { getDatabaseBrowseQuery } from '@/sanity/lib/queries'
import { sanityFetch } from '@/sanity/lib/live'

export type PaginatedArtistsParams = {
  tagSlugs: string[]
  mode: 'any' | 'all'
  search: string
  categorySlugs: string[]
  sort: 'alpha' | 'chrono' | 'random'
  page: number
  pageSize?: number
}

export type PaginatedArtistsResponse = {
  artists: any[]
  hasNextPage: boolean
  nextPage: number | null
  totalCount: number
}

export async function getArtistsPaginated(
  params: PaginatedArtistsParams
): Promise<PaginatedArtistsResponse> {
  const {
    tagSlugs,
    mode,
    search,
    categorySlugs,
    sort,
    page,
    pageSize = 20,
  } = params

  // Generate the appropriate order clause based on sort parameter
  const getOrderClause = (sortType: string) => {
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

  const offset = (page - 1) * pageSize
  const query = getDatabaseBrowseQuery(
    getOrderClause(sort),
    offset,
    pageSize + 1
  )

  const { data } = await sanityFetch({
    query,
    params: { tagSlugs, categorySlugs, mode, search },
  })

  const artists = data.artists.slice(0, pageSize) // remove extra item
  const hasNextPage = data.artists.length > pageSize

  return {
    artists,
    hasNextPage,
    nextPage: hasNextPage ? page + 1 : null,
    totalCount: data.totalCount,
  }
}
