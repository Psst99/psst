import CmsContent from '@/components/CmsContent'
import {sanityFetch} from '@/sanity/lib/live'
import {pssoundFirstSectionQuery} from '@/sanity/lib/queries'
import {notFound} from 'next/navigation'

export default function PssoundSystemPage() {
  return <PssoundSystemPageAsync />
}

async function PssoundSystemPageAsync() {
  const {data} = await sanityFetch({
    query: pssoundFirstSectionQuery,
  })

  if (!data) {
    notFound()
  }

  if (data.layout === 'guidelines') {
    return (
      <div className="w-full p-6 min-[69.375rem]:px-20 min-[69.375rem]:pb-[calc(var(--home-nav-h)+4rem)] text-[color:var(--section-accent)]">
        <div className="columns-1 xl:columns-2 gap-20 text-base leading-tight md:text-xl">
          <CmsContent value={data.content} />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 min-[69.375rem]:px-20 min-[69.375rem]:pb-[calc(var(--home-nav-h)+4rem)] text-[color:var(--section-accent)]">
      <div className="w-full min-[69.375rem]:max-w-[65vw] mx-auto">
        <CmsContent value={data.content} />
      </div>
    </div>
  )
}
