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

  const forcedBrowseItem = items.find((item) => {
    const shouldForceBrowseActive =
      (isDatabaseArtistModalPath &&
        item.href === '/database/browse' &&
        items.some((navItem) => navItem.href === '/database')) ||
      (isResourcesItemModalPath &&
        item.href === '/resources/browse' &&
        items.some((navItem) => navItem.href === '/resources'))

    return shouldForceBrowseActive
  })

  if (forcedBrowseItem) return forcedBrowseItem.href

  const activeItem = items
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]

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

  return (
    <div className="shrink-0 hidden md:block border-x-0 border-b-0 pb-0 pl-0">
      <div
        className="subnav-rounded-row flex w-full items-end"
        // style={{height: 'var(--home-nav-h)'}}
      >
        {items.map((item, idx) => {
          const isActive = activeHref === item.href
          const nextItem = items[idx + 1]
          const nextIsActive = nextItem ? activeHref === nextItem.href : false
          const hasRightDelimiter = !isActive && !nextIsActive && idx !== items.length - 1

          const tabStyle: CSSProperties & {[key: string]: number | string} = {
            flex: '0 0 auto',
            zIndex: items.length - idx,
          }
          const slotClass = 'subnav-rounded-slot flex flex-none justify-start'
          const baseClass =
            'subnav-rounded-tab whitespace-nowrap font-normal text-[24px] uppercase tracking-normal flex items-center justify-end'
          const shapeClass = [
            'subnav-rounded-tab--stacked',
            idx === 0 ? 'subnav-rounded-tab--first' : '',
            idx === items.length - 1 ? 'subnav-rounded-tab--last' : '',
          ]
            .filter(Boolean)
            .join(' ')

          if (hideActiveTab && isActive) {
            return (
              <div key={item.href} className={slotClass}>
                <div
                  aria-hidden="true"
                  className={[
                    baseClass,
                    shapeClass,
                    'opacity-0 pointer-events-none select-none border-transparent text-transparent',
                  ].join(' ')}
                  style={tabStyle}
                >
                  <span className="relative z-20">{item.label}</span>
                </div>
              </div>
            )
          }

          if (isActive) {
            return (
              <div key={item.href} className={slotClass}>
                <CustomLink
                  href={item.href}
                  onClick={() => onItemClick?.(item.href)}
                  className={[baseClass, shapeClass, 'panel-tab-active'].join(' ')}
                  style={tabStyle}
                >
                  <span className="relative z-20">{item.label}</span>
                </CustomLink>
              </div>
            )
          }

          return (
            <div key={item.href} className={slotClass}>
              <CustomLink
                href={item.href}
                onClick={() => onItemClick?.(item.href)}
                className={[baseClass, shapeClass, 'panel-tab-inactive'].join(' ')}
                style={tabStyle}
              >
                <span className="relative z-20">{item.label}</span>
                {hasRightDelimiter && (
                  <div className="absolute top-0 bottom-0 right-[-14px] w-[28px] overflow-hidden pointer-events-none z-30">
                    <svg
                      viewBox="0 0 14 14"
                      className="absolute top-0 left-0 w-[14px] h-[14px] overflow-visible"
                    >
                      <path
                        d="M-2 0 L0 0 A14 14 0 0 1 14 14 L14 16"
                        fill="none"
                        style={{stroke: 'var(--subnav-seam-color)'}}
                        strokeWidth="1"
                      />
                    </svg>
                    <div
                      className="absolute w-[1px]"
                      style={{
                        top: '14px',
                        bottom: '14px',
                        left: '13.5px',
                        backgroundColor: 'var(--subnav-seam-color)',
                      }}
                    />
                    <svg
                      viewBox="0 0 14 14"
                      className="absolute bottom-0 right-0 w-[14px] h-[14px] overflow-visible"
                    >
                      <path
                        d="M0 -2 L0 0 A14 14 0 0 0 14 14 L16 14"
                        fill="none"
                        style={{stroke: 'var(--subnav-seam-color)'}}
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                )}
              </CustomLink>
            </div>
          )
        })}
      </div>
    </div>
  )
}
