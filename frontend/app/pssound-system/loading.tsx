import ContentPageSkeleton from '@/components/loading/ContentPageSkeleton'
import {sanityFetch} from '@/sanity/lib/live'
import {pssoundFirstSectionQuery} from '@/sanity/lib/queries'

export default async function Loading() {
  const {data} = await sanityFetch({query: pssoundFirstSectionQuery})
  const layout = data?.layout === 'guidelines' ? 'columns' : 'default'

  return (
    <div className="p-6 min-[83rem]:px-20">
      <ContentPageSkeleton layout={layout} tone="section" />
    </div>
  )
}
