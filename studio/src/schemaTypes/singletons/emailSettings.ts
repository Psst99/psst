import {EnvelopeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {
  EMAIL_MESSAGE_DEFAULTS,
  EMAIL_SETTINGS_DEFAULTS,
  EMAIL_TEMPLATE_KEYS,
  EMAIL_TEMPLATE_LABELS,
  EMAIL_TEMPLATE_VARIABLES,
  type EmailTemplateKey,
} from '../../lib/emailTemplates'

const templateField = (name: EmailTemplateKey) =>
  defineField({
    name,
    title: EMAIL_TEMPLATE_LABELS[name],
    type: 'emailMessage',
    group: name,
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
    ...EMAIL_TEMPLATE_KEYS.map((key) => ({
      name: key,
      title: EMAIL_TEMPLATE_LABELS[key],
    })),
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
