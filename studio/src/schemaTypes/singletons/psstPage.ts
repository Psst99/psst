import {defineField, defineType} from 'sanity'

export const psstPage = defineType({
  name: 'psstPage',
  title: 'PSST',
  type: 'document',
  fields: [
    defineField({
      name: 'about',
      title: 'About PSST',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            annotations: [
              {type: 'textColor'},
              {
                type: 'highlightColor',
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'charter',
      title: 'Charter',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            annotations: [
              {type: 'textColor'},
              {
                type: 'highlightColor',
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'legal',
      title: 'Legal Mentions',
      type: 'text',
      description: 'Plain text only – for listing subsidies, copyright, etc.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'PSST',
      }
    },
  },
})
