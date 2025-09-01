import {defineField, defineType} from 'sanity'

export const eventsPage = defineType({
  name: 'eventsPage',
  title: 'Events',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'about',
      title: 'About Events',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Events',
      }
    },
  },
})
