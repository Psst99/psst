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

export function getTheme(slug: SectionSlug) {
  const {a, b} = SECTION_COLORS[slug]
  return {bg: a, fg: b}
}

export const getPageTheme = getTheme
export const getTabTheme = getTheme
