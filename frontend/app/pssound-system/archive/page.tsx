import PssoundArchiveContentAsync from '@/components/pssound-system/PssoundArchiveContentAsync'
import {buildPageMetadata} from '@/lib/seo'
import {sanityFetch} from '@/sanity/lib/live'
import {pageSettingsSeoQuery} from '@/sanity/lib/queries'

export async function generateMetadata() {
  const {data: settings} = await sanityFetch({
    query: pageSettingsSeoQuery,
    params: {id: 'pssound-archive-pageSettings'},
    stega: false,
  })

  return buildPageMetadata({
    title: settings?.title || 'PSƧOUND Archive',
    description: settings?.description,
    seo: settings?.seo,
    path: '/pssound-system/archive',
  })
}

export default function ArchivePage() {
  return (
    <div className="text-[color:var(--section-accent)]">
      <PssoundArchiveContentAsync />
    </div>
  )
}
