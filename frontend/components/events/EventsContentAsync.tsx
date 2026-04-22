import {eventsPageQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import CmsContent from '@/components/CmsContent'
import EventsGrid from '@/components/events/EventsGrid'

export default async function EventsContentAsync() {
  const {data: page} = await sanityFetch({query: eventsPageQuery})
  const {settings, events} = page

  const items =
    events?.map((event: any) => {
      const now = new Date()
      const dateObj = event.date ? new Date(event.date) : null
      const isUpcoming = dateObj ? dateObj >= now : false

      return {
        _id: event._id,
        title: event.title,
        slug: event.slug?.current,
        date: event.date ? new Date(event.date).toLocaleDateString() : undefined,
        dateObj,
        isUpcoming,
        tags: event.tags || [],
      }
    }) || []

  return (
    <div className="p-6 text-[#4e4e4e] min-[69.375rem]:mx-16">
      {/* <h1 className="text-3xl md:text-4xl mb-6 text-center mt-16 md:mt-0">{settings?.title}</h1> */}

      <div className="min-[69.375rem]:max-w-[65vw] min-[69.375rem]:mx-auto">
        <CmsContent value={settings?.description} />
      </div>

      <EventsGrid events={items} />
    </div>
  )
}
