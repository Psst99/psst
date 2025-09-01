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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'External Link',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'email',
      title: 'Submitter Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
      description: 'Email of person who submitted this resource',
    }),
    defineField({
      name: 'file',
      title: 'File upload',
      type: 'file',
      options: {
        accept: '.pdf,.doc,.docx,.jpg,.png,.zip',
      },
      description: 'Alternative to external link - upload a file directly',
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
      approved: 'approved',
      hasEmail: 'email',
    },
    prepare({title, approved, hasEmail}) {
      return {
        title,
        subtitle: approved ? 'Approved' : hasEmail ? 'Pending submission' : 'Draft',
      }
    },
  },
})
