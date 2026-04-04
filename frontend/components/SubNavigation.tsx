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

  return (
    <div className="shrink-0 hidden md:block border-x-0 border-b-0 pb-0 pl-4">
      <div
        className="subnav-rounded-row flex w-full items-end"
        // style={{height: 'var(--home-nav-h)'}}
      >
        {items.map((item, idx) => {
          const isActive = activeHref === item.href
          const tabStyle: CSSProperties & {[key: string]: number | string} = {
            flex: '0 0 auto',
          }
          const slotClass = 'subnav-rounded-slot flex flex-none justify-start'
          const baseClass =
            'subnav-rounded-tab whitespace-nowrap font-normal text-[24px] uppercase tracking-normal flex items-center justify-center'
          const shapeClass = 'subnav-rounded-tab--middle'

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
                  {item.label}
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
                  {item.label}
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
                {item.label}
              </CustomLink>
            </div>
          )
        })}
      </div>
    </div>
  )
}
