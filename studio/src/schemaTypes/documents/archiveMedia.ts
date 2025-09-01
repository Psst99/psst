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
      name: 'description',
      title: 'Page description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Heading', value: 'h 2'},
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
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
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
