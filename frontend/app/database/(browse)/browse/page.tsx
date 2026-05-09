import DatabaseBrowseContentAsync from '@/components/database/DatabaseBrowseContentAsync'
import {buildPageMetadata} from '@/lib/seo'
import {sanityFetch} from '@/sanity/lib/live'
import {databasePageSeoQuery} from '@/sanity/lib/queries'
import Loading from './loading'

export async function generateMetadata() {
  const {data} = await sanityFetch({
    query: databasePageSeoQuery,
    stega: false,
  })
  const settings = data?.settings

  return buildPageMetadata({
    title: settings?.title || 'Database',
    description: settings?.description || data?.guidelines?.content,
    seo: settings?.seo,
    path: '/database/browse',
  })
}

export default function DatabaseBrowsePage({searchParams}: {searchParams: any}) {
  return <DatabaseBrowseContentAsync searchParams={searchParams} />
  return <Loading />
}
