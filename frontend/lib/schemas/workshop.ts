import { z } from 'zod'

export const workshopRegistrationSchema = z.object({
  workshopId: z.string().min(1, 'Workshop selection is required'),
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  experience: z.enum(['beginner', 'intermediate', 'advanced'], {
    errorMap: () => ({ message: 'Please select your experience level' }),
  }),
  motivation: z
    .string()
    .min(1, 'Please tell us why you want to join')
    .max(1000),
  notes: z.string().optional(),
})

export type WorkshopRegistrationData = z.infer<
  typeof workshopRegistrationSchema
>
