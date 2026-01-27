export const sectionThemes = {
  home: {
    bg: '#1D53FF',
    accent: '#07F25B',
    border: '#cccccc',
  },
  psst: {
    bg: '#dfff3d',
    accent: '#A20018',
    border: '#A20018',
  },
  database: {
    bg: '#d3cd7f',
    accent: '#6600ff',
    border: '#6600ff',
  },
  events: {
    bg: '#00ffdd',
    accent: '#4E4E4E',
    border: '#4E4E4E',
  },
  workshops: {
    bg: '#D2D2D2',
    accent: '#F50806',
    border: '#F50806',
  },
  archive: {
    bg: '#81520A',
    accent: '#FFCC00',
    border: '#FFCC00',
  },
  resources: {
    bg: '#1D53FF',
    accent: '#FE93E7',
    border: '#FE93E7',
  },
  'pssound-system': {
    bg: '#81520a',
    accent: '#07f25b',
    border: '#07f25b',
  },
} as const

export const subNavigation = {
  // psst: [
  //   {label: 'About', href: '/psst'},
  //   {label: 'Manifesto', href: '/psst/manifesto'},
  //   {label: 'Acknowledgements', href: '/psst/acknowledgements'},
  // ],
  database: [
    {label: 'Guidelines', href: '/database'},
    {label: 'Browse', href: '/database/browse'},
    {label: 'Submit', href: '/database/submit'},
  ],
  workshops: [
    {label: 'Browse', href: '/workshops'},
    {label: 'Register', href: '/workshops/register'},
  ],
  'pssound-system': [
    {label: 'Manifesto', href: '/pssound-system/manifesto'},
    {label: 'About', href: '/pssound-system'},

    {label: 'Request', href: '/pssound-system/request'},
    // { label: 'Membership', href: '/pssound-system/membership' },
    {label: 'Archive', href: '/pssound-system/archive'},
  ],
  resources: [
    {label: 'Guidelines', href: '/resources'},
    {label: 'Browse', href: '/resources/browse'},
    {label: 'Submit', href: '/resources/submit'},
  ],
} as const

export type SectionKey = keyof typeof sectionThemes
