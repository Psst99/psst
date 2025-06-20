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
  fields: [
    defineField({
      name: 'artistName',
      title: 'Artist Name',

      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pronouns',
      title: 'Pronouns',
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
      type: 'string',
      hidden: ({parent}) => parent?.pronouns !== 'other',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'category'}],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{type: 'url'}],
      description: 'Social media, website, or other relevant links.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A short bio or description of the artist.',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
      description: 'Relevant tags for this artist (e.g., genres, styles, roles)',
    }),
    defineField({
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false,
      description: 'Check to approve this artist and make them visible in the database.',
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
