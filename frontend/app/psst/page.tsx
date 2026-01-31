import CmsContent from '@/components/CmsContent'
import {sanityFetch} from '@/sanity/lib/live'
import {manifestoPageQuery} from '@/sanity/lib/queries'

export default async function PsstPage() {
  const {data} = await sanityFetch({
    query: manifestoPageQuery,
  })

  if (!data) {
    return <div>No content found</div>
  }

  // Choose layout
  if (data.layout === 'guidelines') {
    return (
      <div className="w-full p-6 md:px-20">
        <div className="columns-1 xl:columns-2 gap-20 text-base leading-tight md:text-xl">
          <CmsContent value={data.content} />
        </div>
      </div>
    )
  }

  // Default layout
  return (
    <main className="mx-4 xl:max-w-[65vw] xl:mx-auto">
      <CmsContent value={data.content} />
    </main>
  )
}
