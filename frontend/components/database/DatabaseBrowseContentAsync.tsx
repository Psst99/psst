import {getDatabaseBrowseQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import {X} from '@/components/icons'
import CustomLink from '../CustomLink'
import OptimisticFilters from './OptimisticFilters'
import InfiniteArtistsList from './InfiniteArtistsList'
import MobileFiltersModal from './MobileFiltersModal'
import {RANDOM_SORT_FETCH_LIMIT, seededShuffleById} from '@/lib/seededShuffle'

export type DatabaseSearchParams = {
  tags?: string
  mode?: 'any' | 'all'
  search?: string
  sort?: 'alpha' | 'chrono' | 'random'
  category?: string
  seed?: string
}

export default async function DatabaseBrowseContentAsync({
  searchParams = {},
}: {
  searchParams?: DatabaseSearchParams
}) {
  const sp = await searchParams

  const tagSlugs = (sp.tags ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const search = sp.search ?? ''
  const sort = sp.sort ?? 'alpha'
  const category = sp.category ?? ''
  const seed = sp.seed ?? ''

  const categorySlugs = (category ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  // Generate the appropriate order clause based on sort parameter
  const getOrderClause = (sortType: string) => {
    switch (sortType) {
      case 'alpha':
        return '| order(artistName asc)'
      case 'chrono':
        return '| order(_createdAt desc)'
      case 'random':
        return '| order(artistName asc)'
      default:
        return '| order(artistName asc)'
    }
  }

  const queryLimit = sort === 'random' ? RANDOM_SORT_FETCH_LIMIT : 20

  const {data} = await sanityFetch({
    query: getDatabaseBrowseQuery(getOrderClause(sort), 0, queryLimit),
    params: {
      tagSlugs,
      mode: sp.mode ?? 'any',
      search,
      categorySlugs,
    },
  })

  const {artists, categories, tags, totalCount} = data
  const orderedArtists = sort === 'random' ? seededShuffleById(artists, seed).slice(0, 20) : artists

  // Pass the current search params to the client component
  const currentSearchParams = {
    tags: sp.tags,
    mode: sp.mode,
    search: sp.search,
    sort: sp.sort,
    category: sp.category,
    seed: sp.seed,
  }

  return (
    <div className="p-6 lg:px-16 pt-0 w-full mx-auto group">
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        {/* Desktop sidebar */}
        <div className="hidden md:block md:sticky md:top-0 md:self-start md:flex-none">
          <OptimisticFilters
            categories={categories}
            tags={tags}
            initialParams={currentSearchParams}
            totalCount={totalCount}
          />
        </div>

        {/* Mobile floating modal trigger */}
        <MobileFiltersModal
          categories={categories}
          tags={tags}
          initialParams={currentSearchParams}
          totalCount={totalCount}
        />
        <InfiniteArtistsList
          initialArtists={orderedArtists}
          searchParams={{
            tagSlugs,
            categorySlugs,
            mode: sp.mode ?? 'any',
            search,
            sort,
            seed,
            page: 1,
            pageSize: 20,
          }}
        />
      </div>
    </div>
  )
}

// Keep your existing helper functions
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
