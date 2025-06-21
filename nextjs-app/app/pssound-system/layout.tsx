import type React from 'react'
import SectionNavigation from '@/components/section-navigation'
import SubNavigation from '@/components/sub-navigation'

const subNavItems = [
  { label: 'Calendar', href: '/pssound-system' },
  { label: 'Request', href: '/pssound-system/request' },
  { label: 'Guidelines', href: '/pssound-system/guidelines' },
]

export default function PssoundSystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='h-screen flex flex-col overflow-hidden'>
      <div className='flex-shrink-0 hidden md:block'>
        <SectionNavigation currentSection='pssound-system' />
        <SubNavigation
          items={subNavItems}
          mainColor='#07f25b'
          accentColor='#81520A'
        />
      </div>

      {/* Content - takes remaining space and is scrollable */}
      <div className='flex-1 border-[#07F25B] border md:border-t-0 rounded-r-2xl bg-[#81520A] overflow-y-auto -mt-4'>
        {children}
      </div>
    </div>
  )
}
