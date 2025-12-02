// import {WorkshopRegistrationForm} from '@/components/workshops/WorkshopRegistrationForm'
// import {sanityFetch} from '@/sanity/lib/live'
// import {nextWorkshopQuery, workshopBySlugQuery} from '@/sanity/lib/queries'
// import CmsContent from '@/components/CmsContent'
// import {urlForImage} from '@/sanity/lib/utils'
// import {Image} from 'next-sanity/image'

// export default async function WorkshopRegisterPage({
//   searchParams,
// }: {
//   searchParams: Promise<{workshop?: string}>
// }) {
//   // Await the searchParams (Next.js 15 requirement)
//   const params = await searchParams
//   const workshopIdentifier = params.workshop

//   let workshop
//   if (workshopIdentifier) {
//     // Fetch specific workshop by slug
//     const {data} = await sanityFetch({
//       query: workshopBySlugQuery,
//       params: {slug: workshopIdentifier},
//     })
//     workshop = data
//   } else {
//     // Default: fetch next upcoming workshop
//     const {data} = await sanityFetch({query: nextWorkshopQuery})
//     workshop = data
//   }

//   if (!workshop) {
//     return (
//       <div className="p-8 text-center text-lg text-[#F50806]">
//         No workshop found or no upcoming workshops to register for.
//       </div>
//     )
//   }

//   const {data: existingCount} = await sanityFetch({
//     query: `count(*[_type == "workshopRegistration" && workshop._ref == $workshopId && status == "approved"])`,
//     params: {workshopId: workshop._id},
//   })

//   const availableSpots = workshop.totalSpots - (existingCount || 0)

//   return (
//     <main className="mx-4 xl:max-w-[65vw] xl:mx-auto text-[#F50806]">
//       <h1 className="text-3xl md:text-4xl mb-6 text-center capitalize">{workshop.title}</h1>

//       <div className="flex flex-col md:flex-row gap-8 mb-8">
//         {workshop.coverImage?.asset?._ref && (
//           <div className="relative w-full md:w-1/2 h-64 md:h-auto">
//             <Image
//               className="rounded-lg object-cover"
//               fill={true}
//               alt={workshop.title}
//               src={
//                 urlForImage(workshop.coverImage)
//                   ?.height(1000)
//                   .width(1000)
//                   .auto('format')
//                   .url() as string
//               }
//               priority={false}
//             />
//           </div>
//         )}
//         <div className="flex-1">
//           <CmsContent value={workshop.description} section="workshops" />
//         </div>
//       </div>

//       <div className="mb-4 text-center text-lg">
//         <p>
//           Spots available: {availableSpots} / {workshop.totalSpots}
//         </p>
//         {availableSpots <= 0 && <p className="text-red-600">This workshop is full.</p>}
//       </div>

//       {availableSpots > 0 ? (
//         <div className="mt-8">
//           <WorkshopRegistrationForm workshop={workshop} />
//         </div>
//       ) : (
//         <p className="text-red-600 text-center">Registration is closed as the workshop is full.</p>
//       )}
//     </main>
//   )
// }

// import {WorkshopRegistrationForm} from '@/components/workshops/WorkshopRegistrationForm'
// import {sanityFetch} from '@/sanity/lib/live'
// import {upcomingWorkshopsQuery} from '@/sanity/lib/queries'

// export default async function WorkshopRegisterPage({
//   searchParams,
// }: {
//   searchParams: Promise<{workshop?: string}>
// }) {
//   const params = await searchParams
//   const workshopIdentifier = params.workshop

//   const {data: upcoming = []} = await sanityFetch({query: upcomingWorkshopsQuery})

//   if (!upcoming.length) {
//     return (
//       <main className="mx-4 xl:max-w-[65vw] xl:mx-auto text-[#F50806]">
//         <p className="text-center text-lg">No upcoming workshops are open for registration.</p>
//       </main>
//     )
//   }

//   const workshops = upcoming.map((workshop: any) => ({
//     ...workshop,
//     availableSpots: Math.max(0, (workshop.totalSpots || 0) - (workshop.registrationsCount || 0)),
//   }))

//   const initial =
//     workshops.find(
//       (workshop: any) =>
//         workshop.slug === workshopIdentifier || workshop._id === workshopIdentifier,
//     ) || workshops[0]

//   return (
//     <main className="mx-4 xl:max-w-[65vw] xl:mx-auto text-[#F50806]">
//       <WorkshopRegistrationForm workshops={workshops} initialWorkshopId={initial._id} />
//     </main>
//   )
// }

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
            Registration Closed
          </h1>
          <p className="text-base leading-tight min-[83rem]:text-xl">
            There are no upcoming workshops available for registration at this time. Please check
            back later or browse our past workshops.
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
            Registration Closed
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
