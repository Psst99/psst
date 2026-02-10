'use client'

import React, {createContext, useCallback, useEffect, useMemo, useState} from 'react'
import type {ThemeOverrides} from '@/lib/theme/sections'

export type ThemeMode = 'brand' | 'accessible'

type ThemeContextValue = {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggle: () => void
  rounded: boolean
  setRounded: (rounded: boolean) => void
  toggleRounded: () => void
  themeOverrides?: ThemeOverrides
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

const THEME_STORAGE_KEY = 'psst-theme-mode'
const ROUNDED_STORAGE_KEY = 'psst-rounded-corners'

export default function ThemeProvider({
  children,
  themeOverrides,
}: {
  children: React.ReactNode
  themeOverrides?: ThemeOverrides
}) {
  const [mode, setModeState] = useState<ThemeMode>('brand')
  const [rounded, setRoundedState] = useState<boolean>(true)

  const applyToDom = useCallback((nextMode: ThemeMode) => {
    document.documentElement.dataset.theme = nextMode
  }, [])

  const applyRoundedToDom = useCallback((nextRounded: boolean) => {
    document.documentElement.dataset.rounded = nextRounded ? 'true' : 'false'
  }, [])

  const setMode = useCallback(
    (next: ThemeMode) => {
      setModeState(next)
      applyToDom(next)
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next)
      } catch {}
    },
    [applyToDom],
  )

  const setRounded = useCallback(
    (next: boolean) => {
      setRoundedState(next)
      applyRoundedToDom(next)
      try {
        localStorage.setItem(ROUNDED_STORAGE_KEY, String(next))
      } catch {}
    },
    [applyRoundedToDom],
  )

  const toggle = useCallback(() => {
    setModeState((prev) => {
      const next: ThemeMode = prev === 'brand' ? 'accessible' : 'brand'
      applyToDom(next)
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next)
      } catch {}
      return next
    })
  }, [applyToDom])

  const toggleRounded = useCallback(() => {
    setRoundedState((prev) => {
      const next = !prev
      applyRoundedToDom(next)
      try {
        localStorage.setItem(ROUNDED_STORAGE_KEY, String(next))
      } catch {}
      return next
    })
  }, [applyRoundedToDom])

  useEffect(() => {
    let initialMode: ThemeMode = 'brand'
    let initialRounded = true
    try {
      const storedMode = localStorage.getItem(THEME_STORAGE_KEY)
      if (storedMode === 'brand' || storedMode === 'accessible') initialMode = storedMode

      const storedRounded = localStorage.getItem(ROUNDED_STORAGE_KEY)
      if (storedRounded !== null) initialRounded = storedRounded === 'true'
    } catch {}
    setModeState(initialMode)
    setRoundedState(initialRounded)
    applyToDom(initialMode)
    applyRoundedToDom(initialRounded)
  }, [applyToDom, applyRoundedToDom])

  const value = useMemo(
    () => ({mode, setMode, toggle, rounded, setRounded, toggleRounded, themeOverrides}),
    [mode, setMode, toggle, rounded, setRounded, toggleRounded, themeOverrides],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
