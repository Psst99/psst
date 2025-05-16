import {defineField, defineType} from 'sanity'

export const guidelines = defineType({
  name: 'guidelines',
  title: 'Guidelines',
  type: 'document',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Guidelines',
      }
    },
  },
})
