// lib/schemas/artist.ts
import { z } from 'zod'

export const artistFormSchema = z
  .object({
    artistName: z.string().min(1, 'Artist name is required').max(100),
    pronouns: z.enum([
      'he/him',
      'she/her',
      'they/them',
      'he/they',
      'she/they',
      'prefer_not_to_say',
      'other',
    ]),
    customPronouns: z.string().optional(),
    email: z.string().email('Invalid email address'),
    categories: z.array(z.string()).min(1, 'At least one category is required'),
    tags: z.array(z.string()).min(1, 'At least one tag is required'),
    links: z
      .array(z.string().url('Invalid URL'))
      .min(1, 'At least one link is required'),
    description: z
      .string()
      .min(1, 'Description is required')
      .max(1000, 'Description is too long'),
  })
  .refine(
    (data) => {
      // Custom validation: if pronouns is 'other', customPronouns is required
      if (data.pronouns === 'other' && !data.customPronouns?.trim()) {
        return false
      }
      return true
    },
    {
      message: 'Custom pronouns are required when "Other" is selected',
      path: ['customPronouns'],
    }
  )

export type ArtistFormData = z.infer<typeof artistFormSchema>
