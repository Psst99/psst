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

  const hasDesktopSubNav = hasSubNav && finalSubNavItems.length > 0
  const paddingClasses = isRootArchive
    ? 'pt-0 pb-0'
    : hasDesktopSubNav
      ? 'py-16 pt-32'
      : 'pt-16 pb-0'
  const contentOverflowClasses = 'overflow-y-auto no-scrollbar'
  const desktopSheetTopClass = hasDesktopSubNav
    ? 'min-[83rem]:top-[calc(var(--home-nav-h)*2)]'
    : 'min-[83rem]:top-[var(--home-nav-h)]'

  return (
    <SectionScope
      section={section as any}
      variant="page"
      panelVariant={hasSubNav ? 'subtab' : 'section'}
      className="min-h-screen site-bg min-[83rem]:pb-[var(--home-nav-h)]"
    >
      {/* Mobile background layer */}
      <div className="fixed top-0 inset-0 -z-10 min-[83rem]:hidden section-bg section-border border" />

      <div className="min-h-screen flex flex-col overflow-hidden min-[83rem]:h-screen">
        {/* Desktop top active intercalaire + optional subnav */}
        <div className="hidden min-[83rem]:block fixed top-0 left-0 right-0 z-[26]">
          <SectionScope section={section as any} variant="page" className="contents">
            <div className="relative">
              <SectionNavigation currentSection={section} onlyCurrentSection />
            </div>
          </SectionScope>

          {hasSubNav && finalSubNavItems.length > 0 && (
            <SectionScope section={section as any} variant="page" className="contents">
              <SubNavigation items={finalSubNavItems} />
            </SectionScope>
          )}
        </div>

        {/* Desktop base section sheet (under sub-navigation sheet) */}
        {hasDesktopSubNav && (
          <div
            aria-hidden="true"
            className="pointer-events-none hidden min-[83rem]:block fixed left-0 right-0 top-[var(--home-nav-h)] bottom-0 z-[8] border border-t section-bg section-border min-[83rem]:rounded-l-2xl min-[83rem]:rounded-r-2xl"
          />
        )}

        {/* Desktop bottom stack of remaining intercalaires */}
        <div className="shrink-0 hidden min-[83rem]:block fixed bottom-0 left-0 right-0 z-20 section-nav-fixed">
          <SectionNavigation currentSection={section} hideCurrentSection />
        </div>

        {/* Main content */}
        <div
          className={[
            'flex-1 border border-t-0 min-[83rem]:border-t min-[83rem]:rounded-r-2xl z-10',
            contentOverflowClasses,
            'panel-bg panel-fg panel-border',
            paddingClasses,
            hasDesktopSubNav ? 'no-scrollbar' : '',
            'min-[83rem]:fixed min-[83rem]:left-0 min-[83rem]:right-0 min-[83rem]:bottom-0',
            desktopSheetTopClass,
          ].join(' ')}
        >
          <div className="pt-8"></div>
          {children}
        </div>
      </div>
    </SectionScope>
  )
}
