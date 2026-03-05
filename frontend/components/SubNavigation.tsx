'use client'

import CustomLink from './CustomLink'
import {usePathname} from 'next/navigation'
import type {CSSProperties} from 'react'

interface SubNavigationItem {
  label: string
  href: string
}

interface SubNavigationProps {
  items: readonly SubNavigationItem[]
  hideActiveTab?: boolean
  onItemClick?: (href: string) => void
  activeHref?: string | null
}

export function resolveActiveSubNavHref(pathname: string, items: readonly SubNavigationItem[]) {
  const isDatabaseArtistModalPath = pathname.startsWith('/database/artists/')
  const isResourcesItemModalPath = pathname.startsWith('/resources/items/')

  const activeItem = items.find((item) => {
    const shouldForceBrowseActive =
      (isDatabaseArtistModalPath &&
        item.href === '/database/browse' &&
        items.some((navItem) => navItem.href === '/database')) ||
      (isResourcesItemModalPath &&
        item.href === '/resources/browse' &&
        items.some((navItem) => navItem.href === '/resources'))

    return (
      shouldForceBrowseActive ||
      pathname === item.href ||
      (!isDatabaseArtistModalPath &&
        !isResourcesItemModalPath &&
        item.href === `/${pathname.split('/')[1]}` &&
        items.every((i) => i.href !== pathname))
    )
  })

  return activeItem?.href ?? null
}

export default function SubNavigation({
  items,
  hideActiveTab = false,
  onItemClick,
  activeHref: activeHrefProp,
}: SubNavigationProps) {
  const pathname = usePathname()
  const activeHref = activeHrefProp ?? resolveActiveSubNavHref(pathname, items)
  const activeTabIndex = items.findIndex((item) => activeHref === item.href)

  return (
    <div className="shrink-0 hidden md:block border-x-0 border-b-0 pb-0">
      <div className="intercalaire-row relative w-full" style={{height: 'var(--home-nav-h)'}}>
        {items.map((item, idx) => {
          const isActive = activeHref === item.href
          const isFirst = idx === 0
          const isLast = idx === items.length - 1
          const nextItem = items[idx + 1]
          const isNextActive = nextItem ? activeHref === nextItem.href : false
          const isHiddenBehindActive = !isActive && activeTabIndex > idx
          const shouldShowRightBorder =
            !isActive && !isNextActive && !isLast && !isHiddenBehindActive

          /* z-index layers:
             - ghost tabs:  1850+ (above active so they peek through)
             - active tab:  1800
             - regular tabs: 900 descending */
          let zIndex: number
          if (isActive) {
            zIndex = 1800
          } else if (isHiddenBehindActive) {
            zIndex = 1850 + idx
          } else {
            zIndex = 900 - idx
          }

          const widthPercent = ((idx + 1) / items.length) * 100
          const segmentWidthPercent = 100 / items.length
          const segmentLeftPercent = (idx / items.length) * 100
          const tabStyle: CSSProperties & {[key: string]: number | string} = {
            zIndex,
            '--intercalaire-index': idx,
            '--intercalaire-flex': 1,
            position: 'absolute',
            left: 0,
            width: `${widthPercent}%`,
          }
          const baseClass =
            'intercalaire-tab h-[var(--home-nav-h)] whitespace-nowrap font-normal text-[24px] leading-[22px] uppercase tracking-normal px-6 flex items-center justify-end transition-[margin] duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]'

          if (hideActiveTab && isActive) {
            return (
              <div
                key={item.href}
                aria-hidden="true"
                className={[
                  baseClass,
                  isFirst ? 'intercalaire-tab--first' : '',
                  isLast ? 'intercalaire-tab--last' : '',
                  'opacity-0 pointer-events-none select-none border-transparent text-transparent',
                ].join(' ')}
                style={tabStyle}
              >
                {item.label}
              </div>
            )
          }

          if (isActive) {
            return (
              <CustomLink
                key={item.href}
                href={item.href}
                onClick={() => onItemClick?.(item.href)}
                className={[
                  baseClass,
                  isFirst ? 'intercalaire-tab--first' : '',
                  isLast ? 'intercalaire-tab--last' : '',
                  'tab-active',
                ].join(' ')}
                style={tabStyle}
              >
                {item.label}
              </CustomLink>
            )
          }

          /* Ghost tab — hidden behind the active tab but subtly visible */
          if (isHiddenBehindActive) {
            const hiddenTabStyle: CSSProperties & {[key: string]: number | string} = {
              ...tabStyle,
              // Use a dedicated non-overlapping hit area per hidden tab so every
              // "buried" divider remains individually clickable.
              left: `${segmentLeftPercent}%`,
              width: `${segmentWidthPercent}%`,
            }
            const hiddenVisualStyle: CSSProperties & {[key: string]: number | string} = {
              ...tabStyle,
              // Keep visual geometry in the original cumulative stack style.
              left: 0,
              width: `${widthPercent}%`,
              pointerEvents: 'none',
            }
            const hiddenHitboxStyle: CSSProperties & {[key: string]: number | string} = {
              ...hiddenTabStyle,
              // Force hitbox above all visual layers.
              zIndex: 2600 + idx,
            }
            return (
              <div key={item.href} className="contents">
                <div
                  aria-hidden="true"
                  className={[
                    baseClass,
                    isFirst ? 'intercalaire-tab--first' : '',
                    isLast ? 'intercalaire-tab--last' : '',
                    'tab-inactive is-hidden-behind',
                  ].join(' ')}
                  style={hiddenVisualStyle}
                >
                  {item.label}
                </div>
                <CustomLink
                  href={item.href}
                  onClick={() => onItemClick?.(item.href)}
                  ariaLabel={item.label}
                  className="absolute top-0 bottom-0 block cursor-pointer"
                  style={hiddenHitboxStyle}
                >
                  <span className="sr-only">{item.label}</span>
                </CustomLink>
              </div>
            )
          }

          return (
            <CustomLink
              key={item.href}
              href={item.href}
              onClick={() => onItemClick?.(item.href)}
              className={[
                baseClass,
                isFirst ? 'intercalaire-tab--first' : '',
                isLast ? 'intercalaire-tab--last' : '',
                'tab-inactive hover:tab-active hover:-mt-1 hover:mb-1',
                shouldShowRightBorder ? 'has-right-border' : '',
              ].join(' ')}
              style={tabStyle}
            >
              {item.label}
            </CustomLink>
          )
        })}
      </div>
    </div>
  )
}
