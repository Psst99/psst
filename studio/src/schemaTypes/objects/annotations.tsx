import {colorOptions} from '../../lib/theme'

export const textColorAnnotation = {
  name: 'textColor',
  type: 'object',
  title: 'Text Color',
  fields: [
    {
      name: 'value',
      type: 'string',
      title: 'Color',
      options: {
        list: colorOptions,
      },
    },
  ],
}

export const highlightColorAnnotation = {
  name: 'highlightColor',
  type: 'object',
  title: 'Highlight',
  fields: [
    {
      name: 'value',
      type: 'string',
      title: 'Background Color',
      options: {
        list: colorOptions,
      },
    },
    {
      name: 'text',
      type: 'string',
      title: 'Text Color (optional)',
      options: {
        list: colorOptions,
      },
    },
  ],
}

export const linkAnnotation = {
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
}

// Reusable block configuration
export const richTextBlocks = {
  styles: [
    {title: 'Heading', value: 'h2'},
    {title: 'Paragraph', value: 'normal'},
  ],
  marks: {
    decorators: [
      {title: 'Strong', value: 'strong'},
      {title: 'Emphasis', value: 'em'},
    ],
    annotations: [textColorAnnotation, highlightColorAnnotation, linkAnnotation],
  },
}
