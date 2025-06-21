import type React from 'react'
import SectionNavigation from '@/components/section-navigation'
import SubNavigation from '@/components/sub-navigation'

const subNavItems = [
  { label: 'Browse', href: '/workshops' },
  { label: 'Register', href: '/workshops/register' },
]

export default function WorkshopsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='h-screen flex flex-col overflow-hidden'>
      <div className='flex-shrink-0 hidden md:block'>
        <SectionNavigation currentSection='workshops' />
        <SubNavigation
          items={subNavItems}
          mainColor='#F50806'
          accentColor='#D2D2D2'
        />
      </div>

      {/* Content - takes remaining space and is scrollable */}
      <div className='flex-1 border-[#F50806] border md:border-t-0 rounded-r-2xl bg-[#D2D2D2] overflow-y-auto -mt-4'>
        {children}
      </div>
    </div>
  )
}
