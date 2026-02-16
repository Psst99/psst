import {z} from 'zod'

export const resourceSubmissionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z
    .string()
    .optional()
    .transform((value) => (value === '' ? undefined : value))
    .refine((value) => !value || z.string().url().safeParse(value).success, {
      message: 'Must be a valid URL',
    }),
  email: z.string().email('Must be a valid email'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  tags: z.array(z.string()).optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
})

export type ResourceSubmissionData = z.infer<typeof resourceSubmissionSchema>
