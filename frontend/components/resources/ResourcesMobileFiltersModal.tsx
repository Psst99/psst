'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { X } from '@/components/icons'
import ResourcesOptimisticTagPill from './ResourcesOptimisticTagPill'
import { IoMdClose, IoMdShuffle } from 'react-icons/io'
import { motion, AnimatePresence } from 'framer-motion'
import { slugifyTag } from '@/lib/tags'

const SORTS = [
  { key: 'alpha', label: 'Alphabetically' },
  { key: 'chrono', label: 'Chronologically' },
  { key: 'random', label: 'Randomly' },
]

export default function ResourcesMobileFiltersModal({
  categories,
  tags,
  initialParams,
  totalCount,
}: {
  categories: any[]
  tags: any[]
  initialParams: any
  totalCount: number
}) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchValue, setSearchValue] = useState(
    searchParams?.get('search') ?? ''
  )
  const [shuffledTags, setShuffledTags] = useState(() =>
    [...tags].sort(() => Math.random() - 0.5)
  )

  const selectedTagSlugs = (searchParams?.get('tags') ?? '')
    .split(',')
    .filter(Boolean)

  const selectedCategorySlugs = (searchParams?.get('category') ?? '')
    .split(',')
    .filter(Boolean)

  const sort = searchParams?.get('sort') ?? 'alpha'
  const mode = searchParams?.get('mode') ?? 'any'

  // Update search value when params change
  useEffect(() => {
    setSearchValue(searchParams?.get('search') ?? '')
  }, [searchParams])

  // Shuffle function
  const shuffleTags = () => {
    setShuffledTags([...tags].sort(() => Math.random() - 0.5))
  }

  const updateUrl = (newParams: URLSearchParams) => {
    router.push(`${pathname}?${newParams.toString()}`)
  }

  const toggleTag = (tagTitle: string) => {
    const tagSlug = slugifyTag(tagTitle)
    const newSearchParams = new URLSearchParams(searchParams?.toString())
    const currentTags =
      newSearchParams.get('tags')?.split(',').filter(Boolean) || []

    if (currentTags.includes(tagSlug)) {
      // Remove tag
      newSearchParams.set(
        'tags',
        currentTags.filter((t) => t !== tagSlug).join(',')
      )
    } else {
      // Add tag
      currentTags.push(tagSlug)
      newSearchParams.set('tags', currentTags.join(','))
    }

    updateUrl(newSearchParams)
  }

  const toggleCategory = (slug: string) => {
    const newSearchParams = new URLSearchParams(searchParams?.toString())
    const current =
      newSearchParams.get('category')?.split(',').filter(Boolean) || []

    if (current.includes(slug)) {
      // Remove category
      newSearchParams.set(
        'category',
        current.filter((t) => t !== slug).join(',')
      )
    } else {
      // Add category
      current.push(slug)
      newSearchParams.set('category', current.join(','))
    }

    updateUrl(newSearchParams)
  }

  const toggleMode = () => {
    const newSearchParams = new URLSearchParams(searchParams?.toString())
    const newMode = mode === 'any' ? 'all' : 'any'
    newSearchParams.set('mode', newMode)
    updateUrl(newSearchParams)
  }

  const setSort = (newSort: string) => {
    const newSearchParams = new URLSearchParams(searchParams?.toString())
    newSearchParams.set('sort', newSort)
    updateUrl(newSearchParams)
  }

  const updateSearch = () => {
    const newSearchParams = new URLSearchParams(searchParams?.toString())
    if (searchValue) {
      newSearchParams.set('search', searchValue)
    } else {
      newSearchParams.delete('search')
    }
    updateUrl(newSearchParams)
  }

  const clearFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams?.toString())
    newSearchParams.delete('tags')
    newSearchParams.delete('category')
    newSearchParams.delete('search')
    newSearchParams.delete('mode')
    newSearchParams.set('sort', 'alpha')
    updateUrl(newSearchParams)
    setSearchValue('')
  }

  return (
    <>
      {/* Modal trigger button - only visible on mobile */}
      <div className='md:hidden fixed bottom-4 right-4 z-30'>
        <button
          onClick={() => setIsOpen(true)}
          className='bg-[#FE93E7] text-white p-3 rounded-full shadow-lg flex items-center justify-center'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
            />
          </svg>
        </button>
      </div>

      {/* Modal backdrop */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Modal content */}
      <div
        className={`fixed bottom-0 inset-x-0 md:hidden bg-white p-4 rounded-t-xl shadow-lg z-50 transform transition-transform ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold text-[#FE93E7]'>Filters</h2>
          <button onClick={() => setIsOpen(false)}>
            <X className='w-6 h-6 text-[#FE93E7]' />
          </button>
        </div>

        <div className='max-h-[70vh] overflow-y-auto space-y-4'>
          {/* Search */}
          <div className='bg-white border border-[#FE93E7] py-1 px-4 rounded-md'>
            <input
              type='text'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onBlur={updateSearch}
              onKeyDown={(e) => e.key === 'Enter' && updateSearch()}
              className='w-full p-1 text-center text-[#FE93E7] uppercase tracking-tight text-xl'
              placeholder='Search'
            />
          </div>

          {/* Total Count Display */}
          <div className='bg-white border border-[#FE93E7] py-2 px-4 rounded-md'>
            <div className='text-center text-[#FE93E7] tracking-tight text-lg lowercase'>
              {totalCount} {totalCount === 1 ? 'Entry' : 'Entries'}
            </div>
          </div>

          {/* Sort */}
          <div className='bg-white border border-[#FE93E7] py-1 pb-3 px-4 rounded-md'>
            <div className='text-center text-[#FE93E7] uppercase tracking-tight text-xl mb-2'>
              Sort
            </div>
            <div className='space-y-2 text-lg'>
              {SORTS.map((s) => (
                <button
                  key={s.key}
                  className={`w-full border border-[#FE93E7] p-0 rounded-md transition-colors ${
                    sort === s.key
                      ? 'bg-[#FE93E7] text-white'
                      : 'text-[#FE93E7] hover:bg-[#FE93E7] hover:text-white'
                  }`}
                  onClick={() => setSort(s.key)}
                  type='button'
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className='bg-white border border-[#FE93E7] py-1 pb-3 px-4 rounded-md'>
            <div className='text-center text-[#FE93E7] uppercase tracking-tight text-xl mb-2'>
              Categories
            </div>
            <div className='flex flex-wrap gap-1.5 font-mono text-lg uppercase font-normal leading-tight'>
              {categories.map((cat) => {
                const isActive = selectedCategorySlugs.includes(
                  cat.slug.current
                )
                return (
                  <button
                    key={cat._id || cat.slug.current}
                    onClick={() => toggleCategory(cat.slug.current)}
                    className={`px-1 py-0 cursor-pointer transition-colors uppercase flex items-center justify-center gap-x-2 ${
                      isActive
                        ? 'text-[#fff] bg-[#FE93E7]'
                        : 'bg-[#d3cd7f] text-[#FE93E7]'
                    }`}
                  >
                    {cat.title}
                    {isActive && (
                      <IoMdClose className='h-3 w-3' aria-hidden='true' />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tags with Shuffle */}
          <div className='bg-white border border-[#FE93E7] py-1 pb-3 px-4 rounded-md max-h-[30vh] overflow-y-auto'>
            <div className='text-center text-[#FE93E7] uppercase tracking-tight text-xl mb-2 flex items-center justify-center gap-1'>
              <span>Tags</span>{' '}
              <button
                onClick={shuffleTags}
                className='text-[#FE93E7] hover:text-[#d3cd7f] transition-colors'
                title='Shuffle tags'
              >
                <IoMdShuffle className='bg-[#FE93E7] text-[#d3cd7f] rounded-lg h-6 w-6 cursor-pointer' />
              </button>
            </div>
            <motion.div className='flex flex-wrap gap-1.5' layout>
              <AnimatePresence mode='popLayout'>
                {shuffledTags.map((tag) => (
                  <motion.div
                    key={tag._id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      layout: { duration: 0.3 },
                      opacity: { duration: 0.2 },
                      scale: { duration: 0.2 },
                    }}
                  >
                    <ResourcesOptimisticTagPill
                      label={tag.title}
                      selectedSlugs={new Set(selectedTagSlugs)}
                      onToggle={toggleTag}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Match Mode */}
          {selectedTagSlugs.length > 1 && (
            <div className='bg-white border border-[#FE93E7] py-2 px-4 rounded-md'>
              <button
                onClick={toggleMode}
                className='w-full text-center text-[#FE93E7] text-sm underline'
              >
                {mode === 'any' ? 'Match any filter' : 'Match all filters'}
              </button>
            </div>
          )}

          {/* Clear all filters button */}
          {(selectedTagSlugs.length > 0 ||
            selectedCategorySlugs.length > 0 ||
            searchValue) && (
            <button
              onClick={clearFilters}
              className='w-full bg-[#FE93E7] text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors'
            >
              Clear All Filters
            </button>
          )}
        </div>

        <div className='mt-4 pt-2 border-t border-gray-200 flex justify-end'>
          <button
            onClick={() => setIsOpen(false)}
            className='bg-[#FE93E7] text-white px-4 py-2 rounded-md'
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  )
}
