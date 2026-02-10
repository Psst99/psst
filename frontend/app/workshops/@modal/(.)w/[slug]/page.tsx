import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {workshopBySlugQuery} from '@/sanity/lib/queries'
import WorkshopModal from '@/components/WorkshopModal'

export default async function ModalWorkshopRoute({params}: {params: Promise<{slug: string}>}) {
  const slug = (await params).slug

  try {
    const {data: workshop} = await sanityFetch({
      query: workshopBySlugQuery,
      params: {slug},
    })

    if (!workshop) return null

    const isUpcoming = workshop.dates?.some((date: string) => new Date(date) >= new Date()) || false

    return <WorkshopModal workshop={workshop} isUpcoming={isUpcoming} />
  } catch (error) {
    console.error('Error fetching workshop:', error)
    return notFound()
  }
}
