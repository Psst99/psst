import {CogIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

const DEFAULT_SECTION_COLORS = {
  home: {background: '#FFFFFF', foreground: '#000000'},
  psst: {background: '#DFFF3D', foreground: '#A20018'},
  database: {background: '#D3CD7F', foreground: '#6600FF'},
  workshops: {background: '#D2D2D2', foreground: '#F50806'},
  events: {background: '#00FFDD', foreground: '#4E4E4E'},
  pssoundSystem: {background: '#81520A', foreground: '#07F25B'},
  resources: {background: '#FE93E7', foreground: '#1D53FF'},
  archive: {background: '#81520A', foreground: '#FFCC00'},
} as const

const makeColorField = (name: string, title: string, value: string, description: string) =>
  defineField({
    name,
    title,
    type: 'string',
    description,
    initialValue: value,
    validation: (rule) =>
      rule.required().regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, {
        name: 'hex color',
        invert: false,
      }),
  })

export const themeSettings = defineType({
  name: 'themeSettings',
  title: 'Theme settings',
  type: 'document',
  icon: CogIcon,
  initialValue: {
    sectionColors: {
      home: {
        background: DEFAULT_SECTION_COLORS.home.background,
        foreground: DEFAULT_SECTION_COLORS.home.foreground,
      },
      psst: {
        background: DEFAULT_SECTION_COLORS.psst.background,
        foreground: DEFAULT_SECTION_COLORS.psst.foreground,
      },
      database: {
        background: DEFAULT_SECTION_COLORS.database.background,
        foreground: DEFAULT_SECTION_COLORS.database.foreground,
      },
      workshops: {
        background: DEFAULT_SECTION_COLORS.workshops.background,
        foreground: DEFAULT_SECTION_COLORS.workshops.foreground,
      },
      events: {
        background: DEFAULT_SECTION_COLORS.events.background,
        foreground: DEFAULT_SECTION_COLORS.events.foreground,
      },
      pssoundSystem: {
        background: DEFAULT_SECTION_COLORS.pssoundSystem.background,
        foreground: DEFAULT_SECTION_COLORS.pssoundSystem.foreground,
      },
      resources: {
        background: DEFAULT_SECTION_COLORS.resources.background,
        foreground: DEFAULT_SECTION_COLORS.resources.foreground,
      },
      archive: {
        background: DEFAULT_SECTION_COLORS.archive.background,
        foreground: DEFAULT_SECTION_COLORS.archive.foreground,
      },
    },
  },
  fields: [
    defineField({
      name: 'sectionColors',
      title: 'Section colors',
      type: 'object',
      description:
        'Set per-section background and foreground colors. Used by the website runtime theme.',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'home',
          title: 'Home',
          type: 'object',
          options: {
            collapsible: true,
            collapsed: false,
          },
          fields: [
            makeColorField(
              'background',
              'Background',
              DEFAULT_SECTION_COLORS.home.background,
              'Hex color (e.g. #FFFFFF).',
            ),
            makeColorField(
              'foreground',
              'Foreground',
              DEFAULT_SECTION_COLORS.home.foreground,
              'Hex color (e.g. #000000).',
            ),
          ],
        }),
        defineField({
          name: 'psst',
          title: 'PSST',
          type: 'object',
          options: {
            collapsible: true,
            collapsed: false,
          },
          fields: [
            makeColorField(
              'background',
              'Background',
              DEFAULT_SECTION_COLORS.psst.background,
              'Hex color (e.g. #DFFF3D).',
            ),
            makeColorField(
              'foreground',
              'Foreground',
              DEFAULT_SECTION_COLORS.psst.foreground,
              'Hex color (e.g. #A20018).',
            ),
          ],
        }),
        defineField({
          name: 'database',
          title: 'Database',
          type: 'object',
          options: {
            collapsible: true,
            collapsed: false,
          },
          fields: [
            makeColorField(
              'background',
              'Background',
              DEFAULT_SECTION_COLORS.database.background,
              'Hex color (e.g. #D3CD7F).',
            ),
            makeColorField(
              'foreground',
              'Foreground',
              DEFAULT_SECTION_COLORS.database.foreground,
              'Hex color (e.g. #6600FF).',
            ),
          ],
        }),
        defineField({
          name: 'workshops',
          title: 'Workshops',
          type: 'object',
          options: {
            collapsible: true,
            collapsed: false,
          },
          fields: [
            makeColorField(
              'background',
              'Background',
              DEFAULT_SECTION_COLORS.workshops.background,
              'Hex color (e.g. #D2D2D2).',
            ),
            makeColorField(
              'foreground',
              'Foreground',
              DEFAULT_SECTION_COLORS.workshops.foreground,
              'Hex color (e.g. #F50806).',
            ),
          ],
        }),
        defineField({
          name: 'events',
          title: 'Events',
          type: 'object',
          options: {
            collapsible: true,
            collapsed: false,
          },
          fields: [
            makeColorField(
              'background',
              'Background',
              DEFAULT_SECTION_COLORS.events.background,
              'Hex color (e.g. #00FFDD).',
            ),
            makeColorField(
              'foreground',
              'Foreground',
              DEFAULT_SECTION_COLORS.events.foreground,
              'Hex color (e.g. #4E4E4E).',
            ),
          ],
        }),
        defineField({
          name: 'pssoundSystem',
          title: 'PSSound System',
          type: 'object',
          options: {
            collapsible: true,
            collapsed: false,
          },
          fields: [
            makeColorField(
              'background',
              'Background',
              DEFAULT_SECTION_COLORS.pssoundSystem.background,
              'Hex color (e.g. #81520A).',
            ),
            makeColorField(
              'foreground',
              'Foreground',
              DEFAULT_SECTION_COLORS.pssoundSystem.foreground,
              'Hex color (e.g. #07F25B).',
            ),
          ],
        }),
        defineField({
          name: 'resources',
          title: 'Resources',
          type: 'object',
          options: {
            collapsible: true,
            collapsed: false,
          },
          fields: [
            makeColorField(
              'background',
              'Background',
              DEFAULT_SECTION_COLORS.resources.background,
              'Hex color (e.g. #FE93E7).',
            ),
            makeColorField(
              'foreground',
              'Foreground',
              DEFAULT_SECTION_COLORS.resources.foreground,
              'Hex color (e.g. #1D53FF).',
            ),
          ],
        }),
        defineField({
          name: 'archive',
          title: 'Archive',
          type: 'object',
          options: {
            collapsible: true,
            collapsed: false,
          },
          fields: [
            makeColorField(
              'background',
              'Background',
              DEFAULT_SECTION_COLORS.archive.background,
              'Hex color (e.g. #81520A).',
            ),
            makeColorField(
              'foreground',
              'Foreground',
              DEFAULT_SECTION_COLORS.archive.foreground,
              'Hex color (e.g. #FFCC00).',
            ),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Theme settings',
      }
    },
  },
})
