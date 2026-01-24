import {defineField, defineType} from 'sanity'
import {ListIcon} from '@sanity/icons'

export const pssoundMembership = defineType({
  name: 'pssoundMembership',
  title: 'Sound System Membership',
  type: 'document',
  icon: ListIcon,
  fields: [
    defineField({
      name: 'collectiveName',
      title: 'Name of your collective / association',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isPolitical',
      title: 'Is your project political?',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Feminist', value: 'feminist'},
          {title: 'Queer', value: 'queer'},
          {title: 'Racial', value: 'racial'},
          {title: 'Disability', value: 'disability'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'otherPolitical',
      title: 'Other (specify)',
      type: 'string',
    }),
    defineField({
      name: 'caribbeanOrAfro',
      title: 'Does your project include/feature people of Caribbean or Afro descent?',
      type: 'boolean',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'qualifiedSoundEngineer',
      title: 'Does your team include a qualified sound engineer?',
      type: 'string',
      options: {
        list: [
          {title: 'Yes', value: 'yes'},
          {
            title: 'No, but we commit to work with a qualified person at our events.',
            value: 'no_commit',
          },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'annualContribution',
      title: 'Annual contribution (between 75 and 150 euros)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'charterSigned',
      title: 'Charter of principles signed?',
      type: 'boolean',
      validation: (Rule) => Rule.required(),
    }),
    {
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false,
    },
    defineField({
      name: 'startDate',
      title: 'Membership start date',
      type: 'date',
      description: 'Date when membership begins (valid for one year)',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          // Make start date required only when membership is approved
          if (context.document?.approved && !value) {
            return 'Start date is required for approved memberships'
          }
          return true
        }),
    }),
  ],
})
