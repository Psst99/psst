import { WorkshopRegistrationForm } from '@/components/workshops/WorkshopRegistrationForm'
import { sanityFetch } from '@/sanity/lib/live'
import { nextWorkshopQuery } from '@/sanity/lib/queries'
import CmsContent from '@/components/CmsContent'
import Loading from './loading'

export default async function WorkshopRegisterPage() {
  const { data: workshop } = await sanityFetch({ query: nextWorkshopQuery })

  if (!workshop) {
    return (
      <div className='p-8 text-center text-lg'>
        No upcoming workshops to register for.
      </div>
    )
  }

  return (
    <>
      {/* <Loading /> */}
      <div className='p-6 text-[#f50806] md:mx-16'>
        <h1 className='text-3xl md:text-4xl mb-6 text-center capitalize'>
          {workshop.title}
        </h1>
        <CmsContent value={workshop.description} color='#f50806' />
        <div className='mt-8'>
          <WorkshopRegistrationForm
            workshopId={workshop._id}
            workshopTitle={workshop.title}
          />
        </div>
      </div>
    </>
  )
}
