'use client'

import CustomLink from './custom-link'
import { usePathname } from 'next/navigation'

interface SubNavigationItem {
  label: string
  href: string
}

interface SubNavigationProps {
  items: SubNavigationItem[]
  mainColor: string
  accentColor: string
}

export default function SubNavigation({
  items,
  mainColor,
  accentColor,
}: SubNavigationProps) {
  const pathname = usePathname()

  return (
    <div
      className={`flex-shrink-0 hidden md:block rounded-tr-2xl border-t pb-4`}
      style={{ backgroundColor: mainColor, borderColor: accentColor }}
    >
      <div className='flex relative w-full'>
        {items.map((item, idx) => {
          const isActive =
            pathname === item.href ||
            (item.href.split('/').length === 2 &&
              pathname.startsWith(`${item.href}/`) &&
              !items.slice(1).some((i) => pathname === i.href))

          const bgColor = isActive ? accentColor : mainColor
          const textColor = isActive ? mainColor : accentColor
          const borderColor = isActive ? mainColor : accentColor
          const marginLeft = idx > 0 ? '-ml-[1px]' : ''
          const marginTop = '-mt-[1px]'

          return (
            <CustomLink
              key={item.href}
              href={item.href}
              className={` relative z-10 font-normal text-[18px] leading-[22px] uppercase tracking-normal px-10 py-1 border border-b-0 rounded-t-md flex items-center justify-center ${marginLeft} ${marginTop}`}
              style={{
                backgroundColor: bgColor,
                color: textColor,
                borderColor: borderColor,
              }}
            >
              {item.label}
            </CustomLink>
          )
        })}
      </div>
    </div>
  )
}
