'use client'

import CustomLink from './CustomLink'
import type {SectionSlug} from '@/lib/theme/sections'
import SectionScope from './SectionScope'
import type {CSSProperties} from 'react'
import {useState} from 'react'
import {subNavigation} from '@/lib/theme'

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
  {href: '/psst', label: 'PSƧT', slug: 'psst', zBase: 19, widthWeight: 0.68},
  {href: '/database', label: 'DATABASE', slug: 'database', zBase: 18, widthWeight: 1.05},
  {href: '/resources', label: 'RESOURCES', slug: 'resources', zBase: 14, widthWeight: 1.12},
  {
    href: '/pssound-system',
    label: 'PSƧOUND',
    slug: 'pssound-system',
    zBase: 15,
    widthWeight: 0.92,
  },
  {href: '/workshops', label: 'WORKSHOPS', slug: 'workshops', zBase: 17, widthWeight: 1.18},
  {href: '/events', label: 'EVENTS', slug: 'events', zBase: 16, widthWeight: 0.82},
  {href: '/archive', label: 'ARCHIVE', slug: 'archive', zBase: 13, widthWeight: 0.9},
]

export default function SectionNavigation({
  currentSection = '',
  hideCurrentSection = false,
  onlyCurrentSection = false,
}: SectionNavigationProps) {
  const [hoveredTab, setHoveredTab] = useState<SectionSlug | null>(null)
  const enableDockHover = !onlyCurrentSection && (currentSection === 'home' || hideCurrentSection)
  const hoveredTabIndex =
    hoveredTab != null ? TABS.findIndex((item) => item.slug === hoveredTab) : -1
  const activeIdx =
    currentSection === 'home' || !currentSection
      ? -1
      : TABS.findIndex((item) => item.slug === currentSection)

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
          const isBlockedByHoveredTab = false // Removed strict hover blocking
          const href = isActive ? '/' : tab.href
          const isFirst = idx === 0
          const isLast = idx === TABS.length - 1
          const horizontalPaddingClass = isLast ? 'pl-6 pr-8' : 'px-6'

          let tabSide = 'none'
          if (activeIdx !== -1) {
            tabSide = idx < activeIdx ? 'left' : idx > activeIdx ? 'right' : 'active'
          }

          // Keep the natural intercalaires stack order stable across states.
          const baseZIndex = 1000 - idx
          const zIndex = isActive ? 2200 : baseZIndex
          const widthPercent = (cumulativeWidths[idx] / totalWeight) * 100

          const tabStyle: CSSProperties & {[key: string]: number | string} = {
            zIndex,
            '--intercalaire-index': idx,
            '--intercalaire-flex': tab.widthWeight,
            position: 'absolute',
            left: 0,
            width: `${widthPercent}%`,
          }

          if (shouldRenderPlaceholder) {
            return (
              <div
                key={tab.slug}
                aria-hidden="true"
                data-section-slug={tab.slug}
                data-tab-side={tabSide}
                className={[
                  'intercalaire-tab h-[var(--home-nav-h)] whitespace-nowrap',
                  'font-normal text-[24px] leading-[22px] uppercase tracking-tight',
                  horizontalPaddingClass,
                  'py-1 flex items-center justify-end',
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
            horizontalPaddingClass,
            'pt-1 pb-1 flex items-center justify-end',
            'section-bg section-fg',
            enableDockHover ? 'intercalaire-tab--hoverlift' : '',
            enableDockHover && isHovered ? 'intercalaire-tab--lifted' : '',
            isFirst ? 'intercalaire-tab--first' : '',
            isLast ? 'intercalaire-tab--last' : '',
            isBlockedByHoveredTab ? 'pointer-events-none' : '',
            shouldHide ? 'invisible' : '',
            isActive ? 'section-underline' : '',
          ].join(' ')

          if (shouldHide) {
            return (
              <SectionScope key={tab.slug} section={tab.slug} className="contents">
                <div
                  aria-hidden="true"
                  data-section-slug={tab.slug}
                  data-tab-side={tabSide}
                  className={tabClassName}
                  style={tabStyle}
                >
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
                data-section-slug={tab.slug}
                data-tab-side={tabSide}
                onMouseEnter={() => {
                  if (!enableDockHover) return
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
                {/* The extension background that mimics the full sheet under the tab */}
                <span
                  className="intercalaire-tab-extension pointer-events-none"
                  aria-hidden="true"
                />
              </CustomLink>
            </SectionScope>
          )
        })}
      </div>
    </div>
  )
}
