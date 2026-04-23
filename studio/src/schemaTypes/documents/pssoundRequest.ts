import {defineField, defineType} from 'sanity'
import {ListIcon} from '@sanity/icons'

export const pssoundRequest = defineType({
  name: 'pssoundRequest',
  title: 'Sound System Request',
  type: 'document',
  icon: ListIcon,
  groups: [
    {name: 'loanRequest', title: 'Loan request', default: true},
    {name: 'review', title: 'Review & calendar'},
    {name: 'system', title: 'System'},
  ],
  fieldsets: [
    {name: 'dates', title: 'Dates'},
    {name: 'certifications', title: 'Certifications'},
  ],
  fields: [
    defineField({
      name: 'collective',
      title: 'Collective',
      type: 'string',
      group: 'loanRequest',
      description: 'Selected collective from the approved Pssound membership list.',
    }),
    defineField({
      name: 'eventDate',
      title: 'Event Date',
      type: 'date',
      group: 'loanRequest',
      fieldset: 'dates',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pickupDate',
      title: 'Pick-up Date (weekdays only)',
      type: 'date',
      group: 'loanRequest',
      fieldset: 'dates',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'returnDate',
      title: 'Return Date (weekdays only)',
      type: 'date',
      group: 'loanRequest',
      fieldset: 'dates',
      validation: (Rule) => Rule.required().min(Rule.valueOfField('pickupDate')),
    }),
    defineField({
      name: 'eventTitle',
      title: 'Event Title',
      type: 'string',
      group: 'loanRequest',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventLink',
      title: 'Event Link',
      type: 'url',
      group: 'loanRequest',
    }),
    defineField({
      name: 'eventLocation',
      title: 'Event Location',
      type: 'string',
      group: 'loanRequest',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventDescription',
      title: 'Event Description',
      type: 'text',
      group: 'loanRequest',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isPolitical',
      title: 'Is the event political?',
      type: 'object',
      group: 'loanRequest',
      fields: [
        {name: 'feminist', title: 'Feminist', type: 'boolean'},
        {name: 'queer', title: 'Queer', type: 'boolean'},
        {name: 'racial', title: 'Racial', type: 'boolean'},
        {name: 'disability', title: 'Disability', type: 'boolean'},
        {name: 'fundraiser', title: 'Fundraiser', type: 'string'},
        {name: 'other', title: 'Other', type: 'string'},
      ],
    }),
    defineField({
      name: 'marginalizedArtists',
      title: 'Line-up',
      type: 'array',
      group: 'loanRequest',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'name', title: 'Name', type: 'string'},
            {name: 'link', title: 'Link (URL or leave blank)', type: 'url'},
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'link',
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).error('At least one artist required'),
    }),
    defineField({
      name: 'wagePolicy',
      title: 'Wage Policy',
      type: 'text',
      group: 'loanRequest',
      description: 'Please detail with transparency',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'vehicleCert',
      title: 'I certify that I have a vehicle to transport the sound safely (minimum 8 m³).',
      type: 'boolean',
      group: 'loanRequest',
      fieldset: 'certifications',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'teamCert',
      title:
        'I certify that at least 3 people will manage pick-up, build-up, build-down and return of the system.',
      type: 'boolean',
      group: 'loanRequest',
      fieldset: 'certifications',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'charterCert',
      title: 'I certify that all persons involved have read and signed the manifesto.',
      type: 'boolean',
      group: 'loanRequest',
      fieldset: 'certifications',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'review',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Confirmed', value: 'confirmed'},
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
      description:
        'Set this to Confirmed and publish to send the confirmation email and block the loan dates.',
    }),
    defineField({
      name: 'calendarBlock',
      title: 'Blocked date period',
      type: 'reference',
      to: [{type: 'pssoundCalendar'}],
      group: 'review',
      readOnly: true,
      description: 'Created or updated automatically when the request is confirmed.',
    }),
    defineField({
      name: 'calendarBlockedAt',
      title: 'Dates blocked at',
      type: 'datetime',
      group: 'review',
      readOnly: true,
    }),
    defineField({
      name: 'approvalEmailSentAt',
      title: 'Loan confirmation email sent at',
      type: 'datetime',
      group: 'review',
      readOnly: true,
    }),
    defineField({
      name: 'emailDeliveryError',
      title: 'Email delivery error',
      type: 'text',
      group: 'review',
      readOnly: true,
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
      group: 'system',
      readOnly: true,
      description: 'Resolved from the approved collective membership when available.',
    }),
    defineField({
      name: 'membership',
      title: 'Related membership request',
      type: 'reference',
      to: [{type: 'pssoundMembership'}],
      group: 'system',
      readOnly: true,
    }),
    defineField({
      name: 'confirmationEmailSentAt',
      title: 'Request received email sent at',
      type: 'datetime',
      group: 'system',
      readOnly: true,
    }),
    defineField({
      name: 'membershipCert',
      title: 'Membership Certification',
      type: 'boolean',
      group: 'system',
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'eventTitle',
      collective: 'collective',
      status: 'status',
      pickupDate: 'pickupDate',
      returnDate: 'returnDate',
    },
    prepare({title, collective, status, pickupDate, returnDate}) {
      const statusLabel = status === 'confirmed' ? 'Confirmed' : 'Pending'
      const dates =
        pickupDate && returnDate
          ? `${pickupDate} to ${returnDate}`
          : pickupDate || returnDate || 'No dates'

      return {
        title: title || 'Untitled request',
        subtitle: [collective, statusLabel, dates].filter(Boolean).join(' - '),
      }
    },
  },
})
