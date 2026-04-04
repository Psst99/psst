import ContentPageSkeleton from '@/components/loading/ContentPageSkeleton'
import {sanityFetch} from '@/sanity/lib/live'
import {psstFirstSectionQuery} from '@/sanity/lib/queries'

export default async function Loading() {
  const {data} = await sanityFetch({query: psstFirstSectionQuery})
  const layout = data?.layout === 'guidelines' ? 'columns' : 'default'

  return <ContentPageSkeleton layout={layout} tone="panel" />
}
