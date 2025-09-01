import {defineField, defineType} from 'sanity'

export const psstPage = defineType({
  name: 'psstPage',
  title: 'PSST',
  type: 'document',
  fields: [
    defineField({
      name: 'charter',
      title: 'Charter',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Heading', value: 'h2'},
            {title: 'Paragraph', value: 'normal'},
          ],
          marks: {
            annotations: [{type: 'textColor'}, {type: 'highlightColor'}],
          },
        },
        {type: 'highlightedBox'},
      ],
    }),
    defineField({
      name: 'about',
      title: 'About PSST',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Heading', value: 'h2'},
            {title: 'Paragraph', value: 'normal'},
          ],
          marks: {
            annotations: [{type: 'textColor'}, {type: 'highlightColor'}],
          },
        },
        {type: 'highlightedBox'},
      ],
    }),
    defineField({
      name: 'legal',
      title: 'Legal Mentions',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Heading', value: 'h2'},
            {title: 'Paragraph', value: 'normal'},
          ],
          marks: {
            annotations: [{type: 'textColor'}, {type: 'highlightColor'}],
          },
        },
        {type: 'highlightedBox'},
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'PSST',
      }
    },
  },
})
