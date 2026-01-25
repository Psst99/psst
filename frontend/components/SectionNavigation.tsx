import CustomLink from './CustomLink'
import type {SectionSlug} from '@/lib/theme/sections'
import SectionScope from './SectionScope'

interface SectionNavigationProps {
  currentSection?: string
}

const TABS: Array<{href: string; label: string; slug: SectionSlug; zBase: number}> = [
  {href: '/psst', label: 'PSST', slug: 'psst', zBase: 19},
  {href: '/database', label: 'DATABASE', slug: 'database', zBase: 18},
  {href: '/resources', label: 'RESOURCES', slug: 'resources', zBase: 14},
  {href: '/pssound-system', label: 'PSSOUND SYSTEM', slug: 'pssound-system', zBase: 15},
  {href: '/workshops', label: 'WORKSHOPS', slug: 'workshops', zBase: 17},
  {href: '/events', label: 'EVENTS', slug: 'events', zBase: 16},
  {href: '/archive', label: 'ARCHIVE', slug: 'archive', zBase: 13},
]

export default function SectionNavigation({currentSection = ''}: SectionNavigationProps) {
  return (
    <div className="w-full">
      <div className="flex relative w-full">
        {TABS.map((tab, idx) => {
          const isActive = currentSection === tab.slug
          const href = isActive ? '/' : tab.href

          return (
            <SectionScope key={tab.slug} section={tab.slug} className="contents">
              <CustomLink
                href={href}
                className={[
                  'relative font-normal text-[18px] leading-[22px] uppercase tracking-normal',
                  'px-10 py-1 border border-b-0 rounded-t-xl flex items-center justify-center',
                  'section-bg section-fg section-border',
                  idx > 0 ? '-ml-px' : '',
                  isActive ? 'z-30 section-underline' : `z-[${tab.zBase}]`,
                ].join(' ')}
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
            </SectionScope>
          )
        })}
      </div>
    </div>
  )
}
