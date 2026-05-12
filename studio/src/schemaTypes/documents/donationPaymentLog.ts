import {defineField, defineType} from 'sanity'

export const donationPaymentLog = defineType({
  name: 'donationPaymentLog',
  title: 'Donation Payment Log',
  type: 'document',
  fields: [
    defineField({
      name: 'paymentId',
      title: 'Mollie payment ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Payment status',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'paidAt',
      title: 'Paid at',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'amount',
      title: 'Amount',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'donorName',
      title: 'Donor name',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'donorEmail',
      title: 'Donor email',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'createdAt',
      title: 'Logged at',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'confirmationEmailSent',
      title: 'Confirmation email sent',
      type: 'boolean',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      donorName: 'donorName',
      donorEmail: 'donorEmail',
      amount: 'amount',
      currency: 'currency',
      paidAt: 'paidAt',
      status: 'status',
    },
    prepare(selection) {
      const donor = selection.donorName || selection.donorEmail || 'Anonymous donor'
      const amount = selection.amount
        ? `${selection.amount}${selection.currency ? ` ${selection.currency}` : ''}`
        : undefined
      const subtitle = [amount, selection.status, selection.paidAt].filter(Boolean).join(' | ')

      return {
        title: donor,
        subtitle,
      }
    },
  },
})
