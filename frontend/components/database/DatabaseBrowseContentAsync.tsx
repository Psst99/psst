// import { getDatabaseBrowseQuery } from '@/sanity/lib/queries'
// import { sanityFetch } from '@/sanity/lib/live'
// import { X } from '@/components/icons'
// import CustomLink from '../custom-link'
// import TagFilters from './TagFilters'
// import { SearchBox } from './SearchBox'
// import SortFilters from './SortFilters'
// import CategoryFilters from './CategoryFilters'

// export default async function DatabaseBrowseContentAsync({
//   searchParams = {},
// }: {
//   searchParams?: {
//     tags?: string
//     mode?: 'any' | 'all'
//     search?: string
//     sort?: 'alpha' | 'chrono' | 'random'
//     category?: string
//   }
// }) {
//   const tagSlugs = (searchParams.tags ?? '')
//     .split(',')
//     .map((s) => s.trim())
//     .filter(Boolean)
//   const search = searchParams.search ?? ''
//   const sort = searchParams.sort ?? 'alpha'
//   const category = searchParams.category ?? ''

//   const categorySlugs = (category ?? '')
//     .split(',')
//     .map((s) => s.trim())
//     .filter(Boolean)

//   // Generate the appropriate order clause based on sort parameter
//   const getOrderClause = (sortType: string) => {
//     switch (sortType) {
//       case 'alpha':
//         return '| order(artistName asc)'
//       case 'chrono':
//         return '| order(_createdAt desc)'
//       case 'random':
//         return '| order(_id) [0...100] | order(string::split(string(_id), "-")[4] asc)'
//       default:
//         return '| order(artistName asc)'
//     }
//   }

//   const { data } = await sanityFetch({
//     query: getDatabaseBrowseQuery(getOrderClause(sort)),
//     params: {
//       tagSlugs,
//       mode: searchParams.mode ?? 'any',
//       search,
//       categorySlugs,
//     },
//   })

//   const { artists, categories, tags } = data

//   return (
//     <div className='p-4 pt-0 w-full md:max-w-[85vw] mx-auto'>
//       <div className='flex flex-col md:flex-row gap-4'>
//         {/* Left Sidebar */}
//         <div className='w-full md:w-80 space-y-3'>
//           {/* Search */}
//           <div className='md:hidden'>
//             <SearchBox search={search} />
//           </div>

//           {/* Desktop Search */}
//           <div className='hidden md:block'>
//             <SearchBox search={search} />
//           </div>

//           {/* Sort - Now using the SortFilters component */}
//           <div className='hidden md:block'>
//             <SortFilters sort={sort} />
//           </div>

//           {/* Categories */}
//           <div className='bg-white py-1 pb-3 px-6 rounded-md hidden md:block'>
//             <div className='text-center text-[#6600ff] uppercase tracking-tight md:text-xl mb-2'>
//               Categories
//             </div>
//             <CategoryFilters categories={categories} category={category} />
//             {/* <div className='flex flex-wrap gap-1.5 font-mono text-lg uppercase font-thin leading-tight'>
//               {categories.map((cat: any) => {
//                 const isActive = category === cat.slug
//                 return (
//                   <CategoryFilter
//                     key={cat._id}
//                     category={cat}
//                     isActive={isActive}
//                   />
//                 )
//               })}
//             </div> */}
//           </div>

//           {/* Tags */}
//           <div className='bg-white py-1 pb-3 px-6 rounded-md max-h-[40vh] overflow-y-auto no-scrollbar'>
//             <div className='text-center text-[#6600ff] uppercase tracking-tight md:text-xl mb-2'>
//               Tags
//             </div>
//             <TagFilters tags={tags} />
//           </div>
//         </div>

//         {/* Artist List */}
//         <div className='flex-1 space-y-3 mt-4 md:mt-0'>
//           {/* Results count */}
//           <div className='text-[#6600ff] text-sm'>
//             {artists.length} artist{artists.length !== 1 ? 's' : ''} found
//           </div>

//           {artists.length === 0 ? (
//             <div className='bg-white p-8 rounded-lg text-center text-gray-500'>
//               No artists found matching your criteria.
//             </div>
//           ) : (
//             artists.map((artist: any) => (
//               <CustomLink
//                 key={artist._id}
//                 href={`/database/${artist.slug?.current}`}
//                 className='block w-full'
//               >
//                 <div className='bg-white p-4 rounded-lg hover:shadow-md transition-shadow'>
//                   <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
//                     <h2 className='text-[#6600ff] text-4xl md:text-3xl'>
//                       {artist.artistName}
//                     </h2>
//                     <div className='flex flex-wrap gap-2'>
//                       {artist.categories?.map((cat: any) => (
//                         <span
//                           key={cat._id}
//                           className='bg-[#6600ff] text-white px-1 py-0 text-lg uppercase font-thin font-mono flex items-center gap-1.25 leading-tight'
//                         >
//                           {cat.title}
//                         </span>
//                       ))}
//                     </div>
//                     <div className='flex flex-wrap gap-1 mt-4'>
//                       {artist.tags?.map((tag: any, idx: number) => (
//                         <span
//                           key={tag._key || `fallback-${idx}`}
//                           className='inline-flex'
//                         >
//                           <span
//                             style={
//                               {
//                                 '--tag-bg': getComputedBg(tag.title),
//                                 '--tag-fg': getComputedFg(tag.title),
//                                 '--tag-bd': getComputedBg(tag.title),
//                               } as React.CSSProperties
//                             }
//                             className='inline-flex items-center rounded-full border px-2 py-0.5 text-xs bg-[var(--tag-bg)] text-[var(--tag-fg)] border-[var(--tag-bd)]'
//                           >
//                             {tag.title}
//                           </span>
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </CustomLink>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// // Category Filter Component (you'll need to create this)
// function CategoryFilter({
//   category,
//   isActive,
// }: {
//   category: any
//   isActive: boolean
// }) {
//   // Implementation similar to your existing tag filters
//   return (
//     <div
//       className={`px-1 py-0 cursor-pointer ${
//         isActive ? 'bg-[#6600ff] text-white' : 'bg-gray-200 text-[#6600ff]'
//       }`}
//     >
//       {category.title}
//     </div>
//   )
// }

// // Keep your existing helper functions
// function getComputedBg(label: string) {
//   const len = label.toLowerCase().replace(/[^a-z0-9]/g, '').length || 1
//   const hue = (len * 137.508) % 360
//   return `hsl(${hue} 90% 60%)`
// }

// function getComputedFg(label: string) {
//   const len = label.toLowerCase().replace(/[^a-z0-9]/g, '').length || 1
//   const hue = (len * 137.508 + 180) % 360
//   return `hsl(${hue} 90% 30%)`
// }

import { getDatabaseBrowseQuery } from '@/sanity/lib/queries'
import { sanityFetch } from '@/sanity/lib/live'
import { X } from '@/components/icons'
import CustomLink from '../custom-link'
import OptimisticFilters from './OptimisticFilters'

// Create a type for your search params
export type DatabaseSearchParams = {
  tags?: string
  mode?: 'any' | 'all'
  search?: string
  sort?: 'alpha' | 'chrono' | 'random'
  category?: string
}

export default async function DatabaseBrowseContentAsync({
  searchParams = {},
}: {
  searchParams?: DatabaseSearchParams
}) {
  const tagSlugs = (searchParams.tags ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const search = searchParams.search ?? ''
  const sort = searchParams.sort ?? 'alpha'
  const category = searchParams.category ?? ''

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
        return '| order(_id) [0...100] | order(string::split(string(_id), "-")[4] asc)'
      default:
        return '| order(artistName asc)'
    }
  }

  const { data } = await sanityFetch({
    query: getDatabaseBrowseQuery(getOrderClause(sort)),
    params: {
      tagSlugs,
      mode: searchParams.mode ?? 'any',
      search,
      categorySlugs,
    },
  })

  const { artists, categories, tags } = data

  // Pass the current search params to the client component
  const currentSearchParams = {
    tags: searchParams.tags,
    mode: searchParams.mode,
    search: searchParams.search,
    sort: searchParams.sort,
    category: searchParams.category,
  }

  return (
    <div className='p-4 pt-0 w-full md:max-w-[85vw] mx-auto group'>
      <div className='flex flex-col md:flex-row gap-4'>
        {/* Left Sidebar - Now using the optimistic client component */}
        <OptimisticFilters
          categories={categories}
          tags={tags}
          initialParams={currentSearchParams}
        />

        {/* Artist List - This will show pending state during transitions */}
        <div className='flex-1 space-y-3 mt-4 md:mt-0 group-has-[[data-pending]]:opacity-50 group-has-[[data-pending]]:transition-opacity'>
          {/* Results count */}
          {/* <div className='text-[#6600ff] text-sm'>
            {artists.length} artist{artists.length !== 1 ? 's' : ''} found
          </div> */}

          {artists.length === 0 ? (
            <div className='bg-white p-8 rounded-lg text-center text-gray-500'>
              No artists found matching your criteria.
            </div>
          ) : (
            artists.map((artist: any) => (
              <CustomLink
                key={artist._id}
                href={`/database/${artist.slug?.current}`}
                className='block w-full'
              >
                <div className='bg-white p-4 rounded-lg hover:shadow-md transition-shadow'>
                  <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                    <h2 className='text-[#6600ff] text-4xl md:text-3xl w-1/3'>
                      {artist.artistName}
                    </h2>
                    <div className='flex gap-2 w-1/3'>
                      {artist.categories?.map((cat: any) => (
                        <span
                          key={cat._id}
                          className='bg-[#6600ff] text-white px-1 py-0 text-lg uppercase font-thin font-mono flex items-center gap-1.25 leading-tight'
                        >
                          {cat.title}
                        </span>
                      ))}
                    </div>
                    <div className='flex flex-wrap gap-1 mt-4 w-1/3'>
                      {artist.tags?.map((tag: any, idx: number) => (
                        <span
                          key={tag._key || `fallback-${idx}`}
                          className='inline-flex'
                        >
                          <span
                            style={
                              {
                                '--tag-bg': getComputedBg(tag.title),
                                '--tag-fg': getComputedFg(tag.title),
                                '--tag-bd': getComputedBg(tag.title),
                              } as React.CSSProperties
                            }
                            className='inline-flex items-center rounded-full border px-2 py-0.5 text-xs bg-[var(--tag-bg)] text-[var(--tag-fg)] border-[var(--tag-bd)]'
                          >
                            {tag.title}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CustomLink>
            ))
          )}
        </div>
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
