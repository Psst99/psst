// config/sections.ts
export type SectionConfig = {
  name: string
  slug: string
  colors: {
    background: string
    border: string
    text: string
    accent: string
  }
  hasSubNavigation?: boolean
  subNavItems?: Array<{
    label: string
    href: string
  }>
  mobileColors?: {
    active: string
    inactive: string
    headerBg: string
    headerText: string
    headerBorder: string
    hamburgerBorder: string
    buttonBg: string
    buttonText: string
  }
}

export const SECTIONS: Record<string, SectionConfig> = {
  home: {
    name: 'HOME',
    slug: 'home',
    colors: {
      background: '#FFFFFF',
      border: '#000000',
      text: '#000000',
      accent: '#DFFF3D',
    },
  },
  psst: {
    name: 'PSST',
    slug: 'psst',
    colors: {
      background: '#DFFF3D',
      border: '#A20018',
      text: '#A20018',
      accent: '#DFFF3D',
    },
  },
  database: {
    name: 'DATABASE',
    slug: 'database',
    colors: {
      background: '#D3CD7F',
      border: '#6600FF',
      text: '#6600FF',
      accent: '#D3CD7F',
    },
    hasSubNavigation: true,
    subNavItems: [
      { label: 'Browse', href: '/database' },
      { label: 'Register', href: '/database/register' },
      { label: 'Guidelines', href: '/database/guidelines' },
    ],
    mobileColors: {
      active: 'bg-[#d3cd7f] text-[#6600ff] border-[#6600ff]',
      inactive: 'bg-[#6600ff] text-[#d3cd7f] border-[#d3cd7f]',
      headerBg: 'bg-[#D3CD7F]',
      headerText: 'text-[#6600ff]',
      headerBorder: 'border-[#6600ff]',
      hamburgerBorder: 'border-[#D3CD7F]',
      buttonBg: 'bg-[#6600ff]',
      buttonText: 'text-[#D3CD7F]',
    },
  },
  workshops: {
    name: 'WORKSHOPS',
    slug: 'workshops',
    colors: {
      background: '#D2D2D2',
      border: '#F50806',
      text: '#F50806',
      accent: '#D2D2D2',
    },
    hasSubNavigation: true,
    subNavItems: [
      { label: 'Browse', href: '/workshops' },
      // { label: 'Register', href: '/workshops/register' },
    ],
    mobileColors: {
      active: 'bg-[#D2D2D2] text-[#f50806] border-[#f50806]',
      inactive: 'bg-[#f50806] text-[#D2D2D2] border-[#D2D2D2]',
      headerBg: 'bg-[#D2D2D2]',
      headerText: 'text-[#f50806]',
      headerBorder: 'border-[#f50806]',
      hamburgerBorder: 'border-[#D2D2D2]',
      buttonBg: 'bg-[#f50806]',
      buttonText: 'text-[#D2D2D2]',
    },
  },
  events: {
    name: 'EVENTS',
    slug: 'events',
    colors: {
      background: '#00FFDD',
      border: '#4E4E4E',
      text: '#4E4E4E',
      accent: '#00FFDD',
    },
  },
  'pssound-system': {
    name: 'PSSOUND SYSTEM',
    slug: 'pssound-system',
    colors: {
      background: '#81520A',
      border: '#07F25B',
      text: '#07F25B',
      accent: '#81520A',
    },
    hasSubNavigation: true,
    subNavItems: [
      { label: 'Calendar', href: '/pssound-system' },
      { label: 'Request', href: '/pssound-system/request' },
      { label: 'Guidelines', href: '/pssound-system/guidelines' },
    ],
  },
  resources: {
    name: 'RESOURCES',
    slug: 'resources',
    colors: {
      background: '#FE93E7',
      border: '#1D53FF',
      text: '#1D53FF',
      accent: '#FE93E7',
    },
  },
  archive: {
    name: 'ARCHIVE',
    slug: 'archive',
    colors: {
      background: '#81520A',
      border: '#FFCC00',
      text: '#FFCC00',
      accent: '#81520A',
    },
  },
} as const

export type SectionSlug = keyof typeof SECTIONS
