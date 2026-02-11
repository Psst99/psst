'use client'

import {useState} from 'react'
import {createPortal} from 'react-dom'
import {IoMdClose} from 'react-icons/io'
import {RiSearchLine} from 'react-icons/ri'
import ResourcesOptimisticFilters from './ResourcesOptimisticFilters'
import type {ResourcesSearchParams} from './ResourcesBrowseContentAsync'
import {slugifyTag} from '@/lib/tags'

interface ResourcesMobileFiltersModalProps {
  categories: Array<{
    _id: string
    title: string
  }>
  tags: Array<{
    _id: string
    title: string
  }>
  initialParams: ResourcesSearchParams
  totalCount: number
}

export default function ResourcesMobileFiltersModal({
  categories,
  tags,
  initialParams,
  totalCount,
}: ResourcesMobileFiltersModalProps) {
  const [open, setOpen] = useState(false)

  const categoriesWithSlug = categories.map((category) => ({
    ...category,
    slug: slugifyTag(category.title),
  }))

  const tagsWithSlug = tags.map((tag) => ({
    ...tag,
    slug: slugifyTag(tag.title),
  }))

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-[6.75rem] left-1/2 -translate-x-1/2 z-50 w-12 h-12 rounded-full bg-[var(--panel-fg)] flex items-center justify-center shadow-lg md:hidden"
        type="button"
      >
        <span className="text-white text-2xl rotate-90">
          <RiSearchLine />
        </span>
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 bg-[color:var(--panel-fg)]/75 z-[9999] overflow-y-auto md:hidden">
            <div className="absolute bottom-4 right-1/2 translate-x-1/2 rounded-full bg-white">
              <button
                onClick={() => setOpen(false)}
                className="text-[var(--panel-fg)] text-3xl"
                type="button"
              >
                <IoMdClose className="h-12 w-12 mt-0 -mb-1 mx-0" aria-hidden="true" />
              </button>
            </div>
            <div className="px-4 py-8">
              <ResourcesOptimisticFilters
                categories={categoriesWithSlug as any}
                tags={tagsWithSlug as any}
                initialParams={initialParams}
                totalCount={totalCount}
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
