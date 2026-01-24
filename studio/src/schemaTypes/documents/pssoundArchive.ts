import {defineField, defineType} from 'sanity'
import {ArchiveIcon} from '@sanity/icons'

export const pssoundArchive = defineType({
  name: 'pssoundArchive',
  title: 'PSSoundArchive',
  type: 'document',
  icon: ArchiveIcon,
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
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: {type: 'tag'}}],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      date: 'date',
    },
    prepare({title, media, date}) {
      return {
        title,
        subtitle: date ? new Date(date).toLocaleDateString() : 'No date',
        media,
      }
    },
  },
})
