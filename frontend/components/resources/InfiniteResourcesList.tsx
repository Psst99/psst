// InfiniteResourcesList.tsx - Fixed version
'use client'

import {useState, useEffect, useTransition, useCallback} from 'react'
import {useInView} from 'react-intersection-observer'
import {BiLoaderCircle} from 'react-icons/bi'
import {getResourcesPaginated, PaginatedResourcesParams} from '@/app/resources/browse/actions'
import {useInfiniteScroll} from '@/hooks/useInfiniteScroll'
import Link from 'next/link'
import Tag from '../Tag'

type InfiniteResourcesListProps = {
  initialResources: any[]
  searchParams: PaginatedResourcesParams
}

// Helper functions (same as Database)
function getComputedBg(label: string) {
  const len = label.toLowerCase().replace(/[^a-z0-9]/g, '').length || 1
  const hue = (len * 137.508) % 360
  return `hsl(${hue} 90% 60%)`
}

function getComputedFg(label: string) {
  const len = label.toLowerCase().replace(/[^a-z0-9]/g, '').length || 1
  const hue = (len * 137.508 + 180) % 360
  return `hsl(${hue} 90% 30%)`
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

  // Reset resources when search params change
  useEffect(() => {
    setResources(initialResources)
    setCurrentPage(1)
    setHasNextPage(initialResources.length >= 20)
  }, [initialResources, searchParams])

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

  const sentinelRef = useInfiniteScroll(loadMore, {
    enabled: hasNextPage && !isLoadingMore,
    threshold: 0.1,
    rootMargin: '100px',
  })

  if (resources.length === 0) {
    return (
      <div className="p-8 w-full rounded-lg text-center text-[#FE93E7]">
        No resources found matching your criteria.
      </div>
    )
  }

  return (
    <div className="space-y-3 w-full group-has-[[data-pending]]:opacity-50 group-has-[[data-pending]]:transition-opacity mt-10 lg:mt-0">
      {resources.map((resource: any, index: number) => (
        <div
          key={`${resource._id}-${index}`}
          className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            {/* Title - Make it clickable if there's a URL */}
            <div className="text-[#6600ff] text-4xl md:text-3xl w-full xl:w-1/3">
              {resource.url || resource.fileUrl ? (
                <a
                  href={resource.url || resource.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {resource.title}
                </a>
              ) : (
                <span>{resource.title}</span>
              )}
            </div>

            {/* Category */}
            <div className="flex flex-wrap gap-2 w-full xl:w-1/3">
              {resource.category && (
                <span className="bg-[#FE93E7] text-[#1D53FF] px-1 py-0 text-lg uppercase font-thin font-mono flex items-center gap-1.25 leading-tight">
                  {resource.category}
                </span>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 w-full xl:w-1/3">
              {resource.tags?.map((tag: any, idx: number) => (
                <Tag key={tag._id || `fallback-${idx}`} label={tag.title} size="sm" />
              ))}
            </div>
          </div>

          {/* Description (optional - similar to how database might show it) */}
          {/* {resource.description && (
            <p className='text-gray-600 mt-2 text-sm'>{resource.description}</p>
          )} */}
        </div>
      ))}

      {/* Loading indicator and sentinel */}
      {hasNextPage && (
        <div ref={ref} className="flex justify-center py-4">
          {isLoadingMore ? (
            <div className="flex items-center justify-center gap-2 text-[#6600ff]/75">
              <BiLoaderCircle className="animate-spin h-6 w-6" />
            </div>
          ) : (
            <div className="text-gray-400 text-sm">Scroll for more...</div>
          )}
        </div>
      )}

      {/* End message */}
      {!hasNextPage && resources.length > 20 && (
        <div className="text-center py-8 text-gray-500">
          {`You've reached the end! Found ${resources.length} resources.`}
        </div>
      )}
    </div>
  )
}
