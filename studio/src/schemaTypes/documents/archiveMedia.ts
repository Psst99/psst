import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'archiveMedia',
  title: 'Archive Media',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) =>
        Rule.min(1900).max(new Date().getFullYear()).warning('Double-check the year'),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'archiveTag'}]}],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      subtitle: 'year',
    },
  },
})
