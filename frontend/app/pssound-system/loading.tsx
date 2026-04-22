import ContentPageSkeleton from '@/components/loading/ContentPageSkeleton'
import {sanityFetch} from '@/sanity/lib/live'
import {pssoundFirstSectionQuery} from '@/sanity/lib/queries'

export default async function Loading() {
  const {data} = await sanityFetch({query: pssoundFirstSectionQuery})
  const layout = data?.layout === 'guidelines' ? 'columns' : 'default'

  return (
    <div className="p-6 min-[69.375rem]:px-20 min-[69.375rem]:pb-[calc(var(--home-nav-h)+4rem)]">
      <ContentPageSkeleton layout={layout} tone="section" />
    </div>
  )
}
