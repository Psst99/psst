// components/database/ArtistsList.tsx
'use client'

import {useEffect, useMemo, useRef, useState} from 'react'
import CustomLink from '../CustomLink'

type Artist = {
  _id: string
  artistName: string
  slug?: {current?: string}
  categories?: {_id: string; title: string}[]
  tags?: {_key?: string; title: string}[]
}

type Params = {
  tags?: string
  mode?: 'any' | 'all'
  search?: string
  sort?: 'alpha' | 'chrono' | 'random'
  category?: string
}

export default function ArtistsList({
  initialArtists,
  total,
  pageSize,
  params,
}: {
  initialArtists: Artist[]
  total: number
  pageSize: number
  params: Params
}) {
  const [artists, setArtists] = useState<Artist[]>(initialArtists)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialArtists.length < total)

  // Reset list when filters/search change (page re-renders with new props too)
  const paramsKey = useMemo(() => JSON.stringify(params), [params])
  useEffect(() => {
    setArtists(initialArtists)
    setPage(1)
    setHasMore(initialArtists.length < total)
  }, [paramsKey, initialArtists, total])

  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!hasMore) return
    const el = sentinelRef.current
    if (!el) return

    let abort: AbortController | null = null
    const io = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0]
        if (!entry.isIntersecting || loading) return

        setLoading(true)
        abort?.abort()
        abort = new AbortController()

        const qp = new URLSearchParams({
          page: String(page + 1),
          limit: String(pageSize),
          tags: params.tags ?? '',
          category: params.category ?? '',
          search: params.search ?? '',
          sort: params.sort ?? 'alpha',
          mode: params.mode ?? 'any',
        })

        try {
          const res = await fetch(`/api/artists?${qp}`, {
            signal: abort.signal,
            cache: 'no-store',
          })
          const more: Artist[] = await res.json()

          setArtists((prev) => [...prev, ...more])
          setPage((p) => p + 1)
          if (more.length < pageSize) setHasMore(false)
        } catch {
          // ignore aborted / network errors for scroll
        } finally {
          setLoading(false)
        }
      },
      {rootMargin: '100px 0px 0px 0px', threshold: 0},
    )

    io.observe(el)
    return () => {
      io.disconnect()
      abort?.abort()
    }
  }, [
    page,
    pageSize,
    paramsKey,
    hasMore,
    loading,
    params.category,
    params.mode,
    params.search,
    params.sort,
    params.tags,
  ])

  return (
    <div className="flex-1 space-y-3 mt-4 md:mt-0">
      {/* Optional count */}
      <div className="text-[#6600ff] text-sm">
        {total} artist{total !== 1 ? 's' : ''} found
      </div>

      {artists.length === 0 ? (
        <div className="bg-white p-8 rounded-lg text-center text-gray-500">
          No artists found matching your criteria.
        </div>
      ) : (
        artists.map((artist) => (
          <CustomLink
            key={artist._id}
            href={`/database/${artist.slug?.current}`}
            className="block w-full"
          >
            <div className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="text-[#6600ff] text-4xl md:text-3xl w-1/3">{artist.artistName}</h2>
                <div className="flex gap-2 w-1/3">
                  {artist.categories?.map((cat) => (
                    <span
                      key={cat._id}
                      className="bg-[#6600ff] text-white px-1 py-0 text-lg uppercase font-thin font-mono flex items-center gap-1.25 leading-tight"
                    >
                      {cat.title}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 mt-4 w-1/3">
                  {artist.tags?.map((tag, idx) => (
                    <span key={tag._key || `fallback-${idx}`} className="inline-flex">
                      <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                        {tag.title}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CustomLink>
        ))
      )}

      {/* Sentinel */}
      <div ref={sentinelRef} />

      {/* Tiny loading hint */}
      {loading && <div className="text-center text-[#6600ff] py-3">Loading…</div>}

      {!hasMore && artists.length > 0 && (
        <div className="text-center text-gray-400 py-2 text-sm">You’ve reached the end.</div>
      )}
    </div>
  )
}
