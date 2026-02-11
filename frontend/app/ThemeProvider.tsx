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
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

function writeCookie(key: string, value: string) {
  try {
    document.cookie = `${key}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`
  } catch {}
}

export default function ThemeProvider({
  children,
  themeOverrides,
  initialMode = 'brand',
  initialRounded = true,
}: {
  children: React.ReactNode
  themeOverrides?: ThemeOverrides
  initialMode?: ThemeMode
  initialRounded?: boolean
}) {
  const [mode, setModeState] = useState<ThemeMode>(initialMode)
  const [rounded, setRoundedState] = useState<boolean>(initialRounded)

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
      writeCookie(THEME_STORAGE_KEY, next)
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
      writeCookie(ROUNDED_STORAGE_KEY, String(next))
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
      writeCookie(THEME_STORAGE_KEY, next)
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
      writeCookie(ROUNDED_STORAGE_KEY, String(next))
      return next
    })
  }, [applyRoundedToDom])

  useEffect(() => {
    let resolvedMode: ThemeMode = initialMode
    let resolvedRounded = initialRounded
    try {
      const storedMode = localStorage.getItem(THEME_STORAGE_KEY)
      if (storedMode === 'brand' || storedMode === 'accessible') resolvedMode = storedMode

      const storedRounded = localStorage.getItem(ROUNDED_STORAGE_KEY)
      if (storedRounded !== null) resolvedRounded = storedRounded === 'true'
    } catch {}
    setModeState(resolvedMode)
    setRoundedState(resolvedRounded)
    applyToDom(resolvedMode)
    applyRoundedToDom(resolvedRounded)
    writeCookie(THEME_STORAGE_KEY, resolvedMode)
    writeCookie(ROUNDED_STORAGE_KEY, String(resolvedRounded))
  }, [applyToDom, applyRoundedToDom, initialMode, initialRounded])

  const value = useMemo(
    () => ({mode, setMode, toggle, rounded, setRounded, toggleRounded, themeOverrides}),
    [mode, setMode, toggle, rounded, setRounded, toggleRounded, themeOverrides],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
