import {defineType, defineField} from 'sanity'

export const workshopRegistration = defineType({
  name: 'workshopRegistration',
  title: 'Workshop Registration',
  type: 'document',
  fields: [
    defineField({
      name: 'workshop',
      title: 'Workshop',
      type: 'reference',
      to: [{type: 'workshop'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'message',
      title: 'Message / Motivation',
      type: 'text',
    }),
    defineField({
      name: 'approved',
      title: 'Approved?',
      type: 'boolean',
      initialValue: false,
      description: 'Only approved participants count toward capacity.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
    },
  },
})
