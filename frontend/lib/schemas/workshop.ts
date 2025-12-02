import {z} from 'zod'

export const workshopRegistrationSchema = z.object({
  workshop: z.object({
    _type: z.literal('reference'),
    _ref: z.string(),
  }),
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  selectedDates: z.array(z.string()).min(1, 'Select at least one date'),
  message: z.string().min(1, 'Please tell us why you want to join').max(1000), // Change from motivation
})

export type WorkshopRegistrationData = z.infer<typeof workshopRegistrationSchema>
