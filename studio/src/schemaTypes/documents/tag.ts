import {defineField, defineType} from 'sanity'

export const tag = defineType({
  name: 'tag',
  title: 'Tag',
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
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Optional: describe what this tag means.',
    }),
    // defineField({
    //   name: 'pendingApproval',
    //   title: 'Pending Approval',
    //   type: 'boolean',
    //   initialValue: true,
    //   description: 'If checked, this tag is awaiting review.',
    // }),
  ],
  preview: {
    select: {
      title: 'title',
      pending: 'pendingApproval',
    },
    prepare({title, pending}) {
      return {
        title: title,
        subtitle: pending ? 'Pending approval' : 'Approved',
      }
    },
  },
})
