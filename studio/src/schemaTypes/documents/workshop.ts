import {defineType, defineField, defineArrayMember} from 'sanity'
import {CalendarIcon} from '@sanity/icons'
import {AvailableSpotsInput} from '../../components/AvailableSpotsInput'

export const workshop = defineType({
  name: 'workshop',
  title: 'Workshop',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dates',
      title: 'Workshop Dates',
      description: 'Add all dates for this workshop (can be multiple)',
      type: 'array',
      of: [{type: 'date'}],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'workshopTag'}]}],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Heading', value: 'h2'},
            {title: 'Paragraph', value: 'normal'},
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
                    description: 'e.g., /database, /workshops, /psst/about',
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
        },
        {type: 'highlightedBox'},
      ],
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      description: 'This image will be displayed on the registration form',
      type: 'image',
      options: {hotspot: true},
    }),
    // defineField({
    //   name: 'photos',
    //   title: 'Gallery Photos',
    //   description: 'Additional photos for workshop details page',
    //   type: 'array',
    //   of: [
    //     defineArrayMember({
    //       type: 'image',
    //       options: {hotspot: true},
    //     }),
    //   ],
    // }),
    defineField({
      name: 'totalSpots',
      title: 'Total Number of Places',
      description:
        'Maximum number of participants. Do not change this after registrations have started to avoid confusion.',
      type: 'number',
      validation: (Rule) => Rule.min(1).required(),
    }),
    defineField({
      name: 'availableSpots',
      title: 'Available Spots',
      description:
        'Calculated automatically based on approved registrations. This updates in real-time.',
      type: 'number',
      readOnly: true,
      initialValue: 0,
      components: {
        input: AvailableSpotsInput,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      dates: 'dates',
      media: 'coverImage',
    },
    prepare({title, dates, media}) {
      const now = new Date()
      const isUpcoming = dates && dates.some((date: string) => new Date(date) >= now)
      const firstDate = dates && dates.length > 0 ? dates[0] : null
      return {
        title,
        subtitle: `${isUpcoming ? 'Upcoming:' : 'Past:'} ${firstDate ? new Date(firstDate).toLocaleDateString() : ''}`,
        media,
      }
    },
  },
})
