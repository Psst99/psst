import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {workshopBySlugQuery} from '@/sanity/lib/queries'
import WorkshopModal from '@/components/WorkshopModal'

const RESERVED_SLUGS = new Set(['register', 'success'])

export default async function ModalWorkshopRoute({params}: {params: Promise<{slug: string}>}) {
  const slug = (await params).slug

  // if (RESERVED_SLUGS.has(slug)) {
  //   return null
  // }

  if (!slug) {
    // redirect to /register
    return null
  }

  try {
    const {data: workshop} = await sanityFetch({
      query: workshopBySlugQuery,
      params: {slug},
    })

    if (!workshop) return null

    // Calculate isUpcoming (same logic as the direct route)
    const isUpcoming = workshop.dates?.some((date: string) => new Date(date) >= new Date()) || false

    return <WorkshopModal workshop={workshop} isUpcoming={isUpcoming} />
  } catch (error) {
    console.error('Error fetching workshop:', error)
    return notFound()
  }
}
