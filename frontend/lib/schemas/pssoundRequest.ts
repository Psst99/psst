import {z} from 'zod'
import {isValidUrl, normalizeUrlInput} from '@/lib/url'

const optionalLinkSchema = z
  .string()
  .transform((value) => {
    if (!value.trim()) return undefined
    return normalizeUrlInput(value)
  })
  .refine((value) => !value || isValidUrl(value), 'Must be a valid URL')

export const marginalizedArtistSchema = z.object({
  name: z.string().min(1, 'Artist name is required'),
  link: optionalLinkSchema.optional(),
})

export const pssoundRequestSchema = z
  .object({
    eventTitle: z.string().min(2, 'Event title is required'),
    eventLink: optionalLinkSchema.optional(),
    eventLocation: z.string().min(2, 'Event location is required'),
    eventDescription: z.string().min(10, 'Description is required'),
    isPolitical: z.record(z.union([z.boolean(), z.string()])),
    // isPolitical: z.object({
    //   feminist: z.boolean(),
    //   queer: z.boolean(),
    //   racial: z.boolean(),
    //   disability: z.boolean(),
    //   fundraiser: z.string().optional(),
    //   other: z.string().optional(),
    // }),
    marginalizedArtists: z
      .array(marginalizedArtistSchema)
      .min(1, 'At least one artist is required'),
    wagePolicy: z.string().min(5, 'Please describe your wage policy'),
    eventDate: z.string().min(1, 'Event date required'),
    pickupDate: z.string().min(1, 'Pick-up date required'),
    returnDate: z.string().min(1, 'Return date required'),
    vehicleCert: z.boolean().refine((val) => val, {message: 'Vehicle certification required'}),
    teamCert: z.boolean().refine((val) => val, {message: 'Team certification required'}),
    charterCert: z.boolean().refine((val) => val, {message: 'Charter certification required'}),
    membershipCert: z.boolean(),
    collective: z.string().optional(),
  })
  .refine((data) => data.pickupDate <= data.returnDate, {
    path: ['returnDate'],
    message: 'Return date must be the same as or after the pick-up date',
  })

export type PssoundRequestFormData = z.infer<typeof pssoundRequestSchema>
