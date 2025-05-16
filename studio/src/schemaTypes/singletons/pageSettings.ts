import {defineField, defineType} from 'sanity'

export const pageSettings = defineType({
  name: 'pageSettings',
  title: 'Page settings',
  type: 'document',
  fields: [
    defineField({
      name: 'backgroundColor',
      title: 'Page background color',
      type: 'string', // Use 'color' if you have the color input plugin installed
      description: 'Set a background color for the page (e.g., #ffffff for white).',
    }),
    defineField({
      name: 'about',
      title: 'Page description',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Page settings',
      }
    },
  },
})
