import {defineField, defineType} from 'sanity'
import {BookIcon} from '@sanity/icons'

export const pssoundManual = defineType({
  name: 'pssoundManual',
  title: 'User manual',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'pdf',
      title: 'Manual as PDF (optional)',
      type: 'file',
    }),
    defineField({
      name: 'content',
      title: 'Manual text (optional)',
      type: 'array',
      of: [{type: 'block'}, {type: 'image', options: {hotspot: true}}],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'User manual',
      }
    },
  },
})
