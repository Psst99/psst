import type {SectionSlug, ThemeOverrides} from './sections'

type ColorValue =
  | string
  | {
      value?: string
      hex?: string
    }

export type ThemeSectionColors = Partial<
  Record<SectionSlug, {background?: ColorValue; foreground?: ColorValue}>
> & {
  pssoundSystem?: {background?: ColorValue; foreground?: ColorValue}
}

const resolveColor = (value?: ColorValue) => {
  if (!value) return undefined
  if (typeof value === 'string') return value
  if (typeof value.value === 'string') return value.value
  if (typeof value.hex === 'string') return value.hex
  return undefined
}

export function buildThemeOverrides(sectionColors?: ThemeSectionColors | null): ThemeOverrides {
  const overrides: ThemeOverrides = {}

  if (!sectionColors) {
    return overrides
  }

  for (const [section, colors] of Object.entries(sectionColors)) {
    const key = (section === 'pssoundSystem' ? 'pssound-system' : section) as SectionSlug
    if (!colors) continue

    overrides[key] = {
      sectionBg: resolveColor(colors.background),
      sectionFg: resolveColor(colors.foreground),
    }
  }

  return overrides
}
