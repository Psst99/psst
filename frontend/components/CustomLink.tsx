'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useTransitionRouter} from 'next-view-transitions'
import {useEffect, useRef} from 'react'
import type {CSSProperties, MouseEvent, ReactNode} from 'react'

const VT_DURATION_MS = 1000
const FALLBACK_MS = 6000

type Props = {
  href: string
  children: ReactNode
  className?: string
  style?: CSSProperties & {[key: string]: any}
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

export default function CustomLink({href, children, className, style, onClick}: Props) {
  const router = useTransitionRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== '/') router.prefetch('/')
  }, [pathname, router])

  const navIdRef = useRef(0)
  const lastAnimRef = useRef<Animation | null>(null)

  const openFromHomeAnimation = () => {
    lastAnimRef.current?.cancel()
    lastAnimRef.current = document.documentElement.animate(
      [{transform: 'translateY(calc(100% - var(--home-nav-h)))'}, {transform: 'translateY(0)'}],
      {
        duration: VT_DURATION_MS,
        easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
        fill: 'forwards',
        pseudoElement: '::view-transition-new(root)',
      },
    )
  }

  const closeToHomeAnimation = () => {
    lastAnimRef.current?.cancel()
    lastAnimRef.current = document.documentElement.animate(
      [{transform: 'translateY(0)'}, {transform: 'translateY(calc(100% - var(--home-nav-h)))'}],
      {
        duration: VT_DURATION_MS,
        easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
        fill: 'forwards',
        pseudoElement: '::view-transition-old(root)',
      },
    )
    return lastAnimRef.current
  }

  const safePush = (to: string, onTransitionReady?: (navId: number) => void) => {
    const navId = ++navIdRef.current
    let transitionStarted = false

    const fallback = window.setTimeout(() => {
      if (navIdRef.current !== navId) return
      if (transitionStarted) return
      if (window.location.pathname !== to) window.location.assign(to)
    }, FALLBACK_MS)

    const onReadyWrapped = () => {
      transitionStarted = true
      window.clearTimeout(fallback)
      onTransitionReady?.(navId)
    }

    try {
      router.push(to, {onTransitionReady: onReadyWrapped})
    } catch {
      window.clearTimeout(fallback)
      window.location.assign(to)
    }

    return navId
  }

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)

    // HOME -> SECTION
    if (pathname === '/' && href !== '/') {
      e.preventDefault()
      document.documentElement.classList.remove('vt-close')
      safePush(href, () => openFromHomeAnimation())
      return
    }

    // SECTION -> HOME
    if (pathname !== '/' && href === '/') {
      e.preventDefault()
      document.documentElement.classList.add('vt-close')

      safePush('/', (navId) => {
        const anim = closeToHomeAnimation()

        const done = () => {
          // only remove if this is still the latest nav
          if (navIdRef.current !== navId) return
          if (document.documentElement.classList.contains('vt-close')) {
            document.documentElement.classList.remove('vt-close')
          }
        }

        anim?.finished?.then(done).catch(done)
      })

      return
    }
  }

  return (
    <Link href={href} prefetch onClick={handleClick} className={className} style={style}>
      {children}
    </Link>
  )
}
