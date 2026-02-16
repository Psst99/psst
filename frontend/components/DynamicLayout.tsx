'use client'

import {usePathname} from 'next/navigation'
import {useEffect, useMemo, useState} from 'react'
import {getSectionConfig} from '@/lib/route-utils'

import CustomLink from './CustomLink'
import SectionNavigation from './SectionNavigation'
import SubNavigation, {resolveActiveSubNavHref} from './SubNavigation'
import SectionScope from './SectionScope'
import SectionLoading from './loading/SectionLoading'
import DatabaseGuidelinesLoading from '@/app/database/loading'
import DatabaseBrowseLoading from '@/app/database/(browse)/browse/loading'
import DatabaseSubmitLoading from '@/app/database/submit/loading'
import ResourcesGuidelinesLoading from '@/app/resources/loading'
import ResourcesBrowseLoading from '@/app/resources/(browse)/browse/loading'
import ResourcesSubmitLoading from '@/app/resources/submit/loading'
import WorkshopsBrowseLoading from '@/app/workshops/loading'
import WorkshopsRegisterLoading from '@/app/workshops/register/loading'
import PsstRouteLoading from '@/app/psst/loading'
import PssoundSystemLoading from '@/app/pssound-system/loading'
import PssoundSystemRequestLoading from '@/app/pssound-system/request/loading'
import PssoundSystemMembershipLoading from '@/app/pssound-system/membership/loading'

interface DynamicLayoutProps {
  children: React.ReactNode
  dynamicSubNavItems?: Array<{label: string; href: string}>
}

export default function DynamicLayout({children, dynamicSubNavItems}: DynamicLayoutProps) {
  const pathname = usePathname()
  const {section, hasSubNav, subNavItems} = getSectionConfig(pathname, dynamicSubNavItems)
  const [pendingSubNavHref, setPendingSubNavHref] = useState<string | null>(null)

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

  useEffect(() => {
    setPendingSubNavHref(null)
  }, [pathname])

  if (section === 'home') {
    return (
      <SectionScope section="home" variant="page" className="min-h-screen site-bg">
        <div className="h-full">{children}</div>
      </SectionScope>
    )
  }

  const hasDesktopSubNav = hasSubNav && finalSubNavItems.length > 0
  const isPendingSubNavNavigation =
    pendingSubNavHref != null &&
    pendingSubNavHref !== pathname &&
    finalSubNavItems.some((item) => item.href === pendingSubNavHref)
  // Use pending href for immediate visual feedback, fallback to actual pathname
  const displayActiveHref = pendingSubNavHref || pathname
  const activeSubNavHref = hasDesktopSubNav
    ? resolveActiveSubNavHref(displayActiveHref, finalSubNavItems)
    : null
  const activeSubNavIndex =
    activeSubNavHref != null
      ? finalSubNavItems.findIndex((item) => item.href === activeSubNavHref)
      : -1
  const activeSubNavItem = activeSubNavIndex >= 0 ? finalSubNavItems[activeSubNavIndex] : null

  const paddingClasses = isRootArchive
    ? 'pt-0 pb-0'
    : hasDesktopSubNav
      ? 'pt-8 pb-0 min-[83rem]:pt-14'
      : 'pt-16 pb-0'
  const contentOffsetClass = '-mt-0'
  const contentTopSpacerClass = hasDesktopSubNav ? 'pt-2 min-[83rem]:pt-0' : 'pt-0'
  const contentOverflowClasses = 'overflow-visible'
  const desktopSheetTopClass = hasDesktopSubNav
    ? 'min-[83rem]:top-[calc(var(--home-nav-h)*2)]'
    : 'min-[83rem]:top-[var(--home-nav-h)]'

  // When first tab is active, content shouldn't have top-left rounded corner (intercalaire effect)
  const isFirstTabActive = activeSubNavIndex === 0
  const contentLeftRoundingClass = isFirstTabActive
    ? 'min-[83rem]:rounded-bl-2xl' // Only round bottom-left
    : 'min-[83rem]:rounded-l-2xl' // Round both left corners

  const handleSubNavItemClick = (href: string) => {
    if (href === pathname) return
    // Set pending state immediately (synchronously) for instant skeleton display
    setPendingSubNavHref(href)
  }

  const renderPendingSubNavLoading = (href: string) => {
    switch (href) {
      case '/database':
      case '/database/guidelines':
        return <DatabaseGuidelinesLoading />
      case '/database/browse':
        return <DatabaseBrowseLoading />
      case '/database/submit':
        return <DatabaseSubmitLoading />
      case '/resources':
      case '/resources/guidelines':
        return <ResourcesGuidelinesLoading />
      case '/resources/browse':
        return <ResourcesBrowseLoading />
      case '/resources/submit':
        return <ResourcesSubmitLoading />
      case '/workshops':
        return <WorkshopsBrowseLoading />
      case '/workshops/register':
        return <WorkshopsRegisterLoading />
      case '/psst':
      case '/psst/about':
        return <PsstRouteLoading />
      case '/pssound-system':
      case '/pssound-system/manifesto':
      case '/pssound-system/archive':
        return <PssoundSystemLoading />
      case '/pssound-system/request':
        return <PssoundSystemRequestLoading />
      case '/pssound-system/membership':
        return <PssoundSystemMembershipLoading />
      default:
        switch (section) {
          case 'database':
            return <DatabaseGuidelinesLoading />
          case 'resources':
            return <ResourcesGuidelinesLoading />
          case 'workshops':
            return <WorkshopsBrowseLoading />
          case 'psst':
            return <PsstRouteLoading />
          case 'pssound-system':
            return <PssoundSystemLoading />
          default:
            return <SectionLoading section={section as any} />
        }
    }
  }

  const pendingSubNavLoading =
    isPendingSubNavNavigation && pendingSubNavHref
      ? renderPendingSubNavLoading(pendingSubNavHref)
      : null

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
              <SubNavigation
                items={finalSubNavItems}
                hideActiveTab
                onItemClick={handleSubNavItemClick}
                activeHref={activeSubNavHref}
              />
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

        {hasDesktopSubNav && activeSubNavItem && (
          <div
            className={[
              'pointer-events-none hidden min-[83rem]:block fixed left-0 right-0 z-[27] -translate-y-[calc(100%-1px)]',
              desktopSheetTopClass,
              contentOffsetClass,
            ].join(' ')}
          >
            <div className="flex relative w-full">
              {finalSubNavItems.map((item, idx) => {
                if (idx > activeSubNavIndex) return null

                const marginLeft = idx > 0 ? '-ml-px' : ''
                const isActive = idx === activeSubNavIndex
                // const shapeClass = idx === 0 && isActive ? 'rounded-tr-xl' : 'rounded-t-xl'
                const shapeClass = 'rounded-t-xl'
                const baseClass =
                  'relative h-[var(--home-nav-h)] font-normal text-[24px] leading-[22px] uppercase tracking-normal px-10 border border-b-0 section-border flex items-center justify-center'

                if (!isActive) {
                  return (
                    <div
                      key={item.href}
                      aria-hidden="true"
                      className={[
                        baseClass,
                        shapeClass,
                        marginLeft,
                        'opacity-0 pointer-events-none select-none border-transparent text-transparent',
                      ].join(' ')}
                    >
                      {item.label}
                    </div>
                  )
                }

                return (
                  <CustomLink
                    key={item.href}
                    href={activeSubNavItem.href}
                    className={[
                      baseClass,
                      shapeClass,
                      marginLeft,
                      'pointer-events-auto z-30 tab-active',
                    ].join(' ')}
                  >
                    {activeSubNavItem.label}
                  </CustomLink>
                )
              })}
            </div>
          </div>
        )}

        {/* Main content */}
        <div
          className={[
            'mt-0 relative flex-1 border-0 border-t min-[83rem]:border-t min-[83rem]:rounded-r-2xl z-10',
            contentLeftRoundingClass,
            contentOffsetClass,
            contentOverflowClasses,
            'panel-bg panel-fg panel-border',
            paddingClasses,
            hasDesktopSubNav ? 'no-scrollbar' : '',
            'min-[83rem]:fixed min-[83rem]:left-0 min-[83rem]:right-0 min-[83rem]:bottom-0',
            desktopSheetTopClass,
          ].join(' ')}
        >
          <div className="h-full overflow-y-auto no-scrollbar">
            <div className={contentTopSpacerClass}></div>
            {pendingSubNavLoading ?? children}
          </div>
        </div>
      </div>
    </SectionScope>
  )
}
