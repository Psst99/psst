import ResourcesGuidelinesContentAsync from '@/components/resources/ResourcesGuidelinesContentAsync'
import {buildPageMetadata} from '@/lib/seo'
import {sanityFetch} from '@/sanity/lib/live'
import {resourcesPageSeoQuery} from '@/sanity/lib/queries'
import Loading from './loading'

export async function generateMetadata() {
  const {data} = await sanityFetch({
    query: resourcesPageSeoQuery,
    stega: false,
  })
  const settings = data?.settings

  return buildPageMetadata({
    title: settings?.title || 'Resources',
    description: settings?.description || data?.guidelines?.content,
    seo: settings?.seo,
    path: '/resources',
  })
}

export default function ResourcesPage() {
  return (
    <>
      {/* <Loading /> */}
      <div className="p-6 min-[69.375rem]:px-20 text-[color:var(--section-accent)]">
        <ResourcesGuidelinesContentAsync />
      </div>
    </>
  )
}
