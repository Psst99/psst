import ContentPageSkeleton from '@/components/loading/ContentPageSkeleton'
import {sanityFetch} from '@/sanity/lib/live'
import {psstFirstSectionQuery} from '@/sanity/lib/queries'

export default async function Loading() {
  const {data} = await sanityFetch({query: psstFirstSectionQuery})
  const layout = data?.layout === 'guidelines' ? 'columns' : 'default'

  const wrapperClass = layout === 'columns' ? 'p-6 md:px-20' : 'px-6'

  return (
    <div className={wrapperClass}>
      <ContentPageSkeleton layout={layout} tone="panel" />
    </div>
  )
}
