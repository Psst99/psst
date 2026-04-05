import {defineField, defineType} from 'sanity'
import {orderRankField} from '@sanity/orderable-document-list'

const RESERVED_PSSOUND_SLUGS = new Set(['request', 'archive', 'membership'])

export default defineType({
  name: 'pssoundSection',
  title: 'PSƧOUND System Page',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) =>
        Rule.required().custom((value) => {
          const slug = value?.current?.trim().toLowerCase()
          if (!slug) return true
          return RESERVED_PSSOUND_SLUGS.has(slug)
            ? 'This slug is reserved by an existing PSƧOUND System route.'
            : true
        }),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Default', value: 'default'},
          {title: 'Guidelines (Columns)', value: 'guidelines'},
        ],
        layout: 'radio',
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Paragraph', value: 'normal'},
            {title: 'Heading', value: 'h2'},
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
                    description: 'e.g., /database, /workshops, /pssound-system',
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
    orderRankField({type: 'pssoundSection'}),
  ],
})
