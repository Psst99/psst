import {defineType, defineField} from 'sanity'

export const highlightedBox = defineType({
  name: 'highlightedBox',
  title: 'Highlighted Box',
  type: 'object',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Heading', value: 'h2'},
            {title: 'Paragraph', value: 'normal'},
          ],
          marks: {
            annotations: [{type: 'textColor'}, {type: 'highlightColor'}],
          },
        },
      ],
    }),
  ],
})
