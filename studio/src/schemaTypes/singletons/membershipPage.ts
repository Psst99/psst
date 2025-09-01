import {defineField, defineType} from 'sanity'

export const membershipPage = defineType({
  name: 'membershipPage',
  title: 'Membership',
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
        title: 'Membership',
      }
    },
  },
})
