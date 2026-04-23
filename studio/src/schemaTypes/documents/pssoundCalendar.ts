import {defineField, defineType} from 'sanity'

export const pssoundCalendar = defineType({
  name: 'pssoundCalendar',
  title: 'Blocked Dates',
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
    defineField({
      name: 'request',
      title: 'Related Request',
      type: 'reference',
      to: [{type: 'pssoundRequest'}],
      description: 'Automatically linked when dates are blocked from an approved loan request.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      start: 'startDate',
      end: 'endDate',
      requestTitle: 'request.eventTitle',
      requestCollective: 'request.collective',
    },
    prepare({title, start, end, requestTitle, requestCollective}) {
      const fallbackTitle = requestTitle
        ? `Loan: ${requestTitle}`
        : start && end
          ? `${start} to ${end}`
          : 'Blocked dates'
      const subtitleParts = [requestCollective, start && end ? `${start} to ${end}` : null].filter(
        Boolean,
      )

      return {
        title: title || fallbackTitle,
        subtitle: subtitleParts.join(' - '),
      }
    },
  },
})
