import { notFound } from 'next/navigation'
import { sanityFetch } from '@/sanity/lib/live'
import { eventBySlugQuery } from '@/sanity/lib/queries'
import EventModal from '@/components/EventModal'

export default async function ModalEventRoute({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug

  try {
    const { data: event } = await sanityFetch({
      query: eventBySlugQuery,
      params: { slug },
    })

    if (!event) return notFound()

    return <EventModal event={event} />
  } catch (error) {
    console.error('Error fetching event:', error)
    return notFound()
  }
}
