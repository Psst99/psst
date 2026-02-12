'use client'

import {usePathname} from 'next/navigation'
import {useMemo} from 'react'
import {getSectionConfig} from '@/lib/route-utils'

import SectionNavigation from './SectionNavigation'
import SubNavigation from './SubNavigation'
import SectionScope from './SectionScope'

interface DynamicLayoutProps {
  children: React.ReactNode
  dynamicSubNavItems?: Array<{label: string; href: string}>
}

export default function DynamicLayout({children, dynamicSubNavItems}: DynamicLayoutProps) {
  const pathname = usePathname()
  const {section, hasSubNav, subNavItems} = getSectionConfig(pathname, dynamicSubNavItems)

  const isRootArchive = pathname === '/archive'

  const finalSubNavItems = useMemo(() => {
    if (section === 'workshops') {
      return [
        {label: 'Browse', href: '/workshops'},
        {label: 'Register', href: '/workshops/register'},
      ]
    }
    return subNavItems || []
  }, [section, subNavItems])

  if (section === 'home') {
    return (
      <SectionScope section="home" variant="page" className="min-h-screen site-bg">
        <div className="h-full">{children}</div>
      </SectionScope>
    )
  }

  const paddingClasses = isRootArchive
    ? 'pt-0 pb-0'
    : hasSubNav
      ? 'py-16 pt-32 min-[83rem]:pt-16 min-[83rem]:-mt-4'
      : 'pt-16 pb-0 min-[83rem]:py-16 min-[83rem]:mt-0'
  const contentOverflowClasses =
    section === 'database' ? 'overflow-visible' : 'overflow-y-auto no-scrollbar'

  return (
    <SectionScope
      section={section as any}
      variant="page"
      panelVariant={hasSubNav ? 'subtab' : 'section'}
      className="min-h-screen site-bg pt-[var(--home-nav-h)]"
    >
      {/* Mobile background layer */}
      <div className="fixed top-0 inset-0 -z-10 min-[83rem]:hidden section-bg section-border border" />
      <div className="min-h-screen flex flex-col overflow-hidden">
        {/* Desktop navigation */}
        <div className="shrink-0 hidden min-[83rem]:block fixed top-0 left-0 right-0 z-20 bg-white">
          <SectionNavigation currentSection={section} />

          {hasSubNav && finalSubNavItems.length > 0 && (
            <SectionScope section={section as any} variant="page" className="contents">
              <SubNavigation items={finalSubNavItems} />
            </SectionScope>
          )}
        </div>

        {/* Main content */}
        <div
          className={[
            'flex-1 border border-t-0 min-[83rem]:border-t min-[83rem]:rounded-r-2xl z-10',
            contentOverflowClasses,
            'panel-bg panel-fg panel-border',
            paddingClasses,
            hasSubNav ? 'no-scrollbar' : '',
          ].join(' ')}
        >
          <div className="pt-8"></div>
          {children}
        </div>
      </div>
    </SectionScope>
  )
}
