import SectionNavigation from '@/components/SectionNavigation'
import CmsContent from '@/components/CmsContent'
import {homepageQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import ThemeToggleButton from '@/components/ThemeToggleButton'

export default async function Page() {
  const {data: homepage} = await sanityFetch({query: homepageQuery})

  return (
    <>
      <main className="h-[100svh] overflow-hidden">
        <div className="fixed inset-0 flex items-center justify-center">
          <video
            src="/assets/hp-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </main>

      {/* Fixed navigation at the bottom - only visible on desktop */}
      <div className="hidden min-[83rem]:block" data-view-transition="main-nav">
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <SectionNavigation currentSection="home" position="bottom" />
        </div>
      </div>
    </>
  )
}
