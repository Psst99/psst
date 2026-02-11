'use client'
import {useRouter} from 'next/navigation'
import {useOptimistic, useTransition, useEffect, useState, useContext} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {slugifyTag} from '@/lib/tags'
import {ResourcesSearchParams} from './ResourcesBrowseContentAsync'
import ResourcesOptimisticTagPill from './ResourcesOptimisticTagPill'
import {IoMdClose, IoIosShuffle} from 'react-icons/io'
import {ThemeContext} from '@/app/ThemeProvider'

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

function shuffleArray<T>(arr: T[]): T[] {
  const next = [...arr]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

export default function ResourcesOptimisticFilters({
  categories,
  tags,
  initialParams,
  totalCount,
}: OptimisticFiltersProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const ctx = useContext(ThemeContext)
  const mode = ctx?.mode ?? 'brand'
  const headingClass = mode === 'brand' ? 'text-[var(--section-bg)]' : 'text-[var(--section-fg)]'
  const activeSortButtonClass =
    mode === 'brand'
      ? 'bg-[var(--section-bg)] text-white'
      : 'bg-[var(--section-fg)] text-white border border-[var(--panel-fg)]'

  // Use optimistic state for all filter parameters
  const [optimisticParams, setOptimisticParams] = useOptimistic(initialParams)

  // Local state for search input (for debouncing)
  const [searchValue, setSearchValue] = useState(optimisticParams.search ?? '')

  // State for shuffled tags
  const [shuffledTags, setShuffledTags] = useState(() => [...tags])

  // Shuffle function
  const shuffleTags = () => {
    setShuffledTags(shuffleArray(tags))
  }

  // Update search value when optimistic params change (e.g., browser navigation)
  useEffect(() => {
    setSearchValue(optimisticParams.search ?? '')
  }, [optimisticParams.search])

  // Debounced search effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      const normalizedOptimisticSearch = optimisticParams.search ?? ''
      if (searchValue !== normalizedOptimisticSearch) {
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
          className={`w-full p-1 text-center uppercase tracking-tight text-xl ${headingClass}`}
          placeholder="Search"
        />
      </div>

      {/* Total Count Display */}
      <div className="bg-white py-2 px-6 rounded-md">
        <div className={`text-center tracking-tight text-lg lowercase ${headingClass}`}>
          {totalCount} {totalCount === 1 ? 'Entry' : 'Entries'}
        </div>
      </div>

      {/* Sort */}
      <div className="bg-white py-1 pb-3 px-6 rounded-md">
        <div className={`text-center uppercase tracking-tight text-xl mb-2 ${headingClass}`}>Sort</div>
        <div className="space-y-2 text-lg">
          {SORTS.map((s) => (
            <button
              key={s.key}
              className={[
                'w-full border p-0 rounded-md transition-colors',
                mode === 'brand' ? 'border-[var(--section-bg)]' : 'border-[var(--section-fg)]',
                (optimisticParams.sort ?? 'alpha') === s.key
                  ? activeSortButtonClass
                  : mode === 'brand'
                    ? 'text-[var(--section-bg)] hover:bg-[var(--section-bg)] hover:text-[var(--section-fg)]'
                    : 'text-[var(--section-fg)] hover:bg-[var(--section-fg)] hover:text-[var(--section-bg)]',
              ].join(' ')}
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
        <div className={`text-center uppercase tracking-tight text-xl mb-2 ${headingClass}`}>
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
                className={[
                  'px-1 py-0 cursor-pointer transition-colors uppercase flex items-center justify-center gap-x-2',
                  isActive
                    ? 'text-white bg-[var(--panel-fg)]'
                    : 'bg-[var(--panel-bg)] text-[var(--panel-fg)]',
                ].join(' ')}
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
        <div
          className={`text-center uppercase tracking-tight text-xl mb-2 flex items-center justify-center gap-1 ${headingClass}`}
        >
          <span>Tags</span>{' '}
          <button
            onClick={shuffleTags}
            className={`${headingClass} hover:opacity-70 transition-opacity`}
            title="Shuffle tags"
            type="button"
          >
            <IoIosShuffle className="rounded-lg h-6 w-6 cursor-pointer" />
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
          className={[
            'w-full py-2 px-4 rounded-md hover:opacity-90 transition-opacity cursor-pointer',
            activeSortButtonClass,
          ].join(' ')}
          type="button"
        >
          Clear All Filters
        </button>
      )}
    </div>
  )
}
