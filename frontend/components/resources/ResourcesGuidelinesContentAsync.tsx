import { resourcesGuidelinesQuery } from '@/sanity/lib/queries'
import { sanityFetch } from '@/sanity/lib/live'
import CmsContent from '../CmsContent'

export default async function ResourcesGuidelinesContentAsync() {
  const { data: guidelines } = await sanityFetch({
    query: resourcesGuidelinesQuery,
  })

  return (
    <div className='w-full'>
      <div className='columns-1 xl:columns-2 gap-20 text-base leading-tight md:text-xl'>
        <CmsContent value={guidelines?.content} section='resources' />
      </div>
    </div>
  )
}
