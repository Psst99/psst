import {defineArrayMember, defineField, defineType} from 'sanity'
import {CheckmarkIcon} from '@sanity/icons'

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

const successField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'array',
    of: richSuccessContent,
  })

export const formSuccessPages = defineType({
  name: 'formSuccessPages',
  title: 'Form success pages',
  type: 'document',
  icon: CheckmarkIcon,
  fields: [
    successField('databaseSubmitContent', 'Database submission success'),
    successField('resourceSubmitContent', 'Resource submission success'),
    successField('workshopRegistrationContent', 'Workshop registration success'),
    successField('pssoundRequestContent', 'Pssound loan request success'),
    successField('pssoundMembershipContent', 'Pssound membership request success'),
  ],
  preview: {
    prepare() {
      return {
        title: 'Form success pages',
        subtitle: 'Success-page content after form submissions',
      }
    },
  },
})
