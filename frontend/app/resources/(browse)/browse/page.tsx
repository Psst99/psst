import ResourcesBrowseContentAsync from '@/components/resources/ResourcesBrowseContentAsync'
import {buildPageMetadata} from '@/lib/seo'
import {sanityFetch} from '@/sanity/lib/live'
import {resourcesPageSeoQuery} from '@/sanity/lib/queries'

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
    path: '/resources/browse',
  })
}

export default function ResourcesBrowsePage({searchParams}: {searchParams: any}) {
  return <ResourcesBrowseContentAsync searchParams={searchParams} />
}
