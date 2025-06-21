import type React from 'react'
import SectionNavigation from '@/components/section-navigation'

export default function ArchiveLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='h-screen flex flex-col overflow-hidden'>
      <div className='flex-shrink-0 hidden md:block'>
        <SectionNavigation currentSection='archive' />
      </div>

      {/* Content - takes remaining space and is scrollable */}
      <div className='flex-1 border-[#FFCC00] border md:border-t-0 rounded-r-2xl bg-[#81520A] overflow-y-auto'>
        {children}
      </div>
    </div>
  )
}
