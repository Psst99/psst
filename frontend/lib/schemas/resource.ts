import {z} from 'zod'

export const resourceSubmissionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  link: z.string().url('Must be a valid URL'),
  email: z.string().email('Must be a valid email'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  tags: z.array(z.string()).optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
})

export type ResourceSubmissionData = z.infer<typeof resourceSubmissionSchema>
