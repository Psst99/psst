import { Suspense } from 'react'
import Link from 'next/link'

import { AllPosts } from '@/components/Posts'
import GetStartedCode from '@/components/GetStartedCode'
import SectionNavigation from '@/components/section-navigation'
import MobileHeader from '@/components/mobile-header'

export default async function Page() {
  return (
    <>
      <main className='h-[calc(100svh-10vh)] flex flex-col'>
        {/* Main content */}
        <div className='flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto pb-[56px]'>
          {/* Dark container with cyan text */}
          <div className='bg-[#4E4E4E] text-[#00FFDD] p-4 sm:p-5 md:max-w-[60vw] mb-6 rounded-lg'>
            <p className='text-xl md:text-3xl leading-tight md:leading-relaxed'>
              Psst Mlle is an intersectional feminist platform standing for more
              inclusion and representation in nightlife and music. We aim to
              create tools to support MaGe* artists and cultural workers, while
              paying great attention to racial and economical discriminations.
              With our events, we&apos;re questioning the codes of nightlife and
              deconstructing the dance floor. Besides, we try to tackle
              discrimination at its roots with our workshops, conversations and
              more.
            </p>
          </div>

          {/* Green container with founding info */}
          <div className='bg-[#07F25B] text-[#1D53FF] p-4 sm:p-5 md:max-w-[60vw] rounded-lg'>
            <p className='text-base leading-tight sm:text-xl md:leading-relaxed'>
              Founded in 2018 by Souria Cheurfi, the platform is carried by a
              collective whose members have evolved and will keep evolving. The
              collective&apos;s current members are Andrea Nivière, Daya Hallé,
              Katia Lecomte, Lola Lourdes, Manal Benmalek, Mika Oki, Soumaya
              Abouda, Souria Cheurfi, Yasmina Tayoub and Zoé Merchez. But Psst
              Mlle is a open and moving community - everyone who shares our
              values can join and contribute.
            </p>
          </div>
        </div>

        {/* Fixed navigation at the bottom - only visible on desktop */}
        <div className='hidden md:block'>
          <div className='fixed bottom-0 left-0 right-0 z-50'>
            <SectionNavigation currentSection='home' position='bottom' />
          </div>
        </div>

        <MobileHeader />
      </main>
      {/* <div className='border-t border-gray-10'>
        <div className='container'>
          <aside className='py-12 sm:py-20'>
            <Suspense>{await AllPosts()}</Suspense>
        </aside>
        </div>
      </div> */}
    </>
  )
}
