'use client'

import {usePathname} from 'next/navigation'
import {useEffect, useMemo, useState} from 'react'
import {getSectionConfig, type DynamicSubNavItemsBySection} from '@/lib/route-utils'
import type {SectionKey} from '@/lib/theme'

import SectionNavigation from './SectionNavigation'
import SubNavigation, {resolveActiveSubNavHref} from './SubNavigation'
import SectionScope from './SectionScope'
import SectionLoading from './loading/SectionLoading'
import DatabaseGuidelinesLoading from '@/app/database/loading'
import DatabaseBrowseLoading from '@/app/database/(browse)/browse/loading'
import DatabaseSubmitLoading from '@/app/database/submit/loading'
import ResourcesBrowseLoading from '@/app/resources/(browse)/browse/loading'
import ResourcesSubmitLoading from '@/app/resources/submit/loading'
import WorkshopsBrowseLoading from '@/app/workshops/loading'
import WorkshopsRegisterLoading from '@/app/workshops/register/loading'
import PssoundSystemRequestLoading from '@/app/pssound-system/request/loading'
import PssoundSystemMembershipLoading from '@/app/pssound-system/membership/loading'
import ContentPageSkeleton from './loading/ContentPageSkeleton'

interface DynamicLayoutProps {
  children: React.ReactNode
  dynamicSubNavItemsBySection?: Partial<
    Record<SectionKey, Array<{label: string; href: string; skeletonLayout?: 'default' | 'columns'}>>
  >
  contentPageLayouts?: {
    resourcesGuidelines?: 'default' | 'columns'
  }
}

export default function DynamicLayout({
  children,
  dynamicSubNavItemsBySection,
  contentPageLayouts,
}: DynamicLayoutProps) {
  const pathname = usePathname()
  const {section, hasSubNav, subNavItems} = getSectionConfig(pathname, dynamicSubNavItemsBySection)
  const [pendingSubNavHref, setPendingSubNavHref] = useState<string | null>(null)
  const dynamicSkeletonLayoutByHref = useMemo(() => {
    return new Map(
      Object.values(dynamicSubNavItemsBySection || {})
        .flat()
        .filter((item) => Boolean(item?.href && item?.skeletonLayout))
        .map((item) => [item.href, item.skeletonLayout]),
    )
  }, [dynamicSubNavItemsBySection])

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

  const mobileTopPaddingClass = hasSubNav ? 'pt-[5.5rem]' : 'pt-[4.5rem]'
  const desktopTopPaddingClass = isRootArchive
    ? 'min-[69.375rem]:pt-0'
    : hasDesktopSubNav
      ? 'min-[69.375rem]:pt-14'
      : 'min-[69.375rem]:pt-16'
  const paddingClasses = `${mobileTopPaddingClass} pb-0 ${desktopTopPaddingClass}`
  const contentOffsetClass = '-mt-0'
  const contentTopMarginClass = hasDesktopSubNav ? 'mt-[5px]' : 'mt-0'
  const contentTopSpacerClass = hasDesktopSubNav ? 'pt-2 min-[69.375rem]:pt-0' : 'pt-0'
  const contentOverflowClasses = 'overflow-visible'
  const desktopSheetTopClass = hasDesktopSubNav
    ? 'min-[69.375rem]:top-[calc(var(--home-nav-h)*2)]'
    : 'min-[69.375rem]:top-[var(--home-nav-h)]'

  // When first tab is active, content shouldn't have top-left rounded corner (intercalaire effect)
  const isFirstTabActive = activeSubNavIndex === 0
  const contentLeftRoundingClass = isFirstTabActive
    ? 'min-[69.375rem]:rounded-bl-2xl' // Only round bottom-left
    : 'min-[69.375rem]:rounded-l-2xl' // Round both left corners

  const handleSubNavItemClick = (href: string) => {
    if (href === pathname) return
    // Set pending state immediately (synchronously) for instant skeleton display
    setPendingSubNavHref(href)
  }

  const renderPendingSubNavLoading = (href: string) => {
    const dynamicLayout = dynamicSkeletonLayoutByHref.get(href)
    if (dynamicLayout && (section === 'psst' || section === 'pssound-system')) {
      const tone = section === 'psst' ? 'panel' : 'section'
      const wrapperClass =
        section === 'psst'
          ? dynamicLayout === 'columns'
            ? 'p-6 md:px-20'
            : 'px-6'
          : 'p-6 md:px-20 min-[69.375rem]:pb-[calc(var(--home-nav-h)+4rem)]'
      const skeleton = <ContentPageSkeleton layout={dynamicLayout} tone={tone} />

      return wrapperClass ? <div className={wrapperClass}>{skeleton}</div> : skeleton
    }

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
        return (
          <div className="p-6 md:px-20">
            <ContentPageSkeleton
              layout={contentPageLayouts?.resourcesGuidelines || 'columns'}
              tone="section"
            />
          </div>
        )
      case '/resources/browse':
        return <ResourcesBrowseLoading />
      case '/resources/submit':
        return <ResourcesSubmitLoading />
      case '/workshops':
        return <WorkshopsBrowseLoading />
      case '/workshops/register':
        return <WorkshopsRegisterLoading />
      case '/pssound-system':
        return <SectionLoading section="pssound-system" />
      case '/pssound-system/archive':
        return <SectionLoading section="pssound-system" />
      case '/pssound-system/request':
        return <PssoundSystemRequestLoading />
      case '/pssound-system/membership':
        return <PssoundSystemMembershipLoading />
      default:
        switch (section) {
          case 'database':
            return <DatabaseGuidelinesLoading />
          case 'resources':
            return (
              <div className="p-6 md:px-20">
                <ContentPageSkeleton
                  layout={contentPageLayouts?.resourcesGuidelines || 'columns'}
                  tone="section"
                />
              </div>
            )
          case 'workshops':
            return <WorkshopsBrowseLoading />
          case 'psst':
            return (
              <div className="px-6">
                <ContentPageSkeleton layout="default" tone="panel" />
              </div>
            )
          case 'pssound-system':
            return <SectionLoading section={section as any} />
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
      className="min-h-screen site-bg min-[69.375rem]:pb-[var(--home-nav-h)]"
    >
      {/* Mobile background layer */}
      <div className="fixed top-0 inset-0 -z-10 min-[69.375rem]:hidden section-bg section-border border" />

      <div className="min-h-screen flex flex-col overflow-hidden min-[69.375rem]:h-screen">
        {/* Desktop top active intercalaire + optional subnav */}
        <div className="hidden min-[69.375rem]:block fixed top-0 left-0 right-0 z-[26]">
          <SectionScope section={section as any} variant="page" className="contents">
            <div className="relative">
              <SectionNavigation currentSection={section} onlyCurrentSection />
            </div>
          </SectionScope>

          {hasSubNav && finalSubNavItems.length > 0 && (
            <SectionScope section={section as any} variant="page" className="contents">
              <SubNavigation
                items={finalSubNavItems}
                hideActiveTab={false}
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
            className="pointer-events-none hidden min-[69.375rem]:block fixed left-0 right-0 top-[var(--home-nav-h)] bottom-0 z-[8] section-bg min-[69.375rem]:rounded-tr-3xl"
          />
        )}

        {/* Desktop bottom stack of remaining intercalaires */}
        <div className="shrink-0 hidden min-[69.375rem]:block fixed bottom-0 left-0 right-0 z-20 section-nav-fixed section-page-nav-fixed">
          <SectionNavigation currentSection={section} hideCurrentSection />
        </div>

        {/* Main content */}
        <div
          className={[
            'relative flex-1 border-0 border-t min-[69.375rem]:border-t-0 z-10',
            contentTopMarginClass,
            // contentLeftRoundingClass,
            contentOffsetClass,
            contentOverflowClasses,
            'panel-bg panel-fg panel-border',
            paddingClasses,
            hasDesktopSubNav ? 'no-scrollbar min-[69.375rem]:rounded-tr-3xl' : '',
            'min-[69.375rem]:fixed min-[69.375rem]:left-0 min-[69.375rem]:right-0 min-[69.375rem]:bottom-0',
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
