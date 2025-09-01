import { workshopsPageQuery } from '@/sanity/lib/queries'
import { sanityFetch } from '@/sanity/lib/live'
import CmsContent from '@/components/CmsContent'
import WorkshopsGrid from '@/components/workshops/WorkshopsGrid'

export default async function WorkshopsContentAsync() {
  const { data: page } = await sanityFetch({ query: workshopsPageQuery })

  const { settings, workshops } = page

  console.log('workshops', workshops)

  const items =
    workshops?.map((workshop: any) => ({
      title: workshop.title,
      date: workshop.date
        ? new Date(workshop.date).toLocaleDateString()
        : undefined,
      dateObj: workshop.date ? new Date(workshop.date) : null,
      tags: workshop.tags || [],
    })) || []

  return (
    <div className='p-6 text-[#f50806] md:mx-16'>
      <h1 className='text-3xl md:text-4xl mb-6 text-center'>
        {settings?.title || 'Workshops'}
      </h1>

      <CmsContent value={settings?.description} color='#f50806' />

      <WorkshopsGrid workshops={items} />
    </div>
  )
}
