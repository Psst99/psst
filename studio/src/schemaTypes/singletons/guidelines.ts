import {defineField, defineType} from 'sanity'

export const guidelines = defineType({
  name: 'guidelines',
  title: 'Guidelines',
  type: 'document',
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
            {title: 'Large paragraph', value: 'largeParagraph'},
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
        title: 'Guidelines',
      }
    },
  },
})
