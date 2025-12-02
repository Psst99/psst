'use client'

import {usePathname} from 'next/navigation'
import {useMemo} from 'react'
import {getSectionConfig} from '@/lib/route-utils'

import SectionNavigation from './section-navigation'
import SubNavigation from './sub-navigation'

interface DynamicLayoutProps {
  children: React.ReactNode
  hasUpcomingWorkshops?: boolean
  dynamicSubNavItems?: Array<{label: string; href: string}>
}

export default function DynamicLayout({
  children,
  hasUpcomingWorkshops = false,
  dynamicSubNavItems,
}: DynamicLayoutProps) {
  const pathname = usePathname()

  // Pass dynamicSubNavItems to getSectionConfig - it will handle everything
  const {section, theme, hasSubNav, subNavItems} = getSectionConfig(pathname, dynamicSubNavItems)

  const isRootArchive = pathname === '/archive'

  // Only handle workshops dynamically here
  const finalSubNavItems = useMemo(() => {
    if (section === 'workshops') {
      const baseItems = [{label: 'Browse', href: '/workshops'}]
      return hasUpcomingWorkshops
        ? [...baseItems, {label: 'Register', href: '/workshops/register'}]
        : baseItems
    }
    return subNavItems || []
  }, [section, hasUpcomingWorkshops, subNavItems])

  // Special handling for home page
  if (section === 'home') {
    return <div className="h-full">{children}</div>
  }

  const paddingClasses = isRootArchive
    ? 'pt-0 pb-0'
    : hasSubNav
      ? 'py-16 pt-32 min-[83rem]:pt-16 min-[83rem]:-mt-4'
      : 'pt-16 pb-0 min-[83rem]:py-16 min-[83rem]:mt-0'

  return (
    <>
      {/* Mobile background */}
      <div
        className="fixed top-0 inset-0 -z-10 border-b-0 border-t-0 min-[83rem]:hidden"
        style={{
          backgroundColor: theme.bg,
          borderColor: theme.border,
        }}
      />

      <div className="min-h-screen flex flex-col overflow-hidden">
        {/* Desktop navigation */}
        <div className="shrink-0 hidden min-[83rem]:block">
          <SectionNavigation currentSection={section} />
          {hasSubNav && finalSubNavItems && finalSubNavItems.length > 0 && (
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
            flex-1 border border-t-0 min-[83rem]:border-t min-[83rem]:rounded-r-2xl overflow-y-auto
            ${paddingClasses}
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
