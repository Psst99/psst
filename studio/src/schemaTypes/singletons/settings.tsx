import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import * as demo from '../../lib/initialValues'

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
    type: 'color',
    description,
    initialValue: {
      _type: 'color',
      hex: value,
    },
  })

/**
 * Settings schema Singleton.  Singletons are single documents that are displayed not in a collection, handy for things like site settings and other global configurations.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      description: 'This field is the title of your website.',
      title: 'Title',
      type: 'string',
      initialValue: demo.title,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      description: 'Used both for the <meta> description tag for SEO, and the website subheader.',
      title: 'Description',
      type: 'array',
      initialValue: demo.description,
      of: [
        // Define a minified block content field for the description. https://www.sanity.io/docs/block-content
        defineArrayMember({
          type: 'block',
          options: {},
          styles: [],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              defineField({
                type: 'object',
                name: 'link',
                fields: [
                  {
                    type: 'string',
                    name: 'href',
                    title: 'URL',
                    validation: (rule) => rule.required(),
                  },
                ],
              }),
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Displayed on social cards and search engine results.',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        defineField({
          name: 'alt',
          description: 'Important for accessibility and SEO.',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.ogImage as any)?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        }),
        defineField({
          name: 'metadataBase',
          type: 'url',
          description: (
            <a
              href="https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase"
              rel="noreferrer noopener"
            >
              More information
            </a>
          ),
        }),
      ],
    }),
    defineField({
      name: 'soundcloudPlaylistUrl',
      title: 'SoundCloud Playlist URL',
      type: 'url',
      description:
        'Paste the full SoundCloud playlist link here (e.g. https://soundcloud.com/youruser/sets/yourplaylist)',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'theme',
      title: 'Theme (legacy)',
      type: 'object',
      hidden: true,
      readOnly: true,
      fields: [
        defineField({
          name: 'sectionColors',
          title: 'Section colors',
          type: 'object',
          description:
            'Set per-section background and foreground colors. These drive --section-bg/--section-fg and panel colors.',
          fields: [
            defineField({
              name: 'home',
              title: 'Home',
              type: 'object',
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
    }),
    defineField({
      name: 'support',
      title: 'Support Modal',
      type: 'object',
      description: 'Controls the floating support button and modal copy site-wide.',
      fields: [
        defineField({
          name: 'floatingButtonLabel',
          title: 'Floating button label',
          type: 'text',
          rows: 2,
          initialValue: 'Make a donation\n+ newsletter',
        }),
        defineField({
          name: 'modalTitle',
          title: 'Modal title',
          type: 'string',
          initialValue: 'Support PSST',
        }),
        defineField({
          name: 'modalSubtitle',
          title: 'Modal subtitle',
          type: 'blockContent',
          description: 'Optional rich text shown under the title.',
        }),
        defineField({
          name: 'shareButtonLabel',
          title: 'Share button label',
          type: 'string',
          initialValue: 'Share',
        }),
        defineField({
          name: 'donationTabLabel',
          title: 'Donation tab label',
          type: 'string',
          initialValue: 'Make a donation',
        }),
        defineField({
          name: 'newsletterTabLabel',
          title: 'Newsletter tab label',
          type: 'string',
          initialValue: 'Newsletter',
        }),
        defineField({
          name: 'donationIntro',
          title: 'Donation intro',
          type: 'blockContent',
          description: 'Optional rich text shown above the donation form.',
        }),
        defineField({
          name: 'newsletterIntro',
          title: 'Newsletter intro',
          type: 'blockContent',
          description: 'Optional rich text shown above the newsletter form.',
        }),
        defineField({
          name: 'donationSubmitLabel',
          title: 'Donation submit label',
          type: 'string',
          initialValue: 'Continue to payment',
        }),
        defineField({
          name: 'newsletterSubmitLabel',
          title: 'Newsletter submit label',
          type: 'string',
          initialValue: 'Subscribe',
        }),
        defineField({
          name: 'donationSuccessMessage',
          title: 'Donation success message',
          type: 'string',
          initialValue: 'Donation payment completed. Thank you for supporting PSST.',
        }),
        defineField({
          name: 'newsletterSuccessMessage',
          title: 'Newsletter success message',
          type: 'string',
          initialValue: 'Thanks, you are subscribed.',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Settings',
      }
    },
  },
})
