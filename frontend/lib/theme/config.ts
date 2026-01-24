import {SECTION_COLORS, type SectionSlug} from './colors'

export interface SectionConfig {
  name: string
  slug: SectionSlug
  theme: (typeof SECTION_COLORS)[SectionSlug]
  navigation?: {
    hasSubNav: boolean
    items?: Array<{
      label: string
      href: string
    }>
  }
}

export const SECTIONS: Record<SectionSlug, SectionConfig> = {
  home: {
    name: 'HOME',
    slug: 'home',
    theme: SECTION_COLORS.home,
  },
  psst: {
    name: 'PSST',
    slug: 'psst',
    theme: SECTION_COLORS.psst,
  },
  database: {
    name: 'DATABASE',
    slug: 'database',
    theme: SECTION_COLORS.database,
    navigation: {
      hasSubNav: true,
      items: [
        {label: 'Browse', href: '/database'},
        {label: 'Register', href: '/database/submit'},
        {label: 'Guidelines', href: '/database/guidelines'},
      ],
    },
  },
  workshops: {
    name: 'WORKSHOPS',
    slug: 'workshops',
    theme: SECTION_COLORS.workshops,
    navigation: {
      hasSubNav: true,
      items: [
        {label: 'Browse', href: '/workshops'},
        {label: 'Register', href: '/workshops/register'},
      ],
    },
  },
  events: {
    name: 'EVENTS',
    slug: 'events',
    theme: SECTION_COLORS.events,
  },
  'pssound-system': {
    name: 'PSSOUND SYSTEM',
    slug: 'pssound-system',
    theme: SECTION_COLORS['pssound-system'],
    navigation: {
      hasSubNav: true,
      items: [
        {label: 'Calendar', href: '/pssound-system'},
        {label: 'Request', href: '/pssound-system/request'},
        {label: 'Guidelines', href: '/pssound-system/guidelines'},
      ],
    },
  },
  resources: {
    name: 'RESOURCES',
    slug: 'resources',
    theme: SECTION_COLORS.resources,
  },
  archive: {
    name: 'ARCHIVE',
    slug: 'archive',
    theme: SECTION_COLORS.archive,
  },
}
