export interface Artist {
  id: string
  name: string
  roles: string[]
  description: string
  tags: string[]
  links: {
    instagram?: string
    soundcloud?: string
  }
}

export const artists: Artist[] = [
  {
    id: 'vica-pacheco',
    name: 'Vica Pacheco',
    roles: ['DJ', 'PRODUCER', 'LIVE ARTIST'],
    description:
      "With this database, we intend to create a tool to not only connect with each other and strengthen our communities, but also to make this unity visible outside of our circles, answering once and for all to the mainstream scenes' argument that we are not numerous or visible enough.",
    tags: ['electronic', 'experimental', 'ambient', 'fourth world'],
    links: {
      instagram: 'https://instagram.com/vica_pacheco',
      soundcloud: 'https://soundcloud.com/vica-pacheco',
    },
  },
  {
    id: 'pied-de-biche',
    name: 'Pied de Biche',
    roles: ['COLLECTIVE'],
    description:
      "With this database, we intend to create a tool to not only connect with each other and strengthen our communities, but also to make this unity visible outside of our circles, answering once and for all to the mainstream scenes' argument that we are not numerous or visible enough.",
    tags: ['scenography', 'costume design', 'experimental'],
    links: {
      instagram: 'https://instagram.com/pied_de_biche',
    },
  },
  {
    id: 'ufia',
    name: 'UFIA',
    roles: ['COLLECTIVE'],
    description:
      "With this database, we intend to create a tool to not only connect with each other and strengthen our communities, but also to make this unity visible outside of our circles, answering once and for all to the mainstream scenes' argument that we are not numerous or visible enough.",
    tags: ['feminist', 'safety', 'protest'],
    links: {
      instagram: 'https://instagram.com/ufia_collective',
    },
  },
  {
    id: 'mika-oki',
    name: 'Mika Oki',
    roles: ['DJ', 'PRODUCER', 'LIVE ARTIST', 'VISUAL ARTIST', 'TECHNICIAN'],
    description:
      "With this database, we intend to create a tool to not only connect with each other and strengthen our communities, but also to make this unity visible outside of our circles, answering once and for all to the mainstream scenes' argument that we are not numerous or visible enough.",
    tags: [
      'video',
      'installations',
      'bass',
      'dancehall',
      'reggaeton',
      'electronic',
      'psst-mlle',
    ],
    links: {
      instagram: 'https://instagram.com/mika_oki',
      soundcloud: 'https://soundcloud.com/mika-oki',
    },
  },
  {
    id: 'blu-samu',
    name: 'Blu Samu',
    roles: ['LIVE ARTIST'],
    description:
      "With this database, we intend to create a tool to not only connect with each other and strengthen our communities, but also to make this unity visible outside of our circles, answering once and for all to the mainstream scenes' argument that we are not numerous or visible enough.",
    tags: ['soul', 'electronic'],
    links: {
      instagram: 'https://instagram.com/blu_samu',
      soundcloud: 'https://soundcloud.com/blu-samu',
    },
  },
  {
    id: 'faustine-duflou',
    name: 'Faustine Duflou',
    roles: ['TECHNICIAN'],
    description:
      "With this database, we intend to create a tool to not only connect with each other and strengthen our communities, but also to make this unity visible outside of our circles, answering once and for all to the mainstream scenes' argument that we are not numerous or visible enough.",
    tags: ['sound engineer'],
    links: {
      instagram: 'https://instagram.com/faustine_duflou',
    },
  },
  {
    id: 'zora-jones',
    name: 'Zora Jones',
    roles: ['DJ', 'PRODUCER'],
    description:
      "With this database, we intend to create a tool to not only connect with each other and strengthen our communities, but also to make this unity visible outside of our circles, answering once and for all to the mainstream scenes' argument that we are not numerous or visible enough.",
    tags: ['experimental', 'club', 'fractal fantasy', 'underground'],
    links: {
      instagram: 'https://instagram.com/zora_jones',
      soundcloud: 'https://soundcloud.com/zora-jones',
    },
  },
  {
    id: 'coucou-chloe',
    name: 'Coucou Chloé',
    roles: ['DJ', 'PRODUCER'],
    description:
      "With this database, we intend to create a tool to not only connect with each other and strengthen our communities, but also to make this unity visible outside of our circles, answering once and for all to the mainstream scenes' argument that we are not numerous or visible enough.",
    tags: ['electro', 'experimental', 'techno', 'french'],
    links: {
      instagram: 'https://instagram.com/coucouchloe',
      soundcloud: 'https://soundcloud.com/coucou-chloe',
    },
  },
  {
    id: 'nkisi',
    name: 'NKISI',
    roles: ['DJ', 'PRODUCER'],
    description:
      "With this database, we intend to create a tool to not only connect with each other and strengthen our communities, but also to make this unity visible outside of our circles, answering once and for all to the mainstream scenes' argument that we are not numerous or visible enough.",
    tags: ['hardcore', 'gqom', 'experimental', 'african'],
    links: {
      instagram: 'https://instagram.com/nkisi_',
      soundcloud: 'https://soundcloud.com/nkisi',
    },
  },
  {
    id: 'dana-ruh',
    name: 'Dana Ruh',
    roles: ['DJ', 'PRODUCER'],
    description:
      "With this database, we intend to create a tool to not only connect with each other and strengthen our communities, but also to make this unity visible outside of our circles, answering once and for all to the mainstream scenes' argument that we are not numerous or visible enough.",
    tags: ['minimal', 'deep house', 'techno'],
    links: {
      instagram: 'https://instagram.com/danaruh',
      soundcloud: 'https://soundcloud.com/dana-ruh',
    },
  },
  {
    id: 'oceanic',
    name: 'Oceanic',
    roles: ['DJ', 'PRODUCER', 'LIVE ARTIST'],
    description:
      "With this database, we intend to create a tool to not only connect with each other and strengthen our communities, but also to make this unity visible outside of our circles, answering once and for all to the mainstream scenes' argument that we are not numerous or visible enough.",
    tags: ['ambient', 'experimental', 'drone', 'healing'],
    links: {
      instagram: 'https://instagram.com/oceanic_music',
      soundcloud: 'https://soundcloud.com/oceanic-music',
    },
  },
  {
    id: 'marie-davidson',
    name: 'Marie Davidson',
    roles: ['DJ', 'PRODUCER', 'LIVE ARTIST'],
    description:
      "With this database, we intend to create a tool to not only connect with each other and strengthen our communities, but also to make this unity visible outside of our circles, answering once and for all to the mainstream scenes' argument that we are not numerous or visible enough.",
    tags: ['techno', 'electro', 'performance', 'canadian'],
    links: {
      instagram: 'https://instagram.com/marie_davidson',
      soundcloud: 'https://soundcloud.com/marie-davidson',
    },
  },
  {
    id: 'jasss',
    name: 'Jasss',
    roles: ['DJ', 'PRODUCER'],
    description:
      "With this database, we intend to create a tool to not only connect with each other and strengthen our communities, but also to make this unity visible outside of our circles, answering once and for all to the mainstream scenes' argument that we are not numerous or visible enough.",
    tags: ['electro', 'experimental', 'acid', 'vienna'],
    links: {
      instagram: 'https://instagram.com/jasss___',
      soundcloud: 'https://soundcloud.com/jasss',
    },
  },
  {
    id: 'lena-willikens',
    name: 'Lena Willikens',
    roles: ['DJ', 'PRODUCER'],
    description:
      "With this database, we intend to create a tool to not only connect with each other and strengthen our communities, but also to make this unity visible outside of our circles, answering once and for all to the mainstream scenes' argument that we are not numerous or visible enough.",
    tags: ['experimental', 'ambient', 'new wave', 'eclectic'],
    links: {
      instagram: 'https://instagram.com/lenawillikens',
      soundcloud: 'https://soundcloud.com/lena-willikens',
    },
  },
  {
    id: 'shygirl',
    name: 'Shygirl',
    roles: ['LIVE ARTIST', 'PRODUCER'],
    description:
      "With this database, we intend to create a tool to not only connect with each other and strengthen our communities, but also to make this unity visible outside of our circles, answering once and for all to the mainstream scenes' argument that we are not numerous or visible enough.",
    tags: ['club', 'experimental', 'pop', 'queer'],
    links: {
      instagram: 'https://instagram.com/shygirl',
      soundcloud: 'https://soundcloud.com/shygirl',
    },
  },
  {
    id: 'anz',
    name: 'Anz',
    roles: ['DJ', 'PRODUCER'],
    description:
      "With this database, we intend to create a tool to not only connect with each other and strengthen our communities, but also to make this unity visible outside of our circles, answering once and for all to the mainstream scenes' argument that we are not numerous or visible enough.",
    tags: ['uk garage', 'jungle', 'bass', 'manchester'],
    links: {
      instagram: 'https://instagram.com/anz',
      soundcloud: 'https://soundcloud.com/anz',
    },
  },
]

export function getArtistById(id: string): Artist | undefined {
  return artists.find((artist) => artist.id === id)
}
