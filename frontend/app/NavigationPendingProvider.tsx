'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react'
import {usePathname} from 'next/navigation'
import type {SectionSlug} from '@/lib/theme/sections'
import {getSectionConfig} from '@/lib/route-utils'

type PendingState =
  | {pending: false}
  | {pending: true; href: string; section: SectionSlug; fromSection: SectionSlug}

type Ctx = {
  state: PendingState
  start: (href: string, fromSection?: SectionSlug) => void
  stop: () => void
}

const NavigationPendingContext = createContext<Ctx | null>(null)

export function useNavigationPending() {
  return useContext(NavigationPendingContext)
}

export default function NavigationPendingProvider({children}: {children: React.ReactNode}) {
  const pathname = usePathname()
  const [state, setState] = useState<PendingState>({pending: false})
  const animatingRef = useRef(false)

  const start = useCallback(
    (href: string, fromSection?: SectionSlug) => {
      const {section} = getSectionConfig(href)
      const from = fromSection || getSectionConfig(pathname).section
      setState({pending: true, href, section, fromSection: from})
      animatingRef.current = true
    },
    [pathname],
  )

  const stop = useCallback(() => {
    setState({pending: false})
    animatingRef.current = false
  }, [])

  useEffect(() => {
    // Only clear pending state if we're not actively animating
    if (!animatingRef.current) {
      stop()
    }
  }, [pathname, stop])

  const value = useMemo(() => ({state, start, stop}), [state, start, stop])

  return (
    <NavigationPendingContext.Provider value={value}>{children}</NavigationPendingContext.Provider>
  )
}
