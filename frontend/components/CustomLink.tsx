'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useTransitionRouter} from 'next-view-transitions'
import type {MouseEvent, ReactNode} from 'react'

const VT_DURATION_MS = 1000
const STORAGE_KEY = 'psst-vt'

interface CustomLinkProps {
  href: string
  children: ReactNode
  className?: string
  style?: React.CSSProperties & {[key: string]: any}
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

export default function CustomLink({href, children, className, style, onClick}: CustomLinkProps) {
  const router = useTransitionRouter()
  const pathname = usePathname()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e)

    // HOME -> SECTION
    if (pathname === '/' && href !== '/') {
      e.preventDefault()
      try {
        sessionStorage.removeItem(STORAGE_KEY)
      } catch {}
      document.documentElement.classList.remove('vt-close')
      router.push(href, {onTransitionReady: openFromHomeAnimation})
      return
    }

    // SECTION -> HOME
    if (pathname !== '/' && href === '/') {
      e.preventDefault()

      // Critical: persist so the NEW document can see it immediately
      try {
        sessionStorage.setItem(STORAGE_KEY, 'close')
      } catch {}

      // Also set on current document (helps during the initial snapshot)
      document.documentElement.classList.add('vt-close')

      router.push('/', {onTransitionReady: closeToHomeAnimation})

      // Cleanup after transition finishes
      window.setTimeout(() => {
        document.documentElement.classList.remove('vt-close')
        try {
          sessionStorage.removeItem(STORAGE_KEY)
        } catch {}
      }, VT_DURATION_MS + 150)

      return
    }
  }

  return (
    <Link href={href} onClick={handleClick} className={className} style={style}>
      {children}
    </Link>
  )
}

const openFromHomeAnimation = () => {
  document.documentElement.animate(
    [{transform: 'translateY(100%)'}, {transform: 'translateY(0)'}],
    {
      duration: VT_DURATION_MS,
      easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
      fill: 'forwards',
      pseudoElement: '::view-transition-new(root)',
    },
  )
}

const closeToHomeAnimation = () => {
  document.documentElement.animate(
    [{transform: 'translateY(0)'}, {transform: 'translateY(100%)'}],
    {
      duration: VT_DURATION_MS,
      easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
      fill: 'forwards',
      pseudoElement: '::view-transition-old(root)',
    },
  )
}
