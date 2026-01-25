import {eventsPageQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import CmsContent from '@/components/CmsContent'
import EventsGrid from '@/components/events/EventsGrid'

export default async function EventsContentAsync() {
  const {data: page} = await sanityFetch({query: eventsPageQuery})
  const {settings, events} = page

  console.log('Events Page Data:', page)

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
    <div className="p-6 text-[#4e4e4e] md:mx-16">
      {/* <h1 className="text-3xl md:text-4xl mb-6 text-center mt-16 md:mt-0">{settings?.title}</h1> */}

      <div className="mx-4 xl:max-w-[65vw] xl:mx-auto">
        <CmsContent value={settings?.description} section="events" />
      </div>

      <EventsGrid events={items} />
    </div>
  )
}
