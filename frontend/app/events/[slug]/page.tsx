import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {eventBySlugQuery} from '@/sanity/lib/queries'
import EventModal from '@/components/EventModal'
import {buildPageMetadata} from '@/lib/seo'

export async function generateMetadata({params}: {params: Promise<{slug: string}>}) {
  const slug = (await params).slug
  const {data: event} = await sanityFetch({
    query: eventBySlugQuery,
    params: {slug},
    stega: false,
  })

  return buildPageMetadata({
    title: event?.title,
    description: event?.description,
    image: event?.image,
    path: `/events/${slug}`,
  })
}

export default async function EventPage({params}: {params: Promise<{slug: string}>}) {
  const slug = (await params).slug

  try {
    const {data: event} = await sanityFetch({
      query: eventBySlugQuery,
      params: {slug},
    })

    if (!event) return notFound()

    return <EventModal event={event} />
  } catch (error) {
    console.error('Error fetching workshop:', error)
    return notFound()
  }
}
