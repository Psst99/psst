import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Person schema.  Define and edit the fields for the 'person' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const artist = defineType({
  name: 'artist',
  title: 'Artist',
  icon: UserIcon,
  type: 'document',
  groups: [
    {name: 'profile', title: 'Profile', default: true},
    {name: 'internal', title: 'Internal'},
  ],
  fields: [
    defineField({
      name: 'artistName',
      title: 'Artist Name',
      group: 'profile',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      group: 'profile',
      type: 'slug',
      options: {
        source: 'artistName',
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pronouns',
      title: 'Pronouns',
      group: 'profile',
      type: 'string',
      description: 'The pronouns used by the artist (e.g., she/her, they/them).',
      options: {
        list: [
          {title: 'He/Him', value: 'he/him'},
          {title: 'She/Her', value: 'she/her'},
          {title: 'They/Them', value: 'they/them'},
          {title: 'He/They', value: 'he/they'},
          {title: 'She/They', value: 'she/they'},
          {title: 'Prefer not to say', value: 'prefer_not_to_say'},
          {title: 'Other', value: 'other'},
        ],
        layout: 'dropdown', // You can also use 'radio' if preferred
      },
    }),
    defineField({
      name: 'customPronouns',
      title: 'Custom pronouns',
      group: 'profile',
      type: 'string',
      hidden: ({parent}) => parent?.pronouns !== 'other',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      group: 'profile',
      type: 'string',
      // validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      group: 'profile',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'category'}],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    // defineField({
    //   name: 'links',
    //   title: 'Links',
    //   type: 'array',
    //   of: [{type: 'url'}],
    //   description: 'Social media, website, or other relevant links.',
    // }),
    defineField({
      name: 'links',
      title: 'Links',
      group: 'profile',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.required(),
            },
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              readOnly: true,
            },
          ],
          preview: {
            select: {
              title: 'url',
              subtitle: 'platform',
            },
          },
        },
      ],
      description: 'Social media, website, or other relevant links.',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      group: 'profile',
      type: 'text',
      description: 'A short bio or description of the artist.',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      group: 'profile',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
      description: 'Relevant tags for this artist (e.g., genres, styles, roles)',
    }),
    defineField({
      name: 'approved',
      title: 'Approved',
      group: 'profile',
      type: 'boolean',
      initialValue: false,
      description: 'Check to approve this artist and make them visible in the database.',
    }),
    defineField({
      name: 'submissionSource',
      title: 'Submission source',
      group: 'internal',
      type: 'string',
      readOnly: true,
      hidden: ({document}) => !document?.submissionSource,
      description: 'Set automatically for website submissions. Imported artists stay blank.',
    }),
    defineField({
      name: 'googleSheetsSyncedAt',
      title: 'Google Sheets synced at',
      group: 'internal',
      type: 'datetime',
      readOnly: true,
      hidden: ({document}) => !document?.googleSheetsSyncedAt,
    }),
    defineField({
      name: 'googleSheetsSheetName',
      title: 'Google Sheets sheet name',
      group: 'internal',
      type: 'string',
      readOnly: true,
      hidden: ({document}) => !document?.googleSheetsSheetName,
    }),
    defineField({
      name: 'googleSheetsRowNumber',
      title: 'Google Sheets row number',
      group: 'internal',
      type: 'number',
      readOnly: true,
      hidden: ({document}) => typeof document?.googleSheetsRowNumber !== 'number',
    }),
    defineField({
      name: 'googleSheetsSyncError',
      title: 'Google Sheets sync error',
      group: 'internal',
      type: 'text',
      readOnly: true,
      hidden: ({document}) => !document?.googleSheetsSyncError,
    }),
    defineField({
      name: 'confirmationEmailSentAt',
      title: 'Confirmation email sent at',
      group: 'internal',
      type: 'datetime',
      readOnly: true,
      hidden: ({document}) => !document?.confirmationEmailSentAt,
      description: 'Legacy field. Only shown when a confirmation email was actually sent.',
    }),
    defineField({
      name: 'approvalEmailSentAt',
      title: 'Approval email sent at',
      group: 'internal',
      type: 'datetime',
      readOnly: true,
      hidden: ({document}) => !document?.approvalEmailSentAt,
      description: 'Only shown when an approval email was actually sent.',
    }),
    defineField({
      name: 'emailDeliveryError',
      title: 'Email delivery error',
      group: 'internal',
      type: 'text',
      readOnly: true,
      hidden: ({document}) => !document?.emailDeliveryError,
      description: 'Legacy field kept only for older artist records.',
    }),

    // defineField({
    //   name: 'picture',
    //   title: 'Picture',
    //   type: 'image',
    //   fields: [
    //     defineField({
    //       name: 'alt',
    //       type: 'string',
    //       title: 'Alternative text',
    //       description: 'Important for SEO and accessibility.',
    //       validation: (rule) => {
    //         // Custom validation to ensure alt text is provided if the image is present. https://www.sanity.io/docs/validation
    //         return rule.custom((alt, context) => {
    //           if ((context.document?.picture as any)?.asset?._ref && !alt) {
    //             return 'Required'
    //           }
    //           return true
    //         })
    //       },
    //     }),
    //   ],
    //   options: {
    //     hotspot: true,
    //     aiAssist: {
    //       imageDescriptionField: 'alt',
    //     },
    //   },
    //   validation: (rule) => rule.required(),
    // }),
  ],
  // List preview configuration. https://www.sanity.io/docs/previews-list-views
  preview: {
    select: {
      title: 'artistName',
      subtitle: 'description',
    },
    prepare(selection) {
      return {
        title: selection.title,
        subtitle: selection.subtitle || 'Artist',
      }
    },
  },
})
