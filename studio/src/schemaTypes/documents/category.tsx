import {defineField, defineType} from 'sanity'

const BlackBox = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#6600FF',
    }}
  />
)

export const category = defineType({
  name: 'category',
  title: 'Category',
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
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title,
        media: BlackBox,
      }
    },
  },
})
