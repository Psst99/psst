import {databaseGuidelinesQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import CmsContent from '../CmsContent'

export default async function GuidelinesContentAsync() {
  const {data: guidelines} = await sanityFetch({
    query: databaseGuidelinesQuery,
  })

  return (
    <div className="w-full">
      <div className="columns-1 xl:columns-2 gap-20 text-base leading-tight md:text-xl">
        <CmsContent value={guidelines?.content} />
      </div>
    </div>
  )
}
