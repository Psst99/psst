import ContentPageSkeleton from '@/components/loading/ContentPageSkeleton'
import {sanityFetch} from '@/sanity/lib/live'
import {pssoundManifestoLayoutQuery} from '@/sanity/lib/queries'

export default async function Loading() {
  const {data} = await sanityFetch({query: pssoundManifestoLayoutQuery})
  const layout = data?.settings?.layout === 'columns' ? 'columns' : 'default'

  return (
    <div className="p-6 md:px-20">
      <ContentPageSkeleton layout={layout} tone="section" />
    </div>
  )
}
