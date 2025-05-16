// ./schemas/documents/pssoundRequest.ts

import {defineField, defineType} from 'sanity'
import {ListIcon} from '@sanity/icons'

export const pssoundRequest = defineType({
  name: 'pssoundRequest',
  title: 'Sound System Request',
  type: 'document',
  icon: ListIcon,
  fields: [
    defineField({
      name: 'fullName',
      title: 'Full name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({name: 'collective', title: 'Collective (optional)', type: 'string'}),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Project description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: ['pending', 'approved', 'declined'],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
  ],
})
