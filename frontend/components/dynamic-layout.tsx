'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { getSectionConfig } from '@/lib/route-utils'

import SectionNavigation from './section-navigation'
import SubNavigation from './sub-navigation'
import { useWorkshops } from '@/contexts/WorkshopContext'

interface DynamicLayoutProps {
  children: React.ReactNode
  subNavItems?: Array<{ label: string; href: string }>
}

export default function DynamicLayout({
  children,
  subNavItems,
}: DynamicLayoutProps) {
  const pathname = usePathname()
  const { hasActiveWorkshops } = useWorkshops()

  const {
    section,
    theme,
    hasSubNav,
    subNavItems: configSubNavItems,
  } = getSectionConfig(pathname)

  // Dynamically modify subNavItems for workshops section
  const finalSubNavItems = useMemo(() => {
    if (section === 'workshops') {
      const baseItems = [{ label: 'Browse', href: '/workshops' }]
      return hasActiveWorkshops
        ? [...baseItems, { label: 'Register', href: '/workshops/register' }]
        : baseItems
    }
    return subNavItems ?? configSubNavItems
  }, [section, hasActiveWorkshops, subNavItems, configSubNavItems])

  // Special handling for home page
  if (section === 'home') {
    return <div className='h-full'>{children}</div>
  }

  return (
    <>
      {/* Mobile background */}
      <div
        className='fixed top-0 inset-0 -z-10 border-b-0 border-t-0 md:hidden'
        style={{
          backgroundColor: theme.bg,
          borderColor: theme.border,
        }}
      />

      <div className='min-h-screen flex flex-col overflow-hidden'>
        {/* Desktop navigation */}
        <div className='shrink-0 hidden md:block'>
          <SectionNavigation currentSection={section} />
          {hasSubNav && finalSubNavItems && (
            <SubNavigation
              items={finalSubNavItems}
              mainColor={theme.accent}
              accentColor={theme.bg}
            />
          )}
        </div>

        {/* Main content */}
        <div
          className={`
            flex-1 border border-t-0 md:border-t md:rounded-r-2xl overflow-y-auto
            ${hasSubNav ? 'py-16 pt-32 md:pt-16 md:-mt-4' : 'pt-16 pb-0 md:py-16 md:mt-0'}
            ${hasSubNav ? 'no-scrollbar' : ''}
            z-10
          `}
          style={{
            backgroundColor: theme.bg,
            borderColor: theme.border,
          }}
        >
          {children}
        </div>
      </div>
    </>
  )
}
