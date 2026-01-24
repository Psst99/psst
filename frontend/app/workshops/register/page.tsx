import {WorkshopRegistrationForm} from '@/components/workshops/WorkshopRegistrationForm'
import {sanityFetch} from '@/sanity/lib/live'
import {upcomingWorkshopsQuery} from '@/sanity/lib/queries'

export default async function WorkshopRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{workshop?: string}>
}) {
  const params = await searchParams
  const workshopIdentifier = params.workshop

  const {data: upcoming = []} = await sanityFetch({query: upcomingWorkshopsQuery})

  if (!upcoming.length) {
    return (
      <main className="mx-4 xl:max-w-[65vw] xl:mx-auto text-[#F50806] pt-16">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl mb-6 text-center tracking-tight">
            Workshop Registration
          </h1>
          <p className="text-base leading-tight min-[83rem]:text-xl">
            There's no upcoming workshops at the moment, keep an eye on this page and our socials
            for future opportunities.
          </p>
        </div>
      </main>
    )
  }

  const workshops = upcoming.map((workshop: any) => ({
    ...workshop,
    availableSpots: Math.max(0, (workshop.totalSpots || 0) - (workshop.registrationsCount || 0)),
  }))

  // Check if ALL workshops are full
  const allWorkshopsFull = workshops.every((w: any) => w.availableSpots <= 0)

  if (allWorkshopsFull) {
    return (
      <main className="mx-4 xl:max-w-[65vw] xl:mx-auto text-[#F50806] pt-16">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl mb-6 text-center tracking-tight">
            Workshop Registration
          </h1>
          <p className="text-base leading-tight min-[83rem]:text-xl">
            All upcoming workshops are currently full. Please check back later for new workshop
            announcements.
          </p>
        </div>
      </main>
    )
  }

  // Find the initial workshop (from URL param or first available)
  let initial = workshops.find(
    (workshop: any) =>
      (workshop.slug === workshopIdentifier || workshop._id === workshopIdentifier) &&
      workshop.availableSpots > 0,
  )

  // If the requested workshop is full or not found, use the first available one
  if (!initial) {
    initial = workshops.find((w: any) => w.availableSpots > 0) || workshops[0]
  }

  return (
    <main className="mx-4 xl:max-w-[65vw] xl:mx-auto text-[#F50806]">
      <WorkshopRegistrationForm workshops={workshops} initialWorkshopId={initial._id} />
    </main>
  )
}
