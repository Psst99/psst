'use client'

import CustomLink from './CustomLink'
import {usePathname} from 'next/navigation'

interface SubNavigationItem {
  label: string
  href: string
}

interface SubNavigationProps {
  items: readonly SubNavigationItem[]
}

export default function SubNavigation({items}: SubNavigationProps) {
  const pathname = usePathname()
  const isDatabaseArtistModalPath = pathname.startsWith('/database/artists/')
  const isResourcesItemModalPath = pathname.startsWith('/resources/items/')

  return (
    <div className="shrink-0 hidden md:block rounded-tr-2xl rounded-tl-md border-t pb-0 section-border tab-inactive">
      <div className="flex relative w-full">
        {items.map((item, idx) => {
          const shouldForceBrowseActive =
            (isDatabaseArtistModalPath &&
              item.href === '/database/browse' &&
              items.some((navItem) => navItem.href === '/database')) ||
            (isResourcesItemModalPath &&
              item.href === '/resources/browse' &&
              items.some((navItem) => navItem.href === '/resources'))

          const isActive =
            shouldForceBrowseActive ||
            pathname === item.href ||
            (!isDatabaseArtistModalPath &&
              !isResourcesItemModalPath &&
              item.href === `/${pathname.split('/')[1]}` &&
              items.every((i) => i.href !== pathname))

          const marginLeft = idx > 0 ? '-ml-px' : ''
          const marginTop = '-mt-px'

          return (
            <CustomLink
              key={item.href}
              href={item.href}
              className={[
                'relative z-30 font-normal text-[24px] leading-[22px] uppercase tracking-normal px-10 py-1 border border-b-0 rounded-t-xl flex items-center justify-center',
                'section-border',
                marginLeft,
                marginTop,
                isActive ? 'tab-active sub-navigation-underline' : 'tab-inactive',
              ].join(' ')}
              style={
                isActive
                  ? {
                      '--underline-color': 'var(--section-fg)',
                    }
                  : undefined
              }
            >
              {item.label}
            </CustomLink>
          )
        })}
      </div>
    </div>
  )
}
