import {defineField, defineType} from 'sanity'

export const workshopsPage = defineType({
  name: 'workshopsPage',
  title: 'Workshops',
  type: 'document',
  fields: [
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string', // Use 'color' if you have the color input plugin installed
      description: 'Set a background color for the Workshops page (e.g., #ffffff for white).',
    }),
    defineField({
      name: 'about',
      title: 'About Workshops',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Workshops',
      }
    },
  },
})
