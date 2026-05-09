import {defineField, defineType} from 'sanity'

export const newsletterSubscription = defineType({
  name: 'newsletterSubscription',
  title: 'Newsletter Signup',
  type: 'document',
  groups: [
    {name: 'signup', title: 'Signup', default: true},
    {name: 'internal', title: 'Internal'},
  ],
  fields: [
    defineField({
      name: 'email',
      title: 'Email address',
      type: 'string',
      group: 'signup',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'signup',
    }),
    defineField({
      name: 'sourcePath',
      title: 'Signup source path',
      type: 'string',
      group: 'signup',
      description: 'Page path where the user opened the newsletter form.',
    }),
    defineField({
      name: 'status',
      title: 'Infomaniak sync status',
      type: 'string',
      group: 'internal',
      readOnly: true,
      initialValue: 'pending',
      options: {
        list: [
          {title: 'Pending import', value: 'pending'},
          {title: 'Synced to Infomaniak', value: 'synced'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'submittedAt',
      title: 'First submitted at',
      type: 'datetime',
      group: 'internal',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'lastSubmittedAt',
      title: 'Last submitted at',
      type: 'datetime',
      group: 'internal',
      readOnly: true,
      hidden: ({document}) => !document?.lastSubmittedAt,
    }),
    defineField({
      name: 'syncedAt',
      title: 'Synced at',
      type: 'datetime',
      group: 'internal',
      readOnly: true,
      hidden: ({document}) => !document?.syncedAt,
    }),
    defineField({
      name: 'providerError',
      title: 'Infomaniak error',
      type: 'text',
      group: 'internal',
      readOnly: true,
      hidden: ({document}) => !document?.providerError,
    }),
    defineField({
      name: 'confirmationEmailSentAt',
      title: 'Confirmation email sent at',
      type: 'datetime',
      group: 'internal',
      readOnly: true,
      hidden: ({document}) => !document?.confirmationEmailSentAt,
    }),
    defineField({
      name: 'emailDeliveryError',
      title: 'Email delivery error',
      type: 'text',
      group: 'internal',
      readOnly: true,
      hidden: ({document}) => !document?.emailDeliveryError,
    }),
  ],
  preview: {
    select: {
      title: 'email',
      name: 'name',
      status: 'status',
      sourcePath: 'sourcePath',
    },
    prepare(selection) {
      const statusLabel = selection.status === 'synced' ? 'Synced' : 'Pending import'
      const subtitle = [selection.name, statusLabel, selection.sourcePath]
        .filter(Boolean)
        .join(' | ')

      return {
        title: selection.title,
        subtitle,
      }
    },
  },
})
