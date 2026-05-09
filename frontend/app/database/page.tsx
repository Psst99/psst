import GuidelinesContentAsync from '@/components/database/GuidelinesContentAsync'
import {buildPageMetadata} from '@/lib/seo'
import {sanityFetch} from '@/sanity/lib/live'
import {databasePageSeoQuery} from '@/sanity/lib/queries'

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
    path: '/database',
  })
}

export default function DatabasePage() {
  return (
    <div className="p-6 md:px-20 panel-fg">
      <GuidelinesContentAsync />
    </div>
  )
}
