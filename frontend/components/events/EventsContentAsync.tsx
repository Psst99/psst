import { eventsPageQuery } from '@/sanity/lib/queries'
import { sanityFetch } from '@/sanity/lib/live'
import CmsContent from '@/components/CmsContent'
import EventsGrid from '@/components/events/EventsGrid'

export default async function EventsContentAsync() {
  const { data: page } = await sanityFetch({ query: eventsPageQuery })

  const { settings, events } = page

  const items =
    events?.map((event: any) => ({
      title: event.title,
      date: event.date ? new Date(event.date).toLocaleDateString() : undefined,
      dateObj: event.date ? new Date(event.date) : null,
      tags: event.tags || [],
    })) || []

  return (
    <div className='p-6 text-[#4e4e4e] md:mx-16'>
      <h1 className='text-3xl md:text-4xl mb-6 text-center mt-16 md:mt-0'>
        {settings?.title}
      </h1>

      <CmsContent value={settings?.description} color='#4E4E4E' />

      <EventsGrid events={items} />
    </div>
  )
}
