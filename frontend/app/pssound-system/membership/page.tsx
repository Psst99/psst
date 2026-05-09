import CmsContent from '@/components/CmsContent'
import {buildPageMetadata} from '@/lib/seo'
import PssoundMembershipForm from '@/components/pssound-system/PssoundMembershipForm'
import {sanityFetch} from '@/sanity/lib/live'
import {membershipPageQuery} from '@/sanity/lib/queries'
import Loading from './loading'

export async function generateMetadata() {
  const {data: page} = await sanityFetch({
    query: membershipPageQuery,
    stega: false,
  })

  return buildPageMetadata({
    title: page?.title || 'PSƧOUND Membership',
    description: page?.description,
    seo: page?.seo,
    path: '/pssound-system/membership',
  })
}

export default async function MembershipPage() {
  const {data: page} = await sanityFetch({query: membershipPageQuery})

  return (
    <>
      {/* <Loading /> */}
      <div className="p-6 text-[color:var(--section-accent)] md:mx-16">
        <h1 className="text-3xl md:text-4xl mb-6 text-center capitalize">{page.title}</h1>
        <CmsContent value={page.description} />
        <div className="mt-8">
          <PssoundMembershipForm />
        </div>
      </div>
    </>
  )
}
