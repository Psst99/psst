import {defineType, defineField} from 'sanity'

export const workshopRegistration = defineType({
  name: 'workshopRegistration',
  title: 'Workshop Registration',
  type: 'document',
  fields: [
    defineField({
      name: 'workshop',
      title: 'Workshop',
      type: 'reference',
      to: [{type: 'workshop'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'selectedDates',
      title: 'Selected Dates',
      description: 'Which workshop dates the participant registered for',
      type: 'array',
      of: [{type: 'date'}],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'message',
      title: 'Message / Motivation',
      type: 'text',
    }),
    // defineField({
    //   name: 'approved',

    //   type: 'boolean',
    //   initialValue: false,
    // }),
    defineField({
      name: 'status', // Changed from 'approved' to 'status'
      title: 'Registration Status',
      type: 'string',
      options: {
        list: [
          {title: 'Pending Review', value: 'pending'},
          {title: 'Approved', value: 'approved'},
          {title: 'Rejected', value: 'rejected'},
          {title: 'Waitlisted', value: 'waitlisted'},
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      description: 'Notes for editors (not visible to participants)',
      type: 'text',
    }),
    defineField({
      // Add this
      name: 'registrationDate',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      workshop: 'workshop.title',
      status: 'status',
    },
    prepare({
      title,
      subtitle,
      workshop,
      status,
    }: {
      title: string
      subtitle: string
      workshop: string
      status: string
    }) {
      return {
        title,
        subtitle: `${workshop ? workshop + ' | ' : ''}${subtitle}`,
        media: () => <StatusIcon status={status} />, // Add dynamic icon
      }
    },
  },
})

const StatusIcon = ({status}: {status: string}) => {
  const baseStyle = {
    width: '100%',
    height: '100%',
    // borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
  }

  switch (status) {
    case 'approved':
      return <div style={{...baseStyle, backgroundColor: '#07F25B', color: '#1D53FF'}}>✓</div>
    case 'pending':
      return <div style={{...baseStyle, backgroundColor: '#FFCC00', color: '#81520A'}}>⏳</div>
    case 'rejected':
      return <div style={{...baseStyle, backgroundColor: '#F50806', color: '#D2D2D2'}}>✗</div>
    case 'waitlisted':
      return <div style={{...baseStyle, backgroundColor: '#cccccc', color: 'white'}}>⏰</div>
    default:
      return <div style={{...baseStyle, backgroundColor: '#9CA3AF', color: 'white'}}>?</div>
  }
}
