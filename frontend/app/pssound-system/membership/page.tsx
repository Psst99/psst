import CmsContent from '@/components/CmsContent'
import PssoundMembershipForm from '@/components/pssound-system/PssoundMembershipForm'
import { sanityFetch } from '@/sanity/lib/live'
import { membershipPageQuery } from '@/sanity/lib/queries'

export default async function MembershipPage() {
  const { data: page } = await sanityFetch({ query: membershipPageQuery })

  return (
    <>
      <div className='p-6 text-[#07f25b] md:mx-16'>
        <h1 className='text-3xl md:text-4xl mb-6 text-center capitalize'>
          {page.title}
        </h1>
        <CmsContent value={page.description} color='#07f25b' />
        <div className='mt-8'>
          <PssoundMembershipForm />
        </div>
      </div>
    </>
  )
}
