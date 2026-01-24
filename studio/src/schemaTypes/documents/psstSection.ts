import {defineType, defineField} from 'sanity'
import {orderRankField} from '@sanity/orderable-document-list'

export default defineType({
  name: 'psstSection',
  title: 'PSST Section',
  type: 'document',
  fields: [
    orderRankField({type: 'psstSection'}),

    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
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
  ],
})
