export const SECTION_COLORS = {
  home: {a: '#FFFFFF', b: '#000000'},
  psst: {a: '#DFFF3D', b: '#A20018'},
  database: {a: '#6600FF', b: '#D3CD7F'},
  workshops: {a: '#F50806', b: '#D2D2D2'},
  events: {a: '#00FFDD', b: '#4E4E4E'},
  'pssound-system': {a: '#07F25B', b: '#81520A'},
  resources: {a: '#FE93E7', b: '#1D53FF'},
  archive: {a: '#81520A', b: '#FFCC00'},
} as const

export const ACCESSIBLE_COLORS = {
  home: {a: '#FFFFFF', b: '#111111'},
  psst: {a: '#FFFFFF', b: '#111111'},
  database: {a: '#F6F6F6', b: '#111111'},
  workshops: {a: '#F2F2F2', b: '#111111'},
  events: {a: '#FAFAFA', b: '#111111'},
  'pssound-system': {a: '#F4F4F4', b: '#111111'},
  resources: {a: '#F8F8F8', b: '#111111'},
  archive: {a: '#EFEFEF', b: '#111111'},
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

export const SECTIONS: Record<
  SectionSlug,
  {
    label: string
    slug: SectionSlug
    nav?: Array<{label: string; href: string}>
  }
> = {
  home: {label: 'HOME', slug: 'home'},
  psst: {label: 'PSST', slug: 'psst'},
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
    label: 'PSSOUND SYSTEM',
    slug: 'pssound-system',
    nav: [
      {label: 'Calendar', href: '/pssound-system'},
      {label: 'Request', href: '/pssound-system/request'},
      {label: 'Guidelines', href: '/pssound-system/guidelines'},
    ],
  },
  resources: {label: 'RESOURCES', slug: 'resources'},
  archive: {label: 'ARCHIVE', slug: 'archive'},
}

export type ThemeMode = 'brand' | 'accessible'

export function getPalette(mode: ThemeMode) {
  return mode === 'accessible' ? ACCESSIBLE_COLORS : SECTION_COLORS
}

export function getTheme(slug: SectionSlug, mode: ThemeMode) {
  const palette = getPalette(mode)
  const {a, b} = palette[slug]
  return {bg: a, fg: b}
}

export function getPageTheme(slug: SectionSlug, mode: ThemeMode) {
  return getTheme(slug, mode)
}

export function getTabTheme(slug: SectionSlug, mode: ThemeMode) {
  return getTheme(slug, mode)
}
