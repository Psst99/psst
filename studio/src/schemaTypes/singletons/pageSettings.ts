import {defineField, defineType} from 'sanity'

export const pageSettings = defineType({
  name: 'pageSettings',
  title: 'Page settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Page description',
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
        title: 'Page settings',
      }
    },
  },
})
