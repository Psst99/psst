import {SECTIONS, type SectionConfig} from './config'
import type {SectionSlug} from './colors'

export function getSectionBySlug(slug: SectionSlug): SectionConfig {
  return SECTIONS[slug]
}

export function generateThemeVariables(slug: SectionSlug): Record<string, string> {
  const theme = SECTIONS[slug].theme

  return {
    '--section-bg': theme.background,
    '--section-fg': theme.foreground,
    '--section-accent': theme.accent,
    '--section-border': theme.border,
  }
}

export function getSectionThemeClasses(slug: SectionSlug) {
  const theme = SECTIONS[slug].theme

  return {
    background: `bg-[${theme.background}]`,
    foreground: `text-[${theme.foreground}]`,
    accent: `bg-[${theme.accent}]`,
    border: `border-[${theme.border}]`,
  }
}
