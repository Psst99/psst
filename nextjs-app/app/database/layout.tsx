import type React from 'react'
import SectionNavigation from '@/components/section-navigation'
import CustomLink from '@/components/custom-link'
import SubNavigation from '@/components/sub-navigation'

const subNavItems = [
  { label: 'Browse', href: '/database' },
  { label: 'Register', href: '/database/register' },
  { label: 'Guidelines', href: '/database/guidelines' },
]

export default function DatabaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='h-screen flex flex-col overflow-hidden'>
      <div className='flex-shrink-0 hidden md:block'>
        <SectionNavigation currentSection='database' />
        <SubNavigation
          items={subNavItems}
          mainColor='#6600ff'
          accentColor='#D3CD7F'
        />
      </div>

      {/* Main content with background starting below nav */}
      <div className='flex-1 bg-[#d3cd7f] border-[#6600ff] border md:border-t-0 rounded-r-2xl overflow-y-auto pt-16 -mt-4 no-scrollbar'>
        {children}
      </div>
    </div>
  )
}
