import {defineType, defineField, defineArrayMember} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

export const workshop = defineType({
  name: 'workshop',
  title: 'Workshop',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'workshopTag'}]}],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
        }),
      ],
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
        }),
      ],
    }),
    defineField({
      name: 'totalSpots',
      title: 'Number of Places',
      type: 'number',
      validation: (Rule) => Rule.min(1).required(),
    }),
    // defineField({
    //   name: 'published',
    //   title: 'Published?',
    //   type: 'boolean',
    //   initialValue: false,
    //   description: 'Uncheck to keep the workshop hidden from the public page',
    // }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
    },
    prepare({title, date}) {
      return {
        title,
        subtitle: date ? new Date(date).toLocaleDateString() : 'No date set',
      }
    },
  },
})
