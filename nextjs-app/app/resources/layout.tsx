import type React from 'react'
import SectionNavigation from '@/components/section-navigation'

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='h-screen flex flex-col overflow-hidden'>
      <div className='flex-shrink-0 hidden md:block'>
        <SectionNavigation currentSection='psst' />
      </div>

      {/* Content - takes remaining space and is scrollable */}
      <div className='flex-1 border-[#1D53FF] border md:border-t-0 rounded-r-2xl bg-[#fe93e7] overflow-y-auto'>
        {children}
      </div>
    </div>
  )
}
