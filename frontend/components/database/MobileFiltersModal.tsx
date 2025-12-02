'use client'
import { useState } from 'react'
import { X } from '@/components/icons'
import OptimisticFilters from './OptimisticFilters'
import { createPortal } from 'react-dom'
import { IoMdClose } from 'react-icons/io'
import { RiSearchLine } from 'react-icons/ri'
import { DatabaseSearchParams } from './DatabaseBrowseContentAsync'
import { slugifyTag } from '@/lib/tags'

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
        className='fixed top-[6.75rem] left-1/2 -translate-x-1/2 z-50 w-12 h-12 rounded-full bg-[#6600ff] flex items-center justify-center shadow-lg md:hidden'
      >
        <span className='text-white text-2xl rotate-90'>
          {/* 🔍 */}
          <RiSearchLine />
        </span>
      </button>

      {/* Fullscreen modal */}
      {open &&
        createPortal(
          <div className='fixed inset-0 bg-[#6600ff]/75 z-[9999] overflow-y-auto md:hidden'>
            <div className='absolute bottom-4 right-1/2 translate-x-1/2 rounded-full bg-white'>
              <button
                onClick={() => setOpen(false)}
                className='text-[#6600ff] text-3xl'
              >
                <IoMdClose
                  className='h-12 w-12 mt-0 -mb-1 mx-0'
                  aria-hidden='true'
                />
              </button>
            </div>
            <div className='px-4 py-8'>
              <OptimisticFilters
                categories={categoriesWithSlug}
                tags={tagsWithSlug}
                initialParams={initialParams}
                totalCount={totalCount}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
