import type React from 'react'
import SectionNavigation from '@/components/section-navigation'
import MobileHeader from '@/components/mobile-header'

export default function PsstLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='h-screen flex flex-col overflow-hidden'>
      <div className='flex-shrink-0 hidden md:block'>
        <SectionNavigation currentSection='psst' />
      </div>

      <div className='md:hidden'>
        <MobileHeader />
      </div>

      {/* Content - takes remaining space and is scrollable */}
      <div className='flex-1 border-[#A20018] border md:border-t-0 rounded-r-2xl bg-[#dfff3d] overflow-y-auto pt-16'>
        {children}
      </div>
    </div>
  )
}
