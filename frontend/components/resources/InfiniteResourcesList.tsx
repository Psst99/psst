'use client'

import {
  useState,
  useEffect,
  useCallback,
  useContext,
  useTransition,
  type MouseEvent,
} from 'react'
import {useInView} from 'react-intersection-observer'
import {BiLoaderCircle} from 'react-icons/bi'
import Link from 'next/link'
import {usePathname, useRouter} from 'next/navigation'
import {getResourcesPaginated, PaginatedResourcesParams} from '@/app/resources/(browse)/browse/actions'
import {getResourceSlug} from '@/lib/resources'
import Tag from '../Tag'
import {ThemeContext} from '@/app/ThemeProvider'

type InfiniteResourcesListProps = {
  initialResources: any[]
  searchParams: PaginatedResourcesParams
}

export default function InfiniteResourcesList({
  initialResources,
  searchParams,
}: InfiniteResourcesListProps) {
  const [resources, setResources] = useState(initialResources)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [pendingOpenSlug, setPendingOpenSlug] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const ctx = useContext(ThemeContext)
  const mode = ctx?.mode ?? 'brand'
  const isBrand = mode === 'brand'

  useEffect(() => {
    setResources(initialResources)
    setCurrentPage(1)
    setHasNextPage(initialResources.length >= 20)
    setPendingOpenSlug(null)
  }, [initialResources, searchParams])

  useEffect(() => {
    if (pathname === '/resources/browse' || pathname.startsWith('/resources/items/')) {
      setPendingOpenSlug(null)
    }
  }, [pathname])

  const {ref, inView} = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  })

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasNextPage) return
    setIsLoadingMore(true)
    try {
      const result = await getResourcesPaginated({
        ...searchParams,
        page: currentPage + 1,
      })
      setResources((prev) => [...prev, ...result.resources])
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

  const handleResourceOpenIntent = (event: MouseEvent<HTMLAnchorElement>, resourceSlug: string) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    setPendingOpenSlug(resourceSlug)
    event.preventDefault()
    startTransition(() => {
      router.push(`/resources/items/${encodeURIComponent(resourceSlug)}`, {scroll: false})
    })
  }

  if (resources.length === 0) {
    return (
      <div className="p-8 w-full rounded-lg text-center text-[color:var(--panel-fg)]">
        No resources found matching your criteria.
      </div>
    )
  }

  return (
    <div
      className="space-y-3 w-full group-has-[[data-pending]]:opacity-50 group-has-[[data-pending]]:transition-opacity mt-10 lg:mt-0"
      data-pending={isPending ? '' : undefined}
    >
      {resources.map((resource: any, index: number) => {
        const resourceSlug = getResourceSlug(resource.title, resource._id)
        return (
          <Link
            key={`${resource._id}-${index}`}
            href={`/resources/items/${encodeURIComponent(resourceSlug)}`}
            scroll={false}
            onClick={(event) => handleResourceOpenIntent(event, resourceSlug)}
            className={`block w-full bg-white p-4 rounded-lg hover:shadow-md transition-shadow ${
              pendingOpenSlug === resourceSlug ? 'artist-open-pending' : ''
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div
                className={`${
                  isBrand ? 'text-[var(--section-bg)]' : 'text-[var(--section-fg)]'
                } text-4xl md:text-3xl w-full xl:w-1/3`}
              >
                <span>{resource.title}</span>
              </div>

              <div className="flex flex-wrap gap-2 w-full xl:w-1/3">
                {resource.category && (
                  <span className="bg-[var(--section-bg)] text-[var(--section-fg)] px-1 py-0 text-lg uppercase font-mono flex items-center gap-1.25 leading-tight">
                    {resource.category}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1 w-full xl:w-1/3">
                {resource.tags?.map((tag: any, idx: number) => (
                  <Tag key={tag._id || `fallback-${idx}`} label={tag.title} size="sm" />
                ))}
              </div>
            </div>
          </Link>
        )
      })}

      {hasNextPage && (
        <div ref={ref} className="flex justify-center py-4">
          {isLoadingMore ? (
            <div className="flex items-center justify-center gap-2 text-[color:var(--panel-fg)]/75">
              <BiLoaderCircle className="animate-spin h-6 w-6" />
            </div>
          ) : (
            <div className="h-6" aria-hidden="true" />
          )}
        </div>
      )}

      {!hasNextPage && resources.length > 20 && (
        <div className="text-center py-8 text-gray-500">
          {`You've reached the end! Found ${resources.length} resources.`}
        </div>
      )}
    </div>
  )
}
