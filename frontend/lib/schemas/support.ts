import {z} from 'zod'

const optionalTrimmedString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(''))

export const donationCheckoutSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than 0').max(10000),
  name: optionalTrimmedString(100),
  email: optionalTrimmedString(255).refine((value) => !value || z.string().email().safeParse(value).success, {
    message: 'Invalid email address',
  }),
  message: optionalTrimmedString(500),
  redirectPath: z.string().trim().max(500).optional(),
})

export const newsletterSubscriptionSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  name: optionalTrimmedString(100),
  sourcePath: z.string().trim().max(300).optional(),
})

export type DonationCheckoutData = z.infer<typeof donationCheckoutSchema>
export type NewsletterSubscriptionData = z.infer<typeof newsletterSubscriptionSchema>
