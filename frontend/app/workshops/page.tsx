import WorkshopsContentAsync from '@/components/workshops/WorkshopsContentAsync'
import {buildPageMetadata} from '@/lib/seo'
import {sanityFetch} from '@/sanity/lib/live'
import {pageSettingsSeoQuery} from '@/sanity/lib/queries'

export async function generateMetadata() {
  const {data: settings} = await sanityFetch({
    query: pageSettingsSeoQuery,
    params: {id: 'workshops-pageSettings'},
    stega: false,
  })

  return buildPageMetadata({
    title: settings?.title || 'Workshops',
    description: settings?.description,
    seo: settings?.seo,
    path: '/workshops',
  })
}

export default function WorkshopsPage() {
  return (
    <main>
      <WorkshopsContentAsync />
    </main>
  )
}
