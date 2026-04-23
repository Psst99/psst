'use client'

import {useState} from 'react'
import {createPortal} from 'react-dom'
import {IoMdClose} from 'react-icons/io'
import {RiSearchLine} from 'react-icons/ri'
import OptimisticFilters from './OptimisticFilters'
import type {DatabaseSearchParams} from './DatabaseBrowseContentAsync'
import {MODAL_CLOSE_BUTTON_CLASS} from '@/lib/modalStyles'
import {slugifyTag} from '@/lib/tags'
import SectionScope from '@/components/SectionScope'

interface MobileFiltersModalProps {
  categories: Array<{
    _id: string
    title: string
  }>
  tags: Array<{
    _id: string
    title: string
  }>
  initialParams: DatabaseSearchParams
  totalCount: number
}

export default function MobileFiltersModal({
  categories,
  tags,
  initialParams,
  totalCount,
}: MobileFiltersModalProps) {
  const [open, setOpen] = useState(false)

  // Add slug property to categories
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
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-[6.75rem] left-1/2 -translate-x-1/2 z-50 w-12 h-12 rounded-full bg-[var(--panel-fg)] flex items-center justify-center shadow-lg md:hidden"
        type="button"
      >
        <span className="text-white text-2xl rotate-90">
          <RiSearchLine />
        </span>
      </button>

      {/* Fullscreen modal */}
      {open &&
        createPortal(
          <SectionScope section="database">
            <div
              className="fixed inset-0 z-[9999] overflow-y-auto md:hidden"
              style={{backgroundColor: 'color-mix(in srgb, var(--panel-fg) 75%, transparent)'}}
            >
              <div className="absolute bottom-4 right-1/2 translate-x-1/2 rounded-full bg-white">
                <button
                  onClick={() => setOpen(false)}
                  className={`text-[var(--panel-fg)] text-3xl ${MODAL_CLOSE_BUTTON_CLASS}`}
                  type="button"
                  aria-label="Close database filters"
                >
                  <IoMdClose className="h-12 w-12 mt-0 -mb-1 mx-0" aria-hidden="true" />
                </button>
              </div>
              <div className="p-4">
                <OptimisticFilters
                  categories={categoriesWithSlug as any}
                  tags={tagsWithSlug as any}
                  initialParams={initialParams}
                  totalCount={totalCount}
                />
              </div>
            </div>
          </SectionScope>,
          document.body,
        )}
    </>
  )
}
