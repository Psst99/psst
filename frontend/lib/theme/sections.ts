export const SECTION_COLORS = {
  home: {a: '#000000', b: '#FFFFFF'},
  psst: {a: '#DFFF3D', b: '#A20018'},
  database: {a: '#6600FF', b: '#D3CD7F'},
  workshops: {a: '#F50806', b: '#D2D2D2'},
  events: {a: '#00FFDD', b: '#4E4E4E'},
  'pssound-system': {a: '#07F25B', b: '#81520A'},
  resources: {a: '#FE93E7', b: '#1D53FF'},
  archive: {a: '#81520A', b: '#FFCC00'},
  newsletter: {a: '#D2D2D2', b: '#1D53FF'},
} as const

export const ACCESSIBLE_COLORS = {
  home: {a: '#FFFFFF', b: '#111111'},
  // Deliberate grayscale steps to avoid a flat "all light gray" accessible mode.
  // Approx tonal steps from ~10% to ~35% black on white.
  psst: {a: '#E8E8E8', b: '#111111'},
  database: {a: '#DDDDDD', b: '#111111'},
  workshops: {a: '#D2D2D2', b: '#111111'},
  events: {a: '#C7C7C7', b: '#111111'},
  'pssound-system': {a: '#BCBCBC', b: '#111111'},
  resources: {a: '#B1B1B1', b: '#111111'},
  archive: {a: '#A6A6A6', b: '#111111'},
  newsletter: {a: '#9B9B9B', b: '#111111'},
} as const

export const MAIN_SECTIONS = [
  'psst',
  'database',
  'workshops',
  'events',
  'pssound-system',
  'resources',
  'archive',
] as const

export type SectionSlug = keyof typeof SECTION_COLORS
export type MainSectionSlug = (typeof MAIN_SECTIONS)[number]

export type SectionThemeOverride = {
  sectionBg?: string
  sectionFg?: string
}

export type ThemeOverrides = Partial<Record<SectionSlug, SectionThemeOverride>>

export const SECTIONS: Record<
  SectionSlug,
  {
    label: string
    slug: SectionSlug
    nav?: Array<{label: string; href: string}>
  }
> = {
  home: {label: 'HOME', slug: 'home'},
  psst: {label: 'PSƧT', slug: 'psst'},
  database: {
    label: 'DATABASE',
    slug: 'database',
    nav: [
      {label: 'Browse', href: '/database'},
      {label: 'Register', href: '/database/submit'},
      {label: 'Guidelines', href: '/database/guidelines'},
    ],
  },
  workshops: {
    label: 'WORKSHOPS',
    slug: 'workshops',
    nav: [
      {label: 'Browse', href: '/workshops'},
      {label: 'Register', href: '/workshops/register'},
    ],
  },
  events: {label: 'EVENTS', slug: 'events'},
  'pssound-system': {
    label: 'PSƧOUND SYSTEM',
    slug: 'pssound-system',
    nav: [
      {label: 'Calendar', href: '/pssound-system'},
      {label: 'Request', href: '/pssound-system/request'},
      {label: 'Guidelines', href: '/pssound-system/guidelines'},
    ],
  },
  resources: {label: 'RESOURCES', slug: 'resources'},
  archive: {label: 'ARCHIVE', slug: 'archive'},
  newsletter: {label: 'NEWSLETTER', slug: 'newsletter'},
}

export type ThemeMode = 'brand' | 'accessible'

export function getPalette(mode: ThemeMode) {
  return mode === 'accessible' ? ACCESSIBLE_COLORS : SECTION_COLORS
}

export function getTheme(slug: SectionSlug, mode: ThemeMode, overrides?: ThemeOverrides) {
  const palette = getPalette(mode)
  const {a, b} = palette[slug]
  const override = mode === 'accessible' ? undefined : overrides?.[slug]

  return {bg: override?.sectionBg ?? a, fg: override?.sectionFg ?? b}
}

export function getPageTheme(slug: SectionSlug, mode: ThemeMode, overrides?: ThemeOverrides) {
  return getTheme(slug, mode, overrides)
}

export function getTabTheme(slug: SectionSlug, mode: ThemeMode, overrides?: ThemeOverrides) {
  return getTheme(slug, mode, overrides)
}
