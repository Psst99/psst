import SectionNavigation from '@/components/section-navigation'
import CmsContent from '@/components/CmsContent'
import { homepageQuery } from '@/sanity/lib/queries'
import { sanityFetch } from '@/sanity/lib/live'

export default async function Page() {
  const { data: homepage } = await sanityFetch({ query: homepageQuery })

  return (
    <>
      <main className='h-[calc(100svh-10vh)] flex flex-col'>
        <div className='flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto pb-[56px] md:max-w-[60vw] md:mx-auto'>
          {homepage?.content && (
            <CmsContent value={homepage?.content} section='home' />
          )}
        </div>
      </main>

      {/* Fixed navigation at the bottom - only visible on desktop */}
      <div className='hidden md:block' data-view-transition='main-nav'>
        <div className='fixed bottom-0 left-0 right-0 z-50'>
          <SectionNavigation currentSection='home' position='bottom' />
        </div>
      </div>
    </>
  )
}
