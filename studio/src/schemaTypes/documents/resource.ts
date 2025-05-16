import {defineField, defineType} from 'sanity'

export const resource = defineType({
  name: 'resource',
  title: 'Resource',
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
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'link',
      title: 'External Link',
      type: 'url',
    }),
    defineField({
      name: 'file',
      title: 'File upload',
      type: 'file',
      options: {
        accept: '.pdf,.doc,.docx,.jpg,.png,.zip',
      },
    }),
    defineField({
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false,
      description: 'Only approved resources appear on the site.',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted at',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'approved',
    },
    prepare({title, subtitle}) {
      return {
        title,
        subtitle: subtitle ? 'Approved' : 'Pending approval',
      }
    },
  },
})
