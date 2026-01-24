'use client'

import React from 'react'
import type {SectionSlug} from '@/lib/theme/sections'
import {getPageTheme, getTabTheme} from '@/lib/theme/sections'

type Variant = 'page' | 'tab'

type CSSVars = React.CSSProperties & Record<`--${string}`, string>

export default function SectionScope({
  section,
  variant = 'page',
  panelVariant = 'section',
  asChild = false,
  className,
  children,
}: {
  section: SectionSlug
  variant?: Variant
  panelVariant?: 'section' | 'subtab'
  asChild?: boolean
  className?: string
  children: React.ReactNode
}) {
  const theme = variant === 'tab' ? getTabTheme(section) : getPageTheme(section)

  const panelBg = panelVariant === 'subtab' ? theme.fg : theme.bg
  const panelFg = panelVariant === 'subtab' ? theme.bg : theme.fg

  const styleVars: CSSVars = {
    '--section-bg': theme.bg,
    '--section-fg': theme.fg,
    '--panel-bg': panelBg,
    '--panel-fg': panelFg,
  }

  if (asChild) {
    if (!React.isValidElement(children)) {
      throw new Error('SectionScope with asChild expects a single React element child.')
    }

    const child = children as React.ReactElement<{style?: React.CSSProperties; className?: string}>
    const mergedStyle: CSSVars = {
      ...(child.props.style ?? {}),
      ...styleVars,
    }

    const mergedClassName =
      [className, child.props.className].filter(Boolean).join(' ') || undefined

    return React.cloneElement(child, {
      style: mergedStyle,
      className: mergedClassName,
    })
  }

  return (
    <div className={className} style={styleVars}>
      {children}
    </div>
  )
}
