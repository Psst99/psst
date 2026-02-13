'use client'

import CustomLink from './CustomLink'
import type {SectionSlug} from '@/lib/theme/sections'
import SectionScope from './SectionScope'

interface SectionNavigationProps {
  currentSection?: string
  hideCurrentSection?: boolean
  onlyCurrentSection?: boolean
}

const TABS: Array<{href: string; label: string; slug: SectionSlug; zBase: number}> = [
  {href: '/psst', label: 'PSƧT', slug: 'psst', zBase: 19},
  {href: '/database', label: 'DATABASE', slug: 'database', zBase: 18},
  {href: '/resources', label: 'RESOURCES', slug: 'resources', zBase: 14},
  {href: '/pssound-system', label: 'PSƧOUND SYSTEM', slug: 'pssound-system', zBase: 15},
  {href: '/workshops', label: 'WORKSHOPS', slug: 'workshops', zBase: 17},
  {href: '/events', label: 'EVENTS', slug: 'events', zBase: 16},
  {href: '/archive', label: 'ARCHIVE', slug: 'archive', zBase: 13},
]

export default function SectionNavigation({
  currentSection = '',
  hideCurrentSection = false,
  onlyCurrentSection = false,
}: SectionNavigationProps) {
  const enableDockHover = !onlyCurrentSection && (currentSection === 'home' || hideCurrentSection)

  return (
    <div className="w-full">
      <div className="flex relative w-full">
        {TABS.map((tab, idx) => {
          const isCurrent = currentSection === tab.slug
          const shouldHide = hideCurrentSection && isCurrent
          const shouldRenderPlaceholder = onlyCurrentSection && !isCurrent
          const isActive = !hideCurrentSection && isCurrent
          const href = isActive ? '/' : tab.href

          if (shouldRenderPlaceholder) {
            return (
              <div
                key={tab.slug}
                aria-hidden="true"
                className={[
                  'relative font-normal text-[24px] leading-[22px] uppercase tracking-tight',
                  'px-10 py-1 border border-b-0 rounded-t-xl flex items-center justify-center',
                  idx > 0 ? '-ml-px' : '',
                  'opacity-0 pointer-events-none select-none border-transparent text-transparent',
                ].join(' ')}
              >
                {tab.label}
              </div>
            )
          }

          const tabClassName = [
            'relative font-normal text-[24px] leading-[22px] uppercase tracking-tight',
            'px-10 pt-1 pb-1 border border-b-0 rounded-t-xl flex items-center justify-center',
            'section-bg section-fg section-border',
            enableDockHover
              ? 'motion-safe:transition-[margin] motion-safe:duration-300 motion-safe:[transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-mt-1 hover:mb-1'
              : '',
            idx > 0 ? '-ml-px' : '',
            shouldHide ? 'invisible' : '',
            isActive ? 'z-30 section-underline' : `z-[${tab.zBase}]`,
          ].join(' ')

          if (shouldHide) {
            return (
              <SectionScope key={tab.slug} section={tab.slug} className="contents">
                <div aria-hidden="true" className={tabClassName}>
                  {tab.label}
                </div>
              </SectionScope>
            )
          }

          return (
            <SectionScope key={tab.slug} section={tab.slug} className="contents">
              <div className={enableDockHover ? 'section-bg rounded-t-xl' : ''}>
                <CustomLink
                  href={href}
                  intercalaire
                  className={tabClassName}
                  style={
                    isActive
                      ? {
                          '--underline-color': 'var(--section-bg)',
                        }
                      : undefined
                  }
                >
                  {tab.label}
                </CustomLink>
              </div>
            </SectionScope>
          )
        })}
      </div>
    </div>
  )
}
