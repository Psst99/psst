'use server'

import { getDatabaseBrowseQuery } from '@/sanity/lib/queries'
import { sanityFetch } from '@/sanity/lib/live'
import {RANDOM_SORT_FETCH_LIMIT, seededShuffleById} from '@/lib/seededShuffle'

export type PaginatedArtistsParams = {
  tagSlugs: string[]
  mode: 'any' | 'all'
  search: string
  categorySlugs: string[]
  sort: 'alpha' | 'chrono' | 'random'
  seed?: string
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
    seed,
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
        return '| order(artistName asc)'
      default:
        return '| order(artistName asc)'
    }
  }

  const offset = (page - 1) * pageSize
  const queryOffset = sort === 'random' ? 0 : offset
  const queryLimit = sort === 'random' ? RANDOM_SORT_FETCH_LIMIT : pageSize + 1
  const query = getDatabaseBrowseQuery(
    getOrderClause(sort),
    queryOffset,
    queryLimit
  )

  const { data } = await sanityFetch({
    query,
    params: { tagSlugs, categorySlugs, mode, search },
  })

  const pageArtists =
    sort === 'random'
      ? seededShuffleById(data.artists, seed).slice(offset, offset + pageSize + 1)
      : data.artists
  const artists = pageArtists.slice(0, pageSize) // remove extra item
  const hasNextPage = pageArtists.length > pageSize

  return {
    artists,
    hasNextPage,
    nextPage: hasNextPage ? page + 1 : null,
    totalCount: data.totalCount,
  }
}
