'use client'

import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {usePathname} from 'next/navigation'
import type {SectionSlug} from '@/lib/theme/sections'
import {getSectionConfig} from '@/lib/route-utils'

type PendingState = {pending: false} | {pending: true; href: string; section: SectionSlug}

type Ctx = {
  state: PendingState
  start: (href: string) => void
  stop: () => void
}

const NavigationPendingContext = createContext<Ctx | null>(null)

export function useNavigationPending() {
  return useContext(NavigationPendingContext)
}

export default function NavigationPendingProvider({children}: {children: React.ReactNode}) {
  const pathname = usePathname()
  const [state, setState] = useState<PendingState>({pending: false})

  const start = useCallback((href: string) => {
    const {section} = getSectionConfig(href)
    setState({pending: true, href, section})
  }, [])

  const stop = useCallback(() => setState({pending: false}), [])

  useEffect(() => {
    stop()
  }, [pathname, stop])

  const value = useMemo(() => ({state, start, stop}), [state, start, stop])

  return (
    <NavigationPendingContext.Provider value={value}>{children}</NavigationPendingContext.Provider>
  )
}
