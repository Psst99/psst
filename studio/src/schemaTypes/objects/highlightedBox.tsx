import {defineType, defineField} from 'sanity'
import {colorOptions} from '../../lib/theme'

export const highlightedBox = defineType({
  name: 'highlightedBox',
  title: 'Highlighted Box',
  type: 'object',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Heading', value: 'h2'},
            {title: 'Paragraph', value: 'normal'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [
              {type: 'textColor'},
              {type: 'highlightColor'},
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'linkType',
                    type: 'string',
                    title: 'Link Type',
                    options: {
                      list: [
                        {title: 'Internal Page', value: 'internal'},
                        {title: 'External URL', value: 'external'},
                      ],
                      layout: 'radio',
                    },
                    initialValue: 'internal',
                  },
                  {
                    name: 'internalLink',
                    type: 'string',
                    title: 'Internal Page',
                    description: 'e.g., /database, /workshops, /psst/about',
                    hidden: ({parent}) => parent?.linkType !== 'internal',
                  },
                  {
                    name: 'href',
                    type: 'url',
                    title: 'External URL',
                    hidden: ({parent}) => parent?.linkType !== 'external',
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  },
                  {
                    name: 'openInNewTab',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        },
        {type: 'highlightedBox'},
      ],
    }),
    defineField({
      name: 'showHeadingAsTab',
      title: 'Show first heading as tab',
      type: 'boolean',
      initialValue: false,
      description: 'Display the first H2 heading as a file-tab style header above the box',
    }),
    defineField({
      name: 'tabPosition',
      title: 'Tab position',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'left',
      description: 'Position of the tab (only applies when "Show first heading as tab" is enabled)',
      hidden: ({parent}) => !parent?.showHeadingAsTab,
    }),
    defineField({
      name: 'useCustomBgColor',
      title: 'Use custom background color',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle to use a custom background color instead of the section default',
    }),
    defineField({
      name: 'customBgColor',
      title: 'Custom background color',
      type: 'string',
      description: 'Enter a hex color code (e.g., #FF0000 for red)',
      hidden: ({parent}) => !parent?.useCustomBgColor,
      validation: (Rule) =>
        Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
          name: 'hex color',
          invert: false,
        }).warning('Must be a valid hex color (e.g. #FF0000)'),
    }),
    defineField({
      name: 'useCustomTextColor',
      title: 'Use custom text color',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle to use a custom text color instead of the section default',
    }),
    defineField({
      name: 'customTextColor',
      title: 'Custom text color',
      type: 'string',
      description: 'Enter a hex color code (e.g., #FFFFFF for white)',
      hidden: ({parent}) => !parent?.useCustomTextColor,
      validation: (Rule) =>
        Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
          name: 'hex color',
          invert: false,
        }).warning('Must be a valid hex color (e.g. #FFFFFF)'),
    }),
  ],
  preview: {
    select: {
      content: 'content',
    },
    prepare({content}) {
      let title = 'Highlighted Box'
      let subtitle = ''

      if (content && content.length > 0) {
        for (const block of content) {
          if (block._type === 'block') {
            if (block.style === 'h2') {
              // Use the first h2 as title
              title = block.children.map((child: any) => child.text).join('')
              break
            } else if (block.style === 'normal' && !subtitle) {
              // Use the first normal block as subtitle (truncated)
              subtitle =
                block.children
                  .map((child: any) => child.text)
                  .join('')
                  .substring(0, 50) + '...'
            }
          }
        }
      }

      return {
        title,
        subtitle,
      }
    },
  },
})
