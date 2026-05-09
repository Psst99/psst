import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: false,
  },
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'SEO title',
      type: 'string',
      description: 'Shown in Google results and browser tabs. Aim for 50-60 characters.',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      description: 'Shown as the search result snippet when Google chooses to use it.',
      validation: (Rule) => Rule.max(170),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social image',
      type: 'image',
      description: 'Used when this page is shared on social platforms.',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Describe the image for accessibility and SEO.',
          validation: (Rule) =>
            Rule.custom((alt, context) => {
              if ((context.parent as any)?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            }),
        }),
      ],
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      description: 'Adds a noindex robots tag. Leave off for public section pages.',
      initialValue: false,
    }),
  ],
})
