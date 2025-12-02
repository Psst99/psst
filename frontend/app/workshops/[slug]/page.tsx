import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {workshopBySlugQuery} from '@/sanity/lib/queries'
import WorkshopModal from '@/components/WorkshopModal'

export default async function WorkshopPage({params}: {params: Promise<{slug: string}>}) {
  const slug = (await params).slug

  try {
    const {data: workshop} = await sanityFetch({
      query: workshopBySlugQuery,
      params: {slug},
    })

    if (!workshop) return notFound()

    // Check if workshop is upcoming (any date in the future)
    const isUpcoming = workshop.dates?.some((date: string) => new Date(date) >= new Date()) || false

    console.log(workshop, 'workshop data', isUpcoming)
    return <WorkshopModal workshop={workshop} isUpcoming={isUpcoming} />
  } catch (error) {
    console.error('Error fetching workshop:', error)
    return notFound()
  }
}
