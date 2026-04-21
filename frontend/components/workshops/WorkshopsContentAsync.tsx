import {workshopsPageQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import CmsContent from '@/components/CmsContent'
import WorkshopsGrid from '@/components/workshops/WorkshopsGrid'

export default async function WorkshopsContentAsync() {
  const {data: page} = await sanityFetch({query: workshopsPageQuery})
  const {settings, workshops} = page

  const items =
    workshops?.map((workshop: any) => {
      const now = new Date()
      const isUpcoming =
        workshop.dates &&
        workshop.dates.some((date: string) => {
          const dateObj = new Date(date)
          return dateObj >= now
        })

      return {
        _id: workshop._id,
        title: workshop.title,
        dates:
          workshop.dates?.map((date: string) =>
            new Date(date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }),
          ) || [],
        slug: workshop.slug?.current,
        isUpcoming,
        tags: workshop.tags || [],
      }
    }) || []

  return (
    <div className="p-6 text-[#f50806] min-[69.375rem]:mx-16">
      {/* <h1 className="text-3xl md:text-4xl mb-6 text-center">{settings?.title || 'Workshops'}</h1> */}
      <div className="min-[69.375rem]:max-w-[65vw] min-[69.375rem]:mx-auto">
        <CmsContent value={settings?.description} />
      </div>

      <WorkshopsGrid workshops={items} />
    </div>
  )
}
