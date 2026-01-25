'use client'

import {useState, useEffect, useTransition, useCallback} from 'react'
import {useInView} from 'react-intersection-observer'
import {BiLoaderCircle} from 'react-icons/bi'
import Link from 'next/link'

import {
  getArtistsPaginated,
  type PaginatedArtistsParams,
} from '@/app/database/(browse)/browse/actions'
import {useInfiniteScroll} from '@/hooks/useInfiniteScroll'
import Tag from '../Tag'

type InfiniteArtistsListProps = {
  initialArtists: any[]
  searchParams: PaginatedArtistsParams
}

export default function InfiniteArtistsList({
  initialArtists,
  searchParams,
}: InfiniteArtistsListProps) {
  const [artists, setArtists] = useState(initialArtists)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Reset artists when search params change
  useEffect(() => {
    setArtists(initialArtists)
    setCurrentPage(1)
    setHasNextPage(initialArtists.length >= 20)
  }, [initialArtists, searchParams])

  const {ref, inView} = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  })

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasNextPage) return
    setIsLoadingMore(true)
    try {
      const result = await getArtistsPaginated({
        ...searchParams,
        page: currentPage + 1,
      })
      setArtists((prev) => [...prev, ...result.artists])
      setCurrentPage((prev) => prev + 1)
      setHasNextPage(result.hasNextPage)
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, hasNextPage, searchParams, currentPage])

  useEffect(() => {
    if (inView && hasNextPage && !isLoadingMore) {
      loadMore()
    }
  }, [inView, hasNextPage, isLoadingMore, loadMore])

  useInfiniteScroll(loadMore, {
    enabled: hasNextPage && !isLoadingMore,
    threshold: 0.1,
    rootMargin: '100px',
  })

  if (artists.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg text-center text-gray-500">
        No artists found matching your criteria.
      </div>
    )
  }

  return (
    <div className="space-y-3 w-full group-has-[[data-pending]]:opacity-50 group-has-[[data-pending]]:transition-opacity mt-10 lg:mt-0">
      {artists.map((artist: any, index: number) => (
        <Link
          key={`${artist._id}-${index}`}
          href={`/database/artists/${artist.slug?.current}`}
          className="block w-full"
          scroll={false}
        >
          <div className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-[var(--panel-fg)] text-4xl md:text-3xl w-full xl:w-1/3">
                {artist.artistName}
              </h2>

              <div className="flex flex-wrap gap-2 w-full xl:w-1/3">
                {artist.categories?.map((cat: any) => (
                  <span
                    key={cat._id}
                    className="bg-[var(--panel-fg)] text-white px-1 py-0 text-lg uppercase font-thin font-mono flex items-center gap-1.25 leading-tight"
                  >
                    {cat.title}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-1 w-full xl:w-1/3">
                {artist.tags?.map((tag: any, idx: number) => (
                  <Tag key={tag._key || `fallback-${idx}`} label={tag.title} size="sm" />
                ))}
              </div>
            </div>
          </div>
        </Link>
      ))}

      {/* Loading indicator and sentinel */}
      {hasNextPage && (
        <div ref={ref} className="flex justify-center py-4">
          {isLoadingMore ? (
            <div className="flex items-center justify-center gap-2 text-[color:var(--panel-fg)]/75">
              <BiLoaderCircle className="animate-spin h-6 w-6" />
            </div>
          ) : (
            <div className="text-gray-400 text-sm">Scroll for more...</div>
          )}
        </div>
      )}

      {/* End message */}
      {!hasNextPage && artists.length > 20 && (
        <div className="text-center py-8 text-gray-500">{`You've reached the end! Found ${artists.length} artists.`}</div>
      )}
    </div>
  )
}
