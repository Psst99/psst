'use client'

import CustomLink from './CustomLink'
import type {SectionSlug} from '@/lib/theme/sections'
import SectionScope from './SectionScope'
import type {CSSProperties, MouseEvent as ReactMouseEvent} from 'react'
import {useState} from 'react'
import {subNavigation} from '@/lib/theme'
import {usePathname} from 'next/navigation'
import {resolveActiveSubNavHref} from './SubNavigation'
import {useTransitionRouter} from 'next-view-transitions'

interface SectionNavigationProps {
  currentSection?: string
  hideCurrentSection?: boolean
  onlyCurrentSection?: boolean
}

const TABS: Array<{
  href: string
  label: string
  slug: SectionSlug
  zBase: number
  widthWeight: number
}> = [
  {href: '/psst', label: 'PSƧT', slug: 'psst', zBase: 19, widthWeight: 0.95},
  {href: '/database', label: 'DATABASE', slug: 'database', zBase: 18, widthWeight: 1.1},
  {href: '/resources', label: 'RESOURCES', slug: 'resources', zBase: 14, widthWeight: 1.1},
  {
    href: '/pssound-system',
    label: 'PSƧOUND SYSTEM',
    slug: 'pssound-system',
    zBase: 15,
    widthWeight: 1.55,
  },
  {href: '/workshops', label: 'WORKSHOPS', slug: 'workshops', zBase: 17, widthWeight: 1.1},
  {href: '/events', label: 'EVENTS', slug: 'events', zBase: 16, widthWeight: 1},
  {href: '/archive', label: 'ARCHIVE', slug: 'archive', zBase: 13, widthWeight: 1.1},
]

type PreviewItem = {label: string; href: string}

const HOVER_PREVIEW_ITEMS: Partial<Record<SectionSlug, readonly PreviewItem[]>> = {
  psst: [
    {label: 'MANIFESTO', href: '/psst'},
    {label: 'ABOUT', href: '/psst/about'},
  ],
  database: subNavigation.database.map((item) => ({label: item.label.toUpperCase(), href: item.href})),
  workshops: subNavigation.workshops.map((item) => ({label: item.label.toUpperCase(), href: item.href})),
  'pssound-system': subNavigation['pssound-system'].map((item) => ({
    label: item.label.toUpperCase(),
    href: item.href,
  })),
  resources: subNavigation.resources.map((item) => ({label: item.label.toUpperCase(), href: item.href})),
}

export default function SectionNavigation({
  currentSection = '',
  hideCurrentSection = false,
  onlyCurrentSection = false,
}: SectionNavigationProps) {
  const pathname = usePathname()
  const router = useTransitionRouter()
  const [hoveredTab, setHoveredTab] = useState<SectionSlug | null>(null)
  const enableDockHover = !onlyCurrentSection && (currentSection === 'home' || hideCurrentSection)
  const hoveredTabIndex = hoveredTab != null ? TABS.findIndex((item) => item.slug === hoveredTab) : -1

  // Calculate cumulative width for cascading effect
  const cumulativeWidths = TABS.map((_, idx) => {
    return TABS.slice(0, idx + 1).reduce((sum, t) => sum + t.widthWeight, 0)
  })
  const totalWeight = TABS.reduce((sum, t) => sum + t.widthWeight, 0)

  return (
    <div className="w-full">
      <div
        className="intercalaire-row relative w-full"
        style={{height: 'var(--home-nav-h)'}}
        onMouseLeave={() => {
          // Don't clear hover during active navigation commit — the tab must stay lifted
          if (document.documentElement.classList.contains('intercalaire-committing')) return
          setHoveredTab(null)
        }}
      >
        {TABS.map((tab, idx) => {
          const isCurrent = currentSection === tab.slug
          const isHovered = hoveredTab === tab.slug
          const shouldHide = hideCurrentSection && isCurrent
          const shouldRenderPlaceholder = onlyCurrentSection && !isCurrent
          const isActive = !hideCurrentSection && isCurrent
          const isBlockedByHoveredTab =
            enableDockHover && hoveredTabIndex >= 0 && idx > hoveredTabIndex && !isHovered
          const href = isActive ? '/' : tab.href
          const isFirst = idx === 0
          const isLast = idx === TABS.length - 1
          // Keep the natural intercalaires stack order stable across states.
          const baseZIndex = 1000 - idx
          const zIndex = isActive ? 2200 : baseZIndex
          const widthPercent = (cumulativeWidths[idx] / totalWeight) * 100
          const previewItems = HOVER_PREVIEW_ITEMS[tab.slug] ?? []
          const fallbackActiveHref =
            previewItems.find((item) => item.href === tab.href)?.href ?? previewItems[0]?.href ?? null
          const resolvedActivePreviewHref =
            previewItems.length > 0 ? resolveActiveSubNavHref(pathname, previewItems) : null
          const activePreviewHref = resolvedActivePreviewHref ?? fallbackActiveHref
          const previewLength = previewItems.length
          const activePreviewIndex = previewItems.findIndex((item) => item.href === activePreviewHref)
          const normalizedActivePreviewIndex = activePreviewIndex >= 0 ? activePreviewIndex : 0
          const previewCoverStartPercent =
            previewLength > 0 ? ((normalizedActivePreviewIndex + 1) / previewLength) * 100 : 100
          const tabStyle: CSSProperties & {[key: string]: number | string} = {
            zIndex,
            '--intercalaire-index': idx,
            '--intercalaire-flex': tab.widthWeight,
            '--intercalaire-preview-cover-start': `${previewCoverStartPercent}%`,
            position: 'absolute',
            left: 0,
            width: `${widthPercent}%`,
          }

          if (shouldRenderPlaceholder) {
            return (
              <div
                key={tab.slug}
                aria-hidden="true"
                className={[
                  'intercalaire-tab h-[var(--home-nav-h)] whitespace-nowrap',
                  'font-normal text-[24px] leading-[22px] uppercase tracking-tight',
                  'px-6 py-1 flex items-center justify-end',
                  isFirst ? 'intercalaire-tab--first' : '',
                  isLast ? 'intercalaire-tab--last' : '',
                  'opacity-0 pointer-events-none select-none border-transparent text-transparent',
                ].join(' ')}
                style={tabStyle}
              >
                {tab.label}
              </div>
            )
          }

          const tabClassName = [
            'intercalaire-tab h-[var(--home-nav-h)] whitespace-nowrap',
            'font-normal text-[24px] leading-[22px] uppercase tracking-tight',
            'px-6 pt-1 pb-1 flex items-center justify-end',
            'section-bg section-fg',
            previewLength > 0 ? 'intercalaire-tab--with-preview' : '',
            enableDockHover ? 'intercalaire-tab--hoverlift' : '',
            enableDockHover && isHovered ? 'intercalaire-tab--lifted' : '',
            enableDockHover && isHovered && previewLength > 0 ? 'intercalaire-tab--lifted-double' : '',
            isFirst ? 'intercalaire-tab--first' : '',
            isLast ? 'intercalaire-tab--last' : '',
            isBlockedByHoveredTab ? 'pointer-events-none' : '',
            shouldHide ? 'invisible' : '',
            isActive ? 'section-underline' : '',
          ].join(' ')

          if (shouldHide) {
            return (
              <SectionScope key={tab.slug} section={tab.slug} className="contents">
                <div aria-hidden="true" className={tabClassName} style={tabStyle}>
                  {tab.label}
                </div>
              </SectionScope>
            )
          }

          return (
            <SectionScope key={tab.slug} section={tab.slug} className="contents">
              <CustomLink
                href={href}
                intercalaire
                onMouseEnter={() => {
                  if (!enableDockHover) return
                  if (hoveredTabIndex >= 0 && idx > hoveredTabIndex) return
                  setHoveredTab(tab.slug)
                }}
                className={tabClassName}
                style={{
                  ...tabStyle,
                  ...(isActive
                    ? {
                        '--underline-color': 'var(--section-bg)',
                      }
                    : {}),
                }}
              >
                <span>{tab.label}</span>
                <span
                  aria-hidden="true"
                  className={[
                    'intercalaire-tab-extension',
                    previewLength > 0 ? 'intercalaire-tab-extension--with-items' : '',
                  ].join(' ')}
                >
                  {previewItems.map((item, previewIdx) => {
                    const isItemActive = activePreviewHref === item.href
                    const isItemFirst = previewIdx === 0
                    const isItemLast = previewIdx === previewLength - 1
                    const nextItem = previewItems[previewIdx + 1]
                    const isNextItemActive = nextItem ? activePreviewHref === nextItem.href : false
                    const shouldShowRightBorder = !isItemActive && !isNextItemActive && !isItemLast
                    const previewItemZIndex = isItemActive ? 1800 : 900 - previewIdx

                    return (
                      <span
                        key={`${tab.slug}-${item.href}`}
                        className={[
                          'intercalaire-tab intercalaire-tab-extension-item',
                          isItemFirst ? 'intercalaire-tab--first' : '',
                          isItemLast ? 'intercalaire-tab--last' : '',
                          isItemActive ? 'tab-active' : 'tab-inactive',
                          shouldShowRightBorder ? 'border-r border-r-current has-right-border' : '',
                        ].join(' ')}
                        style={{
                          zIndex: previewItemZIndex,
                          left: 0,
                          width: `${((previewIdx + 1) / previewLength) * 100}%`,
                        }}
                        onClick={(event: ReactMouseEvent<HTMLSpanElement>) => {
                          event.preventDefault()
                          event.stopPropagation()
                          setHoveredTab(null)
                          if (pathname === item.href) return
                          router.push(item.href)
                        }}
                      >
                        {item.label}
                      </span>
                    )
                  })}
                  <span className="intercalaire-tab-extension-secondary" />
                </span>
              </CustomLink>
            </SectionScope>
          )
        })}
      </div>
    </div>
  )
}
