import ArchiveContentAsync from '@/components/archive/ArchiveContentAsync'
import {buildPageMetadata} from '@/lib/seo'
import {sanityFetch} from '@/sanity/lib/live'
import {pageSettingsSeoQuery} from '@/sanity/lib/queries'
import Loading from './loading'

export async function generateMetadata() {
  const {data: settings} = await sanityFetch({
    query: pageSettingsSeoQuery,
    params: {id: 'archive-pageSettings'},
    stega: false,
  })

  return buildPageMetadata({
    title: settings?.title || 'Archive',
    description: settings?.description,
    seo: settings?.seo,
    path: '/archive',
  })
}

export default function ArchivePage() {
  return (
    <>
      {/* <Loading /> */}
      <main>
        <ArchiveContentAsync />
      </main>
    </>
  )
}
