export const SECTION_COLORS = {
  home: {
    background: '#FFFFFF',
    foreground: '#000000',
    accent: '#DFFF3D',
    border: '#000000',
  },
  psst: {
    background: '#DFFF3D',
    foreground: '#A20018',
    accent: '#DFFF3D',
    border: '#A20018',
  },
  database: {
    background: '#D3CD7F',
    foreground: '#6600FF',
    accent: '#D3CD7F',
    border: '#6600FF',
  },
  workshops: {
    background: '#D2D2D2',
    foreground: '#F50806',
    accent: '#D2D2D2',
    border: '#F50806',
  },
  events: {
    background: '#00FFDD',
    foreground: '#4E4E4E',
    accent: '#00FFDD',
    border: '#4E4E4E',
  },
  'pssound-system': {
    background: '#81520A',
    foreground: '#07F25B',
    accent: '#81520A',
    border: '#07F25B',
  },
  resources: {
    background: '#FE93E7',
    foreground: '#1D53FF',
    accent: '#FE93E7',
    border: '#1D53FF',
  },
  archive: {
    background: '#81520A',
    foreground: '#FFCC00',
    accent: '#81520A',
    border: '#FFCC00',
  },
} as const

export type SectionSlug = keyof typeof SECTION_COLORS

export type SectionTheme = (typeof SECTION_COLORS)[SectionSlug]
