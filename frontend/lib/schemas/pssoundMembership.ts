import { z } from 'zod'

export const pssoundMembershipSchema = z.object({
  collectiveName: z.string().min(2, 'Collective name is required'),
  isPolitical: z.array(z.string()).optional(),
  otherPolitical: z.string().optional(),
  caribbeanOrAfro: z.enum(['true', 'false'], {
    errorMap: () => ({ message: 'Please select Yes or No' }),
  }),
  qualifiedSoundEngineer: z.enum(['yes', 'no_commit'], {
    errorMap: () => ({ message: 'Please select an option' }),
  }),
  annualContribution: z.string().refine(
    (val) => {
      const num = Number(val)
      return !isNaN(num) && num >= 75 && num <= 150
    },
    { message: 'Contribution must be between 75 and 150 euros' }
  ),
  charterSigned: z.boolean().refine((val) => val === true, {
    message: 'You must certify the charter is signed',
  }),
})
export type PssoundMembershipFormData = z.infer<typeof pssoundMembershipSchema>
