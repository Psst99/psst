import {defineField, defineType} from 'sanity'

const baseFields = [
  defineField({
    name: 'enabled',
    title: 'Enabled',
    type: 'boolean',
    initialValue: true,
  }),
  defineField({
    name: 'subject',
    title: 'Subject',
    type: 'string',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'previewText',
    title: 'Inbox preview text',
    type: 'string',
    description: 'Short hidden preview text used by email clients.',
    validation: (Rule) => Rule.required(),
  }),
]

const headingField = defineField({
  name: 'heading',
  title: 'Heading',
  type: 'string',
  validation: (Rule) => Rule.required(),
})

const introField = defineField({
  name: 'intro',
  title: 'Intro copy',
  type: 'text',
  rows: 4,
  validation: (Rule) => Rule.required(),
})

const noticeField = defineField({
  name: 'notice',
  title: 'Notice copy',
  type: 'text',
  rows: 3,
  description: 'Optional. Leave blank to hide this section.',
})

const footerField = defineField({
  name: 'footer',
  title: 'Footer',
  type: 'text',
  rows: 3,
  description: 'Optional. Leave blank to hide this section.',
})

const disclaimerField = defineField({
  name: 'disclaimer',
  title: 'Disclaimer',
  type: 'text',
  rows: 2,
  validation: (Rule) => Rule.required(),
})

export const emailMessage = defineType({
  name: 'emailMessage',
  title: 'Email message',
  type: 'object',
  fields: [
    ...baseFields,
    headingField,
    introField,
    noticeField,
    footerField,
    disclaimerField,
  ],
})

export const databaseReceivedEmailMessage = defineType({
  name: 'databaseReceivedEmailMessage',
  title: 'Database received email message',
  type: 'object',
  fields: [...baseFields, headingField, introField, disclaimerField],
})

export const databaseApprovedEmailMessage = defineType({
  name: 'databaseApprovedEmailMessage',
  title: 'Database approved email message',
  type: 'object',
  fields: [...baseFields, disclaimerField],
})

export const resourceReceivedEmailMessage = defineType({
  name: 'resourceReceivedEmailMessage',
  title: 'Resource received email message',
  type: 'object',
  fields: [...baseFields, headingField, introField, disclaimerField],
})

export const resourceApprovedEmailMessage = defineType({
  name: 'resourceApprovedEmailMessage',
  title: 'Resource approved email message',
  type: 'object',
  fields: [...baseFields, disclaimerField],
})

export const workshopReceivedEmailMessage = defineType({
  name: 'workshopReceivedEmailMessage',
  title: 'Workshop received email message',
  type: 'object',
  fields: [...baseFields, headingField, introField, disclaimerField],
})

export const workshopApprovedEmailMessage = defineType({
  name: 'workshopApprovedEmailMessage',
  title: 'Workshop approved email message',
  type: 'object',
  fields: [...baseFields, disclaimerField],
})
