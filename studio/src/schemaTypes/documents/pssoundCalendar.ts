// ./schemas/documents/pssoundCalendar.ts

import {defineField, defineType} from 'sanity'

export const pssoundCalendar = defineType({
  name: 'pssoundCalendar',
  title: 'Blocked Period',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional title or reason (e.g. "Maintenance", "Break", etc.)',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      validation: (Rule) => Rule.required().min(Rule.valueOfField('startDate')),
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      description: 'Optional internal note for this blocked period.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      start: 'startDate',
      end: 'endDate',
    },
    prepare({title, start, end}) {
      return {
        title: title || `${start} → ${end}`,
        subtitle: start && end ? `${start} → ${end}` : '',
      }
    },
  },
})
