import { databaseGuidelinesQuery } from '@/sanity/lib/queries'
import { sanityFetch } from '@/sanity/lib/live'
import CmsContent from '../CmsContent'

export default async function GuidelinesContentAsync() {
  const { data: guidelines } = await sanityFetch({
    query: databaseGuidelinesQuery,
  })

  return (
    <div className='w-full'>
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-12 text-base leading-tight md:text-xl'>
        <CmsContent value={guidelines?.content} color='#6600ff' />
      </div>
    </div>
  )
}
