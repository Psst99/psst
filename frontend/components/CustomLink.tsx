'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useTransitionRouter} from 'next-view-transitions'
import type {MouseEvent, ReactNode} from 'react'

const VT_DURATION_MS = 1000

type Props = {
  href: string
  children: ReactNode
  className?: string
  style?: React.CSSProperties & {[key: string]: any}
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

export default function CustomLink({href, children, className, style, onClick}: Props) {
  const router = useTransitionRouter()
  const pathname = usePathname()

  const safePush = (to: string, onTransitionReady?: () => void) => {
    try {
      router.push(to, {onTransitionReady})
      // If VT aborts due to timeout, next-view-transitions throws/logs.
      // This fallback makes the UX deterministic.
      window.setTimeout(() => {
        // If we still aren't on the target path, force a normal navigation.
        // (Avoid infinite loops: only if needed.)
        if (window.location.pathname !== to) window.location.assign(to)
      }, VT_DURATION_MS + 400)
    } catch {
      window.location.assign(to)
    }
  }

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e)

    // HOME -> SECTION
    if (pathname === '/' && href !== '/') {
      e.preventDefault()
      document.documentElement.classList.remove('vt-close')
      safePush(href, openFromHomeAnimation)
      return
    }

    // SECTION -> HOME
    if (pathname !== '/' && href === '/') {
      e.preventDefault()
      document.documentElement.classList.add('vt-close')
      safePush('/', closeToHomeAnimation)
      window.setTimeout(() => {
        document.documentElement.classList.remove('vt-close')
      }, VT_DURATION_MS + 250)
      return
    }

    // Otherwise: let Next handle it normally
  }

  return (
    <Link href={href} prefetch onClick={handleClick} className={className} style={style}>
      {children}
    </Link>
  )
}

const openFromHomeAnimation = () => {
  // New page starts just below the visible home nav strip
  document.documentElement.animate(
    [{transform: 'translateY(calc(100% - var(--home-nav-h)))'}, {transform: 'translateY(0)'}],
    {
      duration: VT_DURATION_MS,
      easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
      fill: 'forwards',
      pseudoElement: '::view-transition-new(root)',
    },
  )

  // Optional: nudge old home very slightly so it feels connected (not required)
  // document.documentElement.animate([{transform:'translateY(0)'},{transform:'translateY(-8px)'}], { ... pseudoElement:'::view-transition-old(root)' })
}

const closeToHomeAnimation = () => {
  // Old page slides down but stops with the home nav strip still “there”
  document.documentElement.animate(
    [{transform: 'translateY(0)'}, {transform: 'translateY(calc(100% - var(--home-nav-h)))'}],
    {
      duration: VT_DURATION_MS,
      easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
      fill: 'forwards',
      pseudoElement: '::view-transition-old(root)',
    },
  )

  // New home page is already in place under it; no need to animate it.
}
