import CmsContent from '@/components/CmsContent'
import {sanityFetch} from '@/sanity/lib/live'
import {psstSectionBySlugQuery} from '@/sanity/lib/queries'

export default async function PsstSectionPage({params}: {params: Promise<{section: string}>}) {
  const {section} = await params
  const {data} = await sanityFetch({
    query: psstSectionBySlugQuery,
    params: {slug: section},
  })

  console.log('Fetched PSST section data:', data)

  // Choose layout
  if (data.layout === 'guidelines') {
    return (
      <div className="w-full p-6 md:px-20">
        <div className="columns-1 xl:columns-2 gap-20 text-base leading-tight md:text-xl">
          <CmsContent value={data.content} section="psst" />
        </div>
      </div>
    )
  }

  // Default layout
  return (
    <main className="mx-4 xl:max-w-[65vw] xl:mx-auto">
      <CmsContent value={data.content} section="psst" />
    </main>
  )
}
