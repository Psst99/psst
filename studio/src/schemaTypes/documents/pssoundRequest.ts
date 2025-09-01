import {defineField, defineType} from 'sanity'
import {ListIcon} from '@sanity/icons'

export const pssoundRequest = defineType({
  name: 'pssoundRequest',
  title: 'Sound System Request',
  type: 'document',
  icon: ListIcon,
  fields: [
    defineField({
      name: 'collective',
      title: 'Collective (optional)',
      type: 'string',
    }),
    defineField({
      name: 'eventTitle',
      title: 'Event Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventLink',
      title: 'Event Link',
      type: 'url',
    }),
    defineField({
      name: 'eventLocation',
      title: 'Event Location',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventDescription',
      title: 'Event Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isPolitical',
      title: 'Is the event political?',
      type: 'object',
      fields: [
        {name: 'feminist', title: 'Feminist', type: 'boolean'},
        {name: 'queer', title: 'Queer', type: 'boolean'},
        {name: 'racial', title: 'Racial Justice', type: 'boolean'},
        {name: 'disability', title: 'Disability Justice', type: 'boolean'},
        {name: 'fundraiser', title: 'Fundraiser (specify)', type: 'string'},
        {name: 'other', title: 'Other (specify)', type: 'string'},
      ],
    }),
    defineField({
      name: 'marginalizedArtists',
      title: 'Marginalized Artists',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'name', title: 'Name', type: 'string'},
            {name: 'link', title: 'Link', type: 'url'},
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).error('At least one artist required'),
    }),
    defineField({
      name: 'wagePolicy',
      title: 'Wage Policy',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventDate',
      title: 'Event Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pickupDate',
      title: 'Pick-up Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'returnDate',
      title: 'Return Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'vehicleCert',
      title: 'Vehicle Certification',
      type: 'boolean',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'teamCert',
      title: 'Team Certification',
      type: 'boolean',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'charterCert',
      title: 'Charter Certification',
      type: 'boolean',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'membershipCert',
      title: 'Membership Certification',
      type: 'boolean',
      validation: (Rule) => Rule.required(),
    }),
    // Optionally, add status/approved fields if you need them for admin
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
    defineField({
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
