import {EnvelopeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {
  EMAIL_MESSAGE_DEFAULTS,
  EMAIL_SETTINGS_DEFAULTS,
  EMAIL_TEMPLATE_KEYS,
  EMAIL_TEMPLATE_VARIABLES,
  type EmailTemplateKey,
} from '../../lib/emailTemplates'

const EMAIL_TEMPLATE_GROUPS: Record<
  EmailTemplateKey,
  'database' | 'resources' | 'workshops' | 'pssound'
> = {
  databaseReceived: 'database',
  databaseApproved: 'database',
  resourceReceived: 'resources',
  resourceApproved: 'resources',
  workshopReceived: 'workshops',
  workshopApproved: 'workshops',
  pssoundRequestReceived: 'pssound',
  pssoundRequestApproved: 'pssound',
  pssoundMembershipReceived: 'pssound',
  pssoundMembershipApproved: 'pssound',
}

const EMAIL_TEMPLATE_FIELD_TITLES: Record<EmailTemplateKey, string> = {
  databaseReceived: 'Received',
  databaseApproved: 'Approved',
  resourceReceived: 'Received',
  resourceApproved: 'Approved',
  workshopReceived: 'Received',
  workshopApproved: 'Approved',
  pssoundRequestReceived: 'Loan request: received',
  pssoundRequestApproved: 'Loan request: confirmed',
  pssoundMembershipReceived: 'Membership: received',
  pssoundMembershipApproved: 'Membership: approved',
}

const templateField = (name: EmailTemplateKey) =>
  defineField({
    name,
    title: EMAIL_TEMPLATE_FIELD_TITLES[name],
    type:
      name === 'databaseReceived'
        ? 'databaseReceivedEmailMessage'
        : name === 'databaseApproved'
          ? 'databaseApprovedEmailMessage'
          : name === 'resourceReceived'
            ? 'resourceReceivedEmailMessage'
            : name === 'resourceApproved'
              ? 'resourceApprovedEmailMessage'
              : name === 'workshopReceived'
                ? 'workshopReceivedEmailMessage'
                : name === 'workshopApproved'
                  ? 'workshopApprovedEmailMessage'
                : 'emailMessage',
    group: EMAIL_TEMPLATE_GROUPS[name],
    initialValue: EMAIL_MESSAGE_DEFAULTS[name],
    description: `Variables: ${EMAIL_TEMPLATE_VARIABLES[name].map((variable) => `{{${variable}}}`).join(', ')}`,
  })

export const emailSettings = defineType({
  name: 'emailSettings',
  title: 'Emails',
  type: 'document',
  icon: EnvelopeIcon,
  groups: [
    {name: 'sending', title: 'Sending', default: true},
    {name: 'database', title: 'Database'},
    {name: 'resources', title: 'Resources'},
    {name: 'workshops', title: 'Workshops'},
    {name: 'pssound', title: 'PSƧOUND'},
  ],
  initialValue: EMAIL_SETTINGS_DEFAULTS,
  fields: [
    defineField({
      name: 'fromName',
      title: 'From name',
      type: 'string',
      group: 'sending',
      initialValue: EMAIL_SETTINGS_DEFAULTS.fromName,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fromEmail',
      title: 'From email',
      type: 'string',
      group: 'sending',
      initialValue: EMAIL_SETTINGS_DEFAULTS.fromEmail,
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'replyTo',
      title: 'Reply-to email',
      type: 'string',
      group: 'sending',
      initialValue: EMAIL_SETTINGS_DEFAULTS.replyTo,
      validation: (Rule) => Rule.email(),
    }),
    ...EMAIL_TEMPLATE_KEYS.map(templateField),
  ],
  preview: {
    prepare() {
      return {
        title: 'Emails',
        subtitle: 'Form confirmations and approval emails',
      }
    },
  },
})
