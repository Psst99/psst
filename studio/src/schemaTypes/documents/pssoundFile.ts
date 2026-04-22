import {DocumentPdfIcon} from '@sanity/icons'
import {orderRankField} from '@sanity/orderable-document-list'
import {defineField, defineType} from 'sanity'

const FILE_GROUPS = [
  {title: 'Technical manuals', value: 'technicalManuals'},
  {title: 'Manifesto', value: 'manifesto'},
  {title: 'Other files', value: 'other'},
]

function formatPreviewTitle(label?: string, languageCode?: string) {
  const title = label?.trim() || 'Untitled file'
  const code = languageCode?.trim()

  if (!code) {
    return title
  }

  const formattedCode = code.toUpperCase()
  if (title.toLowerCase().endsWith(`(${code.toLowerCase()})`)) {
    return title
  }

  return `${title} (${formattedCode})`
}

export const pssoundFile = defineType({
  name: 'pssoundFile',
  title: 'PSƧOUND File',
  type: 'document',
  icon: DocumentPdfIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Button label',
      type: 'string',
      description: 'Visible link text, e.g. English Manual (PDF).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fileGroup',
      title: 'File group',
      type: 'string',
      options: {
        list: FILE_GROUPS,
        layout: 'radio',
      },
      initialValue: 'technicalManuals',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'languageName',
      title: 'Language name',
      type: 'string',
      description: 'Optional editor note, e.g. English, Francais, Spanish.',
    }),
    defineField({
      name: 'languageCode',
      title: 'Language code',
      type: 'string',
      description: 'Optional short code, e.g. en, fr, es.',
    }),
    defineField({
      name: 'file',
      title: 'PDF file',
      type: 'file',
      options: {
        accept: 'application/pdf',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'active',
      title: 'Show on request form',
      type: 'boolean',
      initialValue: true,
    }),
    orderRankField({type: 'pssoundFile'}),
  ],
  preview: {
    select: {
      label: 'label',
      fileGroup: 'fileGroup',
      languageCode: 'languageCode',
      languageName: 'languageName',
      active: 'active',
    },
    prepare({label, fileGroup, languageCode, languageName, active}) {
      const groupTitle = FILE_GROUPS.find((group) => group.value === fileGroup)?.title || 'File'
      return {
        title: formatPreviewTitle(label, languageCode),
        subtitle: `${groupTitle}${languageName ? ` - ${languageName}` : ''}${
          active === false ? ' - hidden' : ''
        }`,
        media: DocumentPdfIcon,
      }
    },
  },
})
