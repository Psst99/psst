import { z } from 'zod'

export const resourceSubmissionSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  link: z.string().url('Must be a valid URL'),
  email: z.string().email('Valid email is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  description: z.string().min(10, 'Description is required'),
})

export type ResourceSubmissionData = z.infer<typeof resourceSubmissionSchema>
