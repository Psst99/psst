'use client'
import {useRouter} from 'next/navigation'
import {useOptimistic, useTransition, useEffect, useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {slugifyTag} from '@/lib/tags'
import {ResourcesSearchParams} from './ResourcesBrowseContentAsync'
import ResourcesOptimisticTagPill from './ResourcesOptimisticTagPill'
import {IoMdClose, IoMdShuffle} from 'react-icons/io'

type OptimisticFiltersProps = {
  categories: Array<{_id: string; title: string; slug: {current: string} | string}>
  tags: Array<{_id: string; title: string; slug: string}>
  initialParams: ResourcesSearchParams
  totalCount: number
}

const SORTS = [
  {key: 'alpha', label: 'Alphabetically'},
  {key: 'chrono', label: 'Chronologically'},
  {key: 'random', label: 'Randomly'},
]

export default function ResourcesOptimisticFilters({
  categories,
  tags,
  initialParams,
  totalCount,
}: OptimisticFiltersProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Use optimistic state for all filter parameters
  const [optimisticParams, setOptimisticParams] = useOptimistic(initialParams)

  // Local state for search input (for debouncing)
  const [searchValue, setSearchValue] = useState(optimisticParams.search ?? '')

  // State for shuffled tags
  const [shuffledTags, setShuffledTags] = useState(() => [...tags].sort(() => Math.random() - 0.5))

  // Shuffle function
  const shuffleTags = () => {
    setShuffledTags([...tags].sort(() => Math.random() - 0.5))
  }

  // Update search value when optimistic params change (e.g., browser navigation)
  useEffect(() => {
    setSearchValue(optimisticParams.search ?? '')
  }, [optimisticParams.search])

  // Debounced search effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue !== optimisticParams.search) {
        updateParams({search: searchValue || undefined})
      }
    }, 250)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, optimisticParams.search])

  // Helper function to update URL params
  const updateParams = (updates: Partial<ResourcesSearchParams>) => {
    const newParams = {...optimisticParams, ...updates}

    // Clean up undefined values
    Object.keys(newParams).forEach((key) => {
      if (newParams[key as keyof ResourcesSearchParams] === undefined) {
        delete newParams[key as keyof ResourcesSearchParams]
      }
    })

    const searchParams = new URLSearchParams()

    if (newParams.search) searchParams.set('search', newParams.search)
    if (newParams.sort && newParams.sort !== 'alpha') searchParams.set('sort', newParams.sort)
    if (newParams.tags) searchParams.set('tags', newParams.tags)
    if (newParams.category) searchParams.set('category', newParams.category)
    if (newParams.mode && newParams.mode !== 'any') searchParams.set('mode', newParams.mode)

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

    updateParams({tags: newTags.length > 0 ? newTags.join(',') : undefined})
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
    <div className="w-full md:w-80 space-y-3" data-pending={isPending ? '' : undefined}>
      {/* Search */}
      <div className="bg-white py-1 px-6 rounded-md">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full p-1 text-center text-[#FE93E7] uppercase tracking-tight text-xl"
          placeholder="Search"
        />
      </div>

      {/* Total Count Display */}
      <div className="bg-white py-2 px-6 rounded-md">
        <div className="text-center text-[#FE93E7] tracking-tight text-lg lowercase">
          {totalCount} {totalCount === 1 ? 'Entry' : 'Entries'}
        </div>
      </div>

      {/* Sort */}
      <div className="bg-white py-1 pb-3 px-6 rounded-md">
        <div className="text-center text-[#FE93E7] uppercase tracking-tight text-xl mb-2">Sort</div>
        <div className="space-y-2 text-lg">
          {SORTS.map((s) => (
            <button
              key={s.key}
              className={`w-full border border-[#FE93E7] p-0 rounded-md transition-colors ${
                (optimisticParams.sort ?? 'alpha') === s.key
                  ? 'bg-[#FE93E7] text-white'
                  : 'text-[#FE93E7] hover:bg-[#FE93E7] hover:text-white'
              }`}
              onClick={() => updateParams({sort: s.key as any})}
              type="button"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white py-1 pb-3 px-6 rounded-md">
        <div className="text-center text-[#FE93E7] uppercase tracking-tight text-xl mb-2">
          Categories
        </div>
        <div className="flex flex-wrap gap-1.5 font-mono text-lg uppercase font-normal leading-tight">
          {categories.map((cat) => {
            const slug = typeof cat.slug === 'string' ? cat.slug : cat.slug.current
            const isActive = selectedCategories.includes(slug)
            return (
              <button
                key={cat._id || slug}
                onClick={() => toggleCategory(slug)}
                className={`px-1 py-0 cursor-pointer transition-colors uppercase flex items-center justify-center gap-x-2 ${
                  isActive ? 'bg-[#FE93E7] text-[#1D53FF]' : 'text-[#FE93E7] bg-[#1D53FF]'
                }`}
              >
                {cat.title}
                {isActive && <IoMdClose className="h-3 w-3" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tags with Shuffle */}
      <div className="bg-white py-1 pb-3 px-6 rounded-md max-h-[30vh] xl:max-h-[40vh] overflow-y-auto no-scrollbar">
        <div className="text-center text-[#FE93E7] uppercase tracking-tight text-xl mb-2 flex items-center justify-center gap-1">
          <span>Tags</span>{' '}
          <button
            onClick={shuffleTags}
            className="text-[#FE93E7] hover:text-[#d3cd7f] transition-colors"
            title="Shuffle tags"
          >
            <IoMdShuffle className="bg-[#FE93E7] text-[#d3cd7f] rounded-lg h-6 w-6 cursor-pointer" />
          </button>
        </div>
        <motion.div className="flex flex-wrap gap-1.5" layout>
          <AnimatePresence mode="popLayout">
            {shuffledTags.map((tag) => (
              <motion.div
                key={tag._id}
                layout
                initial={{opacity: 0, scale: 0.8}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.8}}
                transition={{
                  layout: {duration: 0.3},
                  opacity: {duration: 0.2},
                  scale: {duration: 0.2},
                }}
              >
                <ResourcesOptimisticTagPill
                  label={tag.title}
                  selectedSlugs={new Set(selectedTags)}
                  onToggle={toggleTag}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Clear all filters button */}
      {(selectedTags.length > 0 || selectedCategories.length > 0 || searchValue) && (
        <button
          onClick={() => {
            setSearchValue('')
            updateParams({
              tags: undefined,
              category: undefined,
              search: undefined,
            })
          }}
          className="w-full bg-[#FE93E7] text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  )
}
