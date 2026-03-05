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
  ariaLabel?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  intercalaire?: boolean
  prefetch?: boolean
  'data-section-slug'?: string
  'data-tab-side'?: string
}

export default function CustomLink({
  href,
  children,
  className,
  style,
  ariaLabel,
  onClick,
  onMouseEnter,
  onMouseLeave,
  intercalaire = false,
  prefetch = true,
  'data-section-slug': dataSectionSlug,
  'data-tab-side': dataTabSide,
}: Props) {
  const router = useTransitionRouter()
  const pathname = usePathname()
  const commitElRef = useRef<HTMLAnchorElement | null>(null)

  const getCurrentLiftPx = (el: HTMLAnchorElement) => {
    const computed = window.getComputedStyle(el)
    if (computed.transform === 'none') return 0
    try {
      const matrix = new DOMMatrixReadOnly(computed.transform)
      return Math.max(0, -matrix.m42)
    } catch {
      return 0
    }
  }

  const armIntercalaireCommit = (el: HTMLAnchorElement) => {
    const tabHeightPx = el.getBoundingClientRect().height
    const currentLiftPx = getCurrentLiftPx(el)

    // We just keep the current hover lift, so the active tab stays perfectly still
    // while the right-side tabs slide down. Then the VT smoothly slides it up.
    const commitLiftPx = currentLiftPx
    const rectTopPx = el.getBoundingClientRect().top

    commitElRef.current = el
    // Isolate the old tab so it doesn't leave a ghost in the view transition photograph that fights with the newly mounting one
    el.style.viewTransitionName = 'committing-tab-ghost'

    el.style.setProperty('--intercalaire-commit-lift', `${commitLiftPx}px`)
    document.documentElement.style.setProperty('--intercalaire-rect-top', `${rectTopPx}px`)
    el.dataset.committing = 'true'
    document.documentElement.classList.add('intercalaire-committing')
  }

  const clearIntercalaireCommit = () => {
    document.documentElement.classList.remove('intercalaire-committing')
    document.documentElement.style.removeProperty('--intercalaire-rect-top')
    if (!commitElRef.current) return
    delete commitElRef.current.dataset.committing
    commitElRef.current.style.removeProperty('--intercalaire-commit-lift')
    commitElRef.current.style.removeProperty('view-transition-name')
    commitElRef.current = null
  }

  useEffect(() => {
    if (pathname !== '/') router.prefetch('/')
  }, [pathname, router])

  useEffect(() => {
    // Don't clear during active view transition — the animation cleanup callback handles it
    if (
      document.documentElement.classList.contains('vt-open') ||
      document.documentElement.classList.contains('vt-close') ||
      document.documentElement.classList.contains('vt-section-switch')
    )
      return
    document.documentElement.classList.remove('intercalaire-committing')
    document.documentElement.style.removeProperty('--intercalaire-rect-top')
    if (!commitElRef.current) return
    delete commitElRef.current.dataset.committing
    commitElRef.current.style.removeProperty('--intercalaire-commit-lift')
    commitElRef.current = null
  }, [pathname])

  useEffect(() => {
    if (!prefetch || !intercalaire || href === pathname) return
    router.prefetch(href)
  }, [href, intercalaire, pathname, prefetch, router])

  const navIdRef = useRef(0)
  const lastAnimRef = useRef<Animation | null>(null)
  const clearTransitionClasses = () => {
    document.documentElement.classList.remove(
      'vt-close',
      'vt-close-prep',
      'vt-open',
      'vt-section-switch',
    )
    clearIntercalaireCommit()
  }

  const openFromHomeAnimation = () => {
    lastAnimRef.current?.cancel()
    lastAnimRef.current = document.documentElement.animate(
      [
        {transform: 'translateY(var(--intercalaire-rect-top, 100vh))'},
        {transform: 'translateY(0)'},
      ],
      {
        duration: VT_DURATION_MS,
        easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
        fill: 'forwards',
        pseudoElement: '::view-transition-new(root)',
      },
    )
    return lastAnimRef.current
  }

  const closeToHomeAnimation = () => {
    lastAnimRef.current?.cancel()
    lastAnimRef.current = document.documentElement.animate(
      [{transform: 'translateY(0)'}, {transform: 'translateY(calc(100% - var(--home-nav-h)))'}],
      {
        duration: VT_DURATION_MS,
        delay: 0, // Right tabs already slid down during prep phase
        easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
        fill: 'forwards',
        pseudoElement: '::view-transition-old(root)',
      },
    )
    return lastAnimRef.current
  }

  const sectionSwitchAnimation = () => {
    lastAnimRef.current?.cancel()

    // Old section slides down (behind)
    document.documentElement.animate(
      [{transform: 'translateY(0)'}, {transform: 'translateY(100%)'}],
      {
        duration: VT_DURATION_MS,
        easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
        fill: 'both',
        pseudoElement: '::view-transition-old(root)',
      },
    )

    // New section slides up (on top)
    lastAnimRef.current = document.documentElement.animate(
      [
        {transform: 'translateY(var(--intercalaire-rect-top, 100vh))'},
        {transform: 'translateY(0)'},
      ],
      {
        duration: VT_DURATION_MS,
        easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
        fill: 'both',
        pseudoElement: '::view-transition-new(root)',
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
      clearTransitionClasses()
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
      clearTransitionClasses()
      window.location.assign(to)
    }

    return navId
  }

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)

    if (e.defaultPrevented) return
    const isDesktop =
      typeof window !== 'undefined' && window.matchMedia('(min-width: 83rem)').matches
    const isDesktopIntercalaire = intercalaire && isDesktop

    if (isDesktopIntercalaire) {
      clearIntercalaireCommit()
      armIntercalaireCommit(e.currentTarget)
    }

    // HOME -> SECTION (legacy full-page slide)
    if (pathname === '/' && href !== '/') {
      e.preventDefault()
      clearTransitionClasses()

      // Mark entrance complete so it never replays
      document.documentElement.classList.add('intercalaire-entered')

      // Store active section index for right-tab stagger on section page
      const sectionOrder = [
        'psst',
        'database',
        'resources',
        'pssound-system',
        'workshops',
        'events',
        'archive',
      ]
      const targetSection = href.split('/').filter(Boolean)[0] || ''
      const activeIdx = sectionOrder.indexOf(targetSection)
      if (activeIdx !== -1) {
        document.documentElement.style.setProperty('--active-section-index', String(activeIdx))
      }

      if (isDesktopIntercalaire) {
        armIntercalaireCommit(e.currentTarget)

        // Wait for the right tabs to slide down before taking the view transition snapshot
        setTimeout(() => {
          document.documentElement.classList.add('vt-open')
          safePush(href, () => {
            const anim = openFromHomeAnimation()
            const cleanup = () => {
              if (document.documentElement.classList.contains('vt-open')) {
                document.documentElement.classList.remove('vt-open')
              }
              clearIntercalaireCommit()
            }
            anim?.finished?.then(cleanup).catch(cleanup)
          })
        }, 350)
        return
      }

      if (intercalaire && isDesktop) document.documentElement.classList.add('vt-open')
      safePush(href, () => {
        const anim = openFromHomeAnimation()
        const cleanup = () => {
          if (document.documentElement.classList.contains('vt-open')) {
            document.documentElement.classList.remove('vt-open')
          }
          clearIntercalaireCommit()
        }
        anim?.finished?.then(cleanup).catch(cleanup)
      })
      return
    }

    // SECTION -> HOME (legacy full-page slide)
    if (pathname !== '/' && href === '/') {
      e.preventDefault()
      clearTransitionClasses()

      const closingSection = pathname.split('/').filter(Boolean)[0] || ''
      document.documentElement.dataset.closingSection = closingSection

      // Store closing section index for staggered right-tab reappearance
      const sectionOrder = [
        'psst',
        'database',
        'resources',
        'pssound-system',
        'workshops',
        'events',
        'archive',
      ]
      const closingIdx = sectionOrder.indexOf(closingSection)
      if (closingIdx !== -1) {
        document.documentElement.style.setProperty('--closing-section-index', String(closingIdx))
      }

      // Phase 1: slide right tabs down on the SECTION page before snapshotting
      document.documentElement.classList.add('vt-close-prep')

      // Wait for right tabs to finish sliding down, then start the view transition
      setTimeout(() => {
        document.documentElement.classList.remove('vt-close-prep')
        document.documentElement.classList.add('vt-close')

        safePush('/', (navId) => {
          const anim = closeToHomeAnimation()

          const done = () => {
            // only remove if this is still the latest nav
            if (navIdRef.current !== navId) return
            if (document.documentElement.classList.contains('vt-close')) {
              document.documentElement.classList.remove('vt-close')
            }

            setTimeout(() => {
              delete document.documentElement.dataset.closingSection
              document.documentElement.style.removeProperty('--closing-section-index')
            }, 500) // allow the other tabs to slide up smoothly
          }

          anim?.finished?.then(done).catch(done)
        })
      }, 380) // slightly longer than the 350ms right-tab slide-down

      return
    }

    // SECTION -> SECTION (intercalaire switch on desktop)
    if (pathname !== '/' && href !== '/' && isDesktopIntercalaire) {
      e.preventDefault()
      clearTransitionClasses()

      // Mark entrance complete so it never replays
      document.documentElement.classList.add('intercalaire-entered')

      // Store active section index for right-tab stagger on new section page
      const sectionOrder = [
        'psst',
        'database',
        'resources',
        'pssound-system',
        'workshops',
        'events',
        'archive',
      ]
      const targetSection = href.split('/').filter(Boolean)[0] || ''
      const activeIdx = sectionOrder.indexOf(targetSection)
      if (activeIdx !== -1) {
        document.documentElement.style.setProperty('--active-section-index', String(activeIdx))
      }

      // Wait for commit animation (right tabs slide down) then start transition
      setTimeout(() => {
        // DON'T add vt-section-switch yet — the old snapshot must be captured
        // with opaque backgrounds. We add it inside onTransitionReady, which
        // fires after snapshots are taken but before the first paint.
        safePush(href, (navId) => {
          // Now both snapshots are captured; add the class so CSS rules
          // match the view-transition pseudo-elements from the first frame.
          document.documentElement.classList.add('vt-section-switch')

          const anim = sectionSwitchAnimation()

          const cleanup = () => {
            if (navIdRef.current !== navId) return
            if (document.documentElement.classList.contains('vt-section-switch')) {
              document.documentElement.classList.remove('vt-section-switch')
            }
            clearIntercalaireCommit()
          }

          anim?.finished?.then(cleanup).catch(cleanup)
        })
      }, 350)

      return
    }
  }

  return (
    <Link
      href={href}
      prefetch={prefetch}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={className}
      style={style}
      aria-label={ariaLabel}
      data-section-slug={dataSectionSlug}
      data-tab-side={dataTabSide}
    >
      {children}
    </Link>
  )
}
