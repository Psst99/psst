import {defineField, defineType} from 'sanity'

export const pssoundArchivePage = defineType({
  name: 'pssoundArchivePage',
  title: 'PSSoundArchive',
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
      title: 'About PSSoundArchive',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'PSSoundArchive',
      }
    },
  },
})
