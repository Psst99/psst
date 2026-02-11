import {sanityFetch} from '@/sanity/lib/live'
import ResourcesOptimisticFilters from './ResourcesOptimisticFilters'
import InfiniteResourcesList from './InfiniteResourcesList'
import ResourcesMobileFiltersModal from './ResourcesMobileFiltersModal'

export type ResourcesSearchParams = {
  tags?: string
  mode?: 'any' | 'all'
  search?: string
  sort?: 'alpha' | 'chrono' | 'random'
  category?: string
}

export default async function ResourcesBrowseContentAsync({
  searchParams = {},
}: {
  searchParams?: ResourcesSearchParams
}) {
  const sp = await searchParams

  const tagSlugs = (sp.tags ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const search = sp.search ?? ''
  const sort = sp.sort ?? 'alpha'
  const category = sp.category ?? ''

  const categorySlugs = (category ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)


  // Generate the appropriate order clause based on sort parameter
  let orderClause = '| order(title asc)'
  if (sort === 'chrono') {
    orderClause = '| order(publishedAt desc)'
  } else if (sort === 'random') {
    orderClause = '| order(_id) [0...100] | order(string::split(string(_id), "-")[4] asc)'
  }

  // Build conditions for the query - FIXED TAG FILTERING
  const conditions: string[] = []

  if (tagSlugs.length > 0) {
    const mode = sp.mode ?? 'any'
    if (mode === 'all') {
      conditions.push(
        `count((tags[]->slug.current)[@ in [${tagSlugs.map((slug) => `"${slug}"`).join(',')}]]) == ${tagSlugs.length}`,
      )
    } else {
      conditions.push(
        `count((tags[]->slug.current)[@ in [${tagSlugs.map((slug) => `"${slug}"`).join(',')}]]) > 0`,
      )
    }
  }


  if (categorySlugs.length > 0) {
    conditions.push(`category in [${categorySlugs.map((slug) => `"${slug}"`).join(',')}]`)
  }

  if (search) {
    conditions.push(`(title match "*${search}*" || description match "*${search}*")`)
  }

  // Construct the full query - FIXED
  const query = `{
    "resources": *[_type == "resource" && approved == true${conditions.length > 0 ? ` && ${conditions.join(' && ')}` : ''}] ${orderClause} [0...20] {
      _id,
      title,
      description,
      url,
      fileUrl,
      category,
      image,
      publishedAt,
      "tags": tags[]-> {
        _id,
        title,
        "slug": slug.current
      }
    },
    "tags": *[_type == "resourceTag"] | order(title asc) {
      _id,
      title,
      "slug": slug.current
    },
    "categories": [
      {"_id": "text", "title": "TEXT", "slug": {"current": "text"}},
      {"_id": "video", "title": "VIDEO", "slug": {"current": "video"}},
      {"_id": "sound", "title": "SOUND", "slug": {"current": "sound"}},
      {"_id": "website", "title": "WEBSITE", "slug": {"current": "website"}}
    ],
    "totalCount": count(*[_type == "resource" && approved == true${conditions.length > 0 ? ` && ${conditions.join(' && ')}` : ''}])
  }`

  const {data} = await sanityFetch({query})

  const {resources, tags, categories, totalCount} = data
  const categoriesWithSlug = categories.map((cat: any) => ({
    ...cat,
    slug: typeof cat.slug === 'string' ? cat.slug : cat.slug?.current,
  }))
  const tagsWithSlug = tags.map((tag: any) => ({
    ...tag,
    slug: typeof tag.slug === 'string' ? tag.slug : tag.slug?.current,
  }))

  // Pass the current search params to the client component
  const currentSearchParams = {
    tags: sp.tags,
    mode: sp.mode,
    search: sp.search,
    sort: sp.sort,
    category: sp.category,
  }

  return (
    <div className="p-4 lg:px-16 pt-0 w-full mx-auto group">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <ResourcesOptimisticFilters
            categories={categoriesWithSlug}
            tags={tagsWithSlug}
            initialParams={currentSearchParams}
            totalCount={totalCount}
          />
        </div>

        {/* Mobile floating modal trigger */}
        <ResourcesMobileFiltersModal
          categories={categoriesWithSlug}
          tags={tagsWithSlug}
          initialParams={currentSearchParams}
          totalCount={totalCount}
        />

        <InfiniteResourcesList
          initialResources={resources}
          searchParams={{
            tagSlugs,
            categorySlugs,
            mode: sp.mode ?? 'any',
            search,
            sort,
            page: 1,
            pageSize: 20,
          }}
        />
      </div>
    </div>
  )
}
