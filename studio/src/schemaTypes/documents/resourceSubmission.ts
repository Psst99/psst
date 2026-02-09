import {defineType, defineField} from 'sanity'

export const resourceSubmission = defineType({
  name: 'resourceSubmission',
  title: 'Resource Submission',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'External link to resource',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const file = context.document?.file
          if (!value && !file) return 'Provide a URL or upload a file'
          return true
        }),
    }),
    defineField({
      name: 'file',
      title: 'Upload File',
      type: 'file',
      description: 'Upload a file directly (PDF)',
    }),
    defineField({
      name: 'categories',
      title: 'Category',
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'email',
      title: 'Submitter Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'url',
    },
  },
})
