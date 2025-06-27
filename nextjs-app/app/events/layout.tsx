import type React from 'react'
import SectionNavigation from '@/components/section-navigation'

export default function EventsLayout({
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
      <div className='flex-1 border-[#4E4E4E] border md:border-t-0 rounded-r-2xl bg-[#00ffdd] overflow-y-auto no-scrollbar pt-16'>
        {children}
      </div>
    </div>
  )
}
