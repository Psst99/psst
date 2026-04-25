import {getTheme, type SectionSlug, type ThemeOverrides} from '../theme/sections'
import type {EmailTemplateKey} from './defaults'
import type {EmailTheme} from './types'

const TEMPLATE_SECTION: Record<EmailTemplateKey, SectionSlug> = {
  databaseReceived: 'database',
  databaseApproved: 'database',
  resourceReceived: 'resources',
  resourceApproved: 'resources',
  workshopReceived: 'workshops',
  workshopApproved: 'workshops',
  pssoundRequestReceived: 'pssound-system',
  pssoundRequestApproved: 'pssound-system',
  pssoundMembershipReceived: 'pssound-system',
  pssoundMembershipApproved: 'pssound-system',
}

const TEMPLATE_ACCENT_SOURCE: Record<EmailTemplateKey, 'bg' | 'fg'> = {
  databaseReceived: 'bg',
  databaseApproved: 'bg',
  resourceReceived: 'bg',
  resourceApproved: 'bg',
  workshopReceived: 'bg',
  workshopApproved: 'bg',
  pssoundRequestReceived: 'fg',
  pssoundRequestApproved: 'fg',
  pssoundMembershipReceived: 'fg',
  pssoundMembershipApproved: 'fg',
}

const WHITE = '#FFFFFF'

function clampChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)))
}

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '').trim()
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((part) => `${part}${part}`)
          .join('')
      : normalized

  if (!/^[0-9a-fA-F]{6}$/.test(value)) return null

  const parsed = Number.parseInt(value, 16)
  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  }
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((channel) => clampChannel(channel).toString(16).padStart(2, '0'))
    .join('')}`
}

function mixHex(base: string, blend: string, weight: number) {
  const baseRgb = hexToRgb(base)
  const blendRgb = hexToRgb(blend)
  if (!baseRgb || !blendRgb) return base

  return rgbToHex(
    baseRgb.r * (1 - weight) + blendRgb.r * weight,
    baseRgb.g * (1 - weight) + blendRgb.g * weight,
    baseRgb.b * (1 - weight) + blendRgb.b * weight,
  )
}

export function getEmailSection(key: EmailTemplateKey): SectionSlug {
  return TEMPLATE_SECTION[key]
}

export function createEmailTheme(key: EmailTemplateKey, overrides?: ThemeOverrides): EmailTheme {
  const sectionTheme = getTheme(getEmailSection(key), 'brand', overrides)
  const accent = TEMPLATE_ACCENT_SOURCE[key] === 'fg' ? sectionTheme.fg : sectionTheme.bg

  return {
    shellBg: accent,
    shellFg: WHITE,
    panelBg: WHITE,
    panelFg: accent,
    categoryBg: accent,
    categoryFg: WHITE,
    categoryBorder: accent,
    linkBg: WHITE,
    linkFg: accent,
    linkBorder: accent,
    noticeBg: mixHex(accent, WHITE, 0.92),
    noticeFg: accent,
    noticeBorder: accent,
    disclaimer: 'rgba(255,255,255,0.9)',
    shadow: '0 18px 60px rgba(0,0,0,0.18)',
  }
}
