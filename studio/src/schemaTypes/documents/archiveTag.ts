import {defineField, defineType} from 'sanity'

export const archiveTag = defineType({
  name: 'archiveTag',
  title: 'Tag',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Optional: describe what this tag means.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
