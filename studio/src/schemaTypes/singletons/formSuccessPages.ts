import {CheckmarkIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

const richSupportConfirmationContent = [
  defineArrayMember({
    type: 'block',
    styles: [
      {title: 'Paragraph', value: 'normal'},
      {title: 'Heading', value: 'h2'},
    ],
    lists: [],
    marks: {
      decorators: [
        {title: 'Strong', value: 'strong'},
        {title: 'Emphasis', value: 'em'},
      ],
      annotations: [
        {
          name: 'link',
          type: 'object',
          title: 'Link',
          fields: [
            {
              name: 'linkType',
              type: 'string',
              title: 'Link Type',
              options: {
                list: [
                  {title: 'Internal Page', value: 'internal'},
                  {title: 'External URL', value: 'external'},
                ],
                layout: 'radio',
              },
              initialValue: 'internal',
            },
            {
              name: 'internalLink',
              type: 'string',
              title: 'Internal Page',
              description: 'e.g., /database, /resources, /workshops, /pssound-system',
              hidden: ({parent}) => parent?.linkType !== 'internal',
            },
            {
              name: 'href',
              type: 'url',
              title: 'External URL',
              hidden: ({parent}) => parent?.linkType !== 'external',
              validation: (Rule) =>
                Rule.uri({
                  scheme: ['http', 'https', 'mailto', 'tel'],
                }),
            },
            {
              name: 'openInNewTab',
              type: 'boolean',
              title: 'Open in new tab',
              initialValue: false,
            },
          ],
        },
      ],
    },
  }),
]

const richSuccessContent = [
  defineArrayMember({
    type: 'block',
    styles: [
      {title: 'Paragraph', value: 'normal'},
      {title: 'Heading', value: 'h2'},
      {title: 'Large paragraph', value: 'largeParagraph'},
      {title: 'Large question', value: 'largeQuestion'},
    ],
    marks: {
      decorators: [
        {title: 'Strong', value: 'strong'},
        {title: 'Emphasis', value: 'em'},
      ],
      annotations: [
        {type: 'textColor'},
        {type: 'highlightColor'},
        {
          name: 'link',
          type: 'object',
          title: 'Link',
          fields: [
            {
              name: 'linkType',
              type: 'string',
              title: 'Link Type',
              options: {
                list: [
                  {title: 'Internal Page', value: 'internal'},
                  {title: 'External URL', value: 'external'},
                ],
                layout: 'radio',
              },
              initialValue: 'internal',
            },
            {
              name: 'internalLink',
              type: 'string',
              title: 'Internal Page',
              description: 'e.g., /database, /resources, /workshops, /pssound-system',
              hidden: ({parent}) => parent?.linkType !== 'internal',
            },
            {
              name: 'href',
              type: 'url',
              title: 'External URL',
              hidden: ({parent}) => parent?.linkType !== 'external',
              validation: (Rule) =>
                Rule.uri({
                  scheme: ['http', 'https', 'mailto', 'tel'],
                }),
            },
            {
              name: 'openInNewTab',
              type: 'boolean',
              title: 'Open in new tab',
              initialValue: false,
            },
          ],
        },
      ],
    },
  }),
  defineArrayMember({type: 'highlightedBox'}),
]

const supportConfirmationInitialValue = (text: string) => {
  const key = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return [
    {
      _key: `${key}-initial`,
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _key: `${key}-initial-span`,
          _type: 'span',
          marks: [],
          text,
        },
      ],
    },
  ]
}

const supportStringField = (
  name: string,
  title: string,
  group: string | string[],
  initialValue: string,
) =>
  defineField({
    name,
    title,
    type: 'string',
    group,
    initialValue,
  })

const supportBlockContentField = (
  name: string,
  title: string,
  group: string | string[],
  description: string,
) =>
  defineField({
    name,
    title,
    type: 'blockContent',
    group,
    description,
  })

const supportConfirmationField = (
  name: string,
  title: string,
  initialText: string,
  group: string,
) =>
  defineField({
    name,
    title,
    type: 'array',
    group,
    of: richSupportConfirmationContent,
    initialValue: supportConfirmationInitialValue(initialText),
  })

const successField = (name: string, title: string, group: string) =>
  defineField({
    name,
    title,
    type: 'array',
    group,
    of: richSuccessContent,
  })

export const formSuccessPages = defineType({
  name: 'formSuccessPages',
  title: 'Forms',
  type: 'document',
  icon: CheckmarkIcon,
  groups: [
    {name: 'donation', title: 'Donation', default: true},
    {name: 'newsletter', title: 'Newsletter'},
    {name: 'submissions', title: 'Submissions'},
    {name: 'pssound', title: 'PSƧOUND'},
  ],
  fields: [
    supportStringField('modalTitle', 'Modal title', ['donation', 'newsletter'], 'Support PSST'),
    supportStringField('donationTabLabel', 'Donation tab label', 'donation', 'Make a donation'),
    supportBlockContentField(
      'donationIntro',
      'Donation intro',
      'donation',
      'Optional rich text shown above the donation form.',
    ),
    supportStringField(
      'donationSubmitLabel',
      'Donation submit label',
      'donation',
      'Continue to payment',
    ),
    supportConfirmationField(
      'donationSuccessMessage',
      'Donation success message',
      'Donation payment completed. Thank you for supporting PSST.',
      'donation',
    ),
    supportConfirmationField(
      'donationFailedMessage',
      'Donation failure message',
      'There was an issue processing your payment.',
      'donation',
    ),

    supportStringField('newsletterTabLabel', 'Newsletter tab label', 'newsletter', 'Newsletter'),
    supportBlockContentField(
      'newsletterIntro',
      'Newsletter intro',
      'newsletter',
      'Optional rich text shown above the newsletter form.',
    ),
    supportStringField(
      'newsletterSubmitLabel',
      'Newsletter submit label',
      'newsletter',
      'Subscribe',
    ),
    supportConfirmationField(
      'newsletterSuccessMessage',
      'Newsletter success message',
      'Thanks, you are subscribed.',
      'newsletter',
    ),

    successField('databaseSubmitContent', 'Database submission success', 'submissions'),
    successField('resourceSubmitContent', 'Resource submission success', 'submissions'),
    successField('workshopRegistrationContent', 'Workshop registration success', 'submissions'),
    successField('pssoundRequestContent', 'Pssound loan request success', 'pssound'),
    successField('pssoundMembershipContent', 'Pssound membership request success', 'pssound'),
  ],
  preview: {
    prepare() {
      return {
        title: 'Forms',
        subtitle: 'Support modal copy and success-page content',
      }
    },
  },
})
