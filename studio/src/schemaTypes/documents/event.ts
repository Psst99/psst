// ./schemas/documents/event.ts

import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

function formatPreviewDate(value?: string) {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const event = defineType({
  name: 'event',
  title: 'Event',
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
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Start Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      description: 'For a single-day event, only fill this field.',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      description:
        'Optional. Use this for tours, festivals, or events running across a date range.',
      validation: (Rule) =>
        Rule.custom((endDate, context) => {
          const startDate = (context.document as {date?: string} | undefined)?.date

          if (!endDate || !startDate) {
            return true
          }

          return new Date(endDate) >= new Date(startDate)
            ? true
            : 'End date must be after the start date.'
        }),
    }),
    defineField({
      name: 'dates',
      title: 'Additional Dates',
      type: 'array',
      of: [{type: 'datetime'}],
      description:
        'Optional. Use this only for extra non-consecutive dates. For a continuous run, use End Date instead.',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Header Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'eventTag'}]}],
    }),
    defineField({
      name: 'url',
      title: 'External Link (Optional)',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      endDate: 'endDate',
      dates: 'dates',
      media: 'image',
    },
    prepare({title, date, endDate, dates, media}) {
      const startLabel = formatPreviewDate(date)
      const endLabel = formatPreviewDate(endDate)
      const extraLabels = Array.isArray(dates)
        ? dates.flatMap((extraDate) => {
            const label = formatPreviewDate(extraDate)
            return label ? [label] : []
          })
        : []
      const rangeLabel =
        startLabel && endLabel && startLabel !== endLabel ? `${startLabel} - ${endLabel}` : null
      const subtitle = [rangeLabel || startLabel || endLabel, ...extraLabels]
        .filter(Boolean)
        .join(', ')

      return {
        title,
        subtitle: subtitle || 'No date set',
        media,
      }
    },
  },
})
