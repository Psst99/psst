'use client'
import { useRouter } from 'next/navigation'
import { useOptimistic, useTransition, useEffect, useState } from 'react'
import { slugifyTag } from '@/lib/tags'
import { DatabaseSearchParams } from './DatabaseBrowseContentAsync'
import OptimisticTagPill from './OptimisticTagPill'

type OptimisticFiltersProps = {
  categories: Array<{ _id: string; title: string; slug: string }>
  tags: Array<{ _id: string; title: string; slug: string }>
  initialParams: DatabaseSearchParams
}

const SORTS = [
  { key: 'alpha', label: 'Alphabetically' },
  { key: 'chrono', label: 'Chronologically' },
  { key: 'random', label: 'Randomly' },
]

export default function OptimisticFilters({
  categories,
  tags,
  initialParams,
}: OptimisticFiltersProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Use optimistic state for all filter parameters
  const [optimisticParams, setOptimisticParams] = useOptimistic(initialParams)

  // Local state for search input (for debouncing)
  const [searchValue, setSearchValue] = useState(optimisticParams.search ?? '')

  // Update search value when optimistic params change (e.g., browser navigation)
  useEffect(() => {
    setSearchValue(optimisticParams.search ?? '')
  }, [optimisticParams.search])

  // Debounced search effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue !== optimisticParams.search) {
        updateParams({ search: searchValue || undefined })
      }
    }, 250)

    return () => clearTimeout(timeout)
  }, [searchValue, optimisticParams.search])

  // Helper function to update URL params
  const updateParams = (updates: Partial<DatabaseSearchParams>) => {
    const newParams = { ...optimisticParams, ...updates }

    // Clean up undefined values
    Object.keys(newParams).forEach((key) => {
      if (newParams[key as keyof DatabaseSearchParams] === undefined) {
        delete newParams[key as keyof DatabaseSearchParams]
      }
    })

    const searchParams = new URLSearchParams()

    if (newParams.search) searchParams.set('search', newParams.search)
    if (newParams.sort && newParams.sort !== 'alpha')
      searchParams.set('sort', newParams.sort)
    if (newParams.tags) searchParams.set('tags', newParams.tags)
    if (newParams.category) searchParams.set('category', newParams.category)
    if (newParams.mode && newParams.mode !== 'any')
      searchParams.set('mode', newParams.mode)

    startTransition(() => {
      setOptimisticParams(newParams)
      router.push(`?${searchParams.toString()}`)
    })
  }

  // Parse selected tags and categories
  const selectedTags = optimisticParams.tags
    ? optimisticParams.tags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : []

  const selectedCategories = optimisticParams.category
    ? optimisticParams.category
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : []

  // Toggle tag function
  const toggleTag = (tagTitle: string) => {
    const tagSlug = slugifyTag(tagTitle)
    const newTags = selectedTags.includes(tagSlug)
      ? selectedTags.filter((t) => t !== tagSlug)
      : [...selectedTags, tagSlug]

    updateParams({ tags: newTags.length > 0 ? newTags.join(',') : undefined })
  }

  // Toggle category function
  const toggleCategory = (categorySlug: string) => {
    const newCategories = selectedCategories.includes(categorySlug)
      ? selectedCategories.filter((c) => c !== categorySlug)
      : [...selectedCategories, categorySlug]

    updateParams({
      category: newCategories.length > 0 ? newCategories.join(',') : undefined,
    })
  }

  return (
    <div
      className='w-full md:w-80 space-y-3'
      data-pending={isPending ? '' : undefined}
    >
      {/* Search */}
      <div className='bg-white py-1 pb-3 px-6 rounded-md'>
        <input
          type='text'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className='w-full p-1 text-center text-[#6600ff] uppercase tracking-tight md:text-xl'
          placeholder='Search'
        />
      </div>

      {/* Sort */}
      <div className='hidden md:block bg-white py-1 pb-3 px-6 rounded-md'>
        <div className='text-center text-[#6600ff] uppercase tracking-tight md:text-xl mb-2'>
          Sort
        </div>
        <div className='space-y-2 text-lg'>
          {SORTS.map((s) => (
            <button
              key={s.key}
              className={`w-full border border-[#6600ff] p-0 rounded-md transition-colors ${
                (optimisticParams.sort ?? 'alpha') === s.key
                  ? 'bg-[#6600ff] text-white'
                  : 'text-[#6600ff] hover:bg-[#6600ff] hover:text-white'
              }`}
              onClick={() => updateParams({ sort: s.key as any })}
              type='button'
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className='bg-white py-1 pb-3 px-6 rounded-md hidden md:block'>
        <div className='text-center text-[#6600ff] uppercase tracking-tight md:text-xl mb-2'>
          Categories
        </div>
        <div className='flex flex-wrap gap-1.5 font-mono text-lg uppercase font-light leading-tight'>
          {categories.map((cat) => {
            const isActive = selectedCategories.includes(cat.slug)
            return (
              <button
                key={cat._id}
                onClick={() => toggleCategory(cat.slug)}
                className={`px-1 py-0 cursor-pointer transition-colors uppercase ${
                  isActive
                    ? 'bg-[#6600ff] text-white'
                    : 'bg-gray-200 text-[#6600ff] hover:bg-[#6600ff] hover:text-white'
                }`}
              >
                {cat.title}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tags */}
      <div className='bg-white py-1 pb-3 px-6 rounded-md max-h-[40vh] overflow-y-auto no-scrollbar'>
        <div className='text-center text-[#6600ff] uppercase tracking-tight md:text-xl mb-2'>
          Tags
        </div>
        <div className='flex flex-wrap gap-1.5'>
          {tags.map((tag) => (
            <OptimisticTagPill
              key={tag._id}
              label={tag.title}
              selectedSlugs={new Set(selectedTags)}
              onToggle={toggleTag}
            />
          ))}
        </div>
      </div>

      {/* Clear all filters button */}
      {(selectedTags.length > 0 ||
        selectedCategories.length > 0 ||
        searchValue) && (
        <button
          onClick={() => {
            setSearchValue('')
            updateParams({
              tags: undefined,
              category: undefined,
              search: undefined,
            })
          }}
          className='w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors'
        >
          Clear All Filters
        </button>
      )}
    </div>
  )
}
