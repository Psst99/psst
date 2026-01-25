'use client'

import React, {createContext, useCallback, useEffect, useMemo, useState} from 'react'

export type ThemeMode = 'brand' | 'accessible'

type ThemeContextValue = {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggle: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'psst-theme-mode'

export default function ThemeProvider({children}: {children: React.ReactNode}) {
  const [mode, setModeState] = useState<ThemeMode>('brand')

  const applyToDom = useCallback((next: ThemeMode) => {
    document.documentElement.dataset.theme = next
  }, [])

  const setMode = useCallback(
    (next: ThemeMode) => {
      setModeState(next)
      applyToDom(next)
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {}
    },
    [applyToDom],
  )

  const toggle = useCallback(() => {
    setModeState((prev) => {
      const next: ThemeMode = prev === 'brand' ? 'accessible' : 'brand'
      applyToDom(next)
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {}
      return next
    })
  }, [applyToDom])

  useEffect(() => {
    let initial: ThemeMode = 'brand'
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'brand' || stored === 'accessible') initial = stored
    } catch {}
    setModeState(initial)
    applyToDom(initial)
  }, [applyToDom])

  const value = useMemo(() => ({mode, setMode, toggle}), [mode, setMode, toggle])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
