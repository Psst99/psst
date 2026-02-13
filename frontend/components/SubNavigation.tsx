'use client'

import CustomLink from './CustomLink'
import {usePathname} from 'next/navigation'

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
    <div className="mt-0 shrink-0 hidden md:block rounded-t-xl overflow-hidden border-x border-b-0 pb-0 section-border">
      <div className="flex relative w-full">
        {items.map((item, idx) => {
          const isActive = activeHref === item.href
          const marginLeft = idx > 0 ? (isActive ? '-ml-[3px]' : '-ml-[2px]') : ''
          const shapeClass = idx === 0 && isActive ? 'rounded-tr-xl' : 'rounded-t-xl'
          const baseClass =
            'relative h-[var(--home-nav-h)] font-normal text-[24px] leading-[22px] uppercase tracking-normal px-10 border border-b-0 section-border flex items-center justify-center'

          if (hideActiveTab && isActive) {
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
              href={item.href}
              onClick={() => onItemClick?.(item.href)}
              className={[
                baseClass,
                shapeClass,
                marginLeft,
                isActive ? 'z-40 tab-active' : 'z-30 tab-inactive hover:tab-active',
              ].join(' ')}
            >
              {item.label}
            </CustomLink>
          )
        })}
      </div>
    </div>
  )
}
