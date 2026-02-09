'use client'

import React, {useState} from 'react'
import {useForm, SubmitHandler} from 'react-hook-form'
import {useRouter} from 'next/navigation'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import {resourceSubmissionSchema, ResourceSubmissionData} from '@/lib/schemas/resource'
import {FormField} from '@/components/form/FormField'
import {TextInput} from '@/components/form/TextInput'
import {MultiSelectDropdown} from '@/components/form/MultiSelectDropdown'

const MAX_PDF_SIZE_MB = 10
const MAX_PDF_SIZE_BYTES = MAX_PDF_SIZE_MB * 1024 * 1024

const resourceSubmissionFormSchema = resourceSubmissionSchema
  .extend({
    file: z
      .any()
      .optional()
      .refine(
        (value) => !value || value.length === 0 || value[0]?.type === 'application/pdf',
        'Only PDF files are allowed',
      )
      .refine(
        (value) => !value || value.length === 0 || value[0]?.size <= MAX_PDF_SIZE_BYTES,
        `PDF must be ${MAX_PDF_SIZE_MB}MB or smaller`,
      ),
  })
  .superRefine((data, ctx) => {
    const hasUrl = !!data.url
    const hasFile = !!data.file && data.file.length > 0
    if (hasUrl || hasFile) return

    const message = 'Provide a URL or upload a PDF'
    ctx.addIssue({code: z.ZodIssueCode.custom, path: ['url'], message})
    ctx.addIssue({code: z.ZodIssueCode.custom, path: ['file'], message})
  })

type ResourceSubmissionFormData = ResourceSubmissionData & {
  file?: FileList
}

interface ResourceSubmissionFormProps {
  onSubmit?: (data: ResourceSubmissionFormData) => Promise<void>
  categories?: {_id: string; title: string}[]
  tags?: {_id: string; title: string}[]
}

export const ResourceSubmissionForm: React.FC<ResourceSubmissionFormProps> = ({
  onSubmit,
  categories,
  tags,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    formState: {errors, touchedFields, isSubmitted},
  } = useForm<ResourceSubmissionFormData>({
    resolver: zodResolver(resourceSubmissionFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      url: '',
      email: '',
      categories: [],
      tags: [],
      description: '',
    },
  })

  const handleFormSubmit: SubmitHandler<ResourceSubmissionFormData> = async (data) => {
    if (onSubmit) {
      await onSubmit(data)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('title', data.title)
      if (data.url) {
        formData.append('url', data.url)
      }
      formData.append('email', data.email)
      formData.append('categories', JSON.stringify(data.categories))
      formData.append('tags', JSON.stringify(data.tags ?? []))
      formData.append('description', data.description)

      if (data.file && data.file[0]) {
        formData.append('file', data.file[0])
      }

      const response = await fetch('/api/submit-resource', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      router.push('/resources/submit/success')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const tagOptions =
    tags?.map((t) => ({
      id: t._id,
      label: t.title,
      color: 'bg-[#FE93E7] text-white',
    })) ?? []

  const categoryOptions =
    categories?.map((c) => ({
      id: c._id,
      label: c.title,
      color: 'bg-[#FE93E7] text-white',
    })) ?? []

  return (
    <div className="p-4 h-full w-full md:max-w-[65vw] mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          bgClassName="bg-[#FE93E7]"
          label="Title"
          error={errors.title}
          required
          showError={!!touchedFields.title || isSubmitted}
        >
          <TextInput
            registration={register('title')}
            inputClassName="text-[#FE93E7]"
            fieldClassName="bg-[#FE93E7]"
          />
        </FormField>

        <FormField
          bgClassName="bg-[#FE93E7]"
          label="URL"
          error={errors.url}
          showError={!!touchedFields.url || isSubmitted}
        >
          <TextInput
            registration={register('url')}
            type="url"
            placeholder="https://..."
            inputClassName="text-[#FE93E7]"
            fieldClassName="bg-[#FE93E7]"
          />
        </FormField>

        <FormField
          bgClassName="bg-[#FE93E7]"
          label="E-mail"
          error={errors.email}
          required
          showError={!!touchedFields.email || isSubmitted}
        >
          <TextInput
            registration={register('email')}
            type="email"
            inputClassName="text-[#FE93E7]"
            fieldClassName="bg-[#FE93E7]"
          />
        </FormField>

        <FormField
          bgClassName="bg-[#FE93E7]"
          label="Category"
          error={errors.categories}
          required
          showError={!!touchedFields.categories || isSubmitted}
        >
          <MultiSelectDropdown
            name="categories"
            placeholder="Select a category"
            control={control}
            options={categoryOptions}
            type="category"
          />
        </FormField>

        <FormField
          bgClassName="bg-[#FE93E7]"
          label="Tag(s)"
          error={errors.tags}
          showError={!!touchedFields.tags || isSubmitted}
        >
          <MultiSelectDropdown
            name="tags"
            control={control}
            options={tagOptions}
            type="tag"
            placeholder="Select tag(s)"
          />
        </FormField>

        <FormField
          bgClassName="bg-[#FE93E7]"
          label="Description"
          error={errors.description}
          required
          showError={!!touchedFields.description || isSubmitted}
        >
          <TextInput
            registration={register('description')}
            isTextArea
            rows={4}
            inputClassName="text-[#FE93E7]"
            fieldClassName="bg-[#FE93E7]"
          />
        </FormField>

        <FormField
          bgClassName="bg-[#FE93E7]"
          label="PDF"
          error={errors.file}
          showError={!!touchedFields.file || isSubmitted}
        >
          <input
            type="file"
            accept="application/pdf"
            className="w-full text-[color:var(--section-bg)] px-4 py-3 text-2xl md:text-3xl border-0 outline-0 bg-white"
            {...register('file')}
          />
        </FormField>

        {error && <div className="text-red-600 text-center">{error}</div>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-16 bg-[#FE93E7] text-white text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-64 h-64 rounded-full text-center mx-auto block disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
