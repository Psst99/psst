import {defineField, defineType} from 'sanity'

export const guidelines = defineType({
  name: 'guidelines',
  title: 'Guidelines',
  type: 'document',
  fields: [
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Default', value: 'default'},
          {title: 'Columns (2-column layout)', value: 'columns'},
        ],
        layout: 'radio',
      },
      initialValue: 'columns',
    }),
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
  ],
  preview: {
    prepare() {
      return {
        title: 'Guidelines',
      }
    },
  },
})
