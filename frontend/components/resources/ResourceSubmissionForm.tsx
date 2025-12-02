'use client'

import React, {useState} from 'react'
import {useForm, SubmitHandler} from 'react-hook-form'
import {useRouter} from 'next/navigation'
import {zodResolver} from '@hookform/resolvers/zod'
import {resourceSubmissionSchema, ResourceSubmissionData} from '@/lib/schemas/resource'
import {FormField} from '@/components/form/FormField'
import {TextInput} from '@/components/form/TextInput'
import {MultiSelectDropdown} from '@/components/form/MultiSelectDropdown'

interface ResourceSubmissionFormProps {
  onSubmit?: (data: ResourceSubmissionData) => Promise<void>
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
    formState: {errors},
  } = useForm<ResourceSubmissionData>({
    resolver: zodResolver(resourceSubmissionSchema),
    defaultValues: {
      title: '',
      link: '',
      email: '',
      categories: [],
      tags: [],
      description: '',
    },
  })

  const handleFormSubmit: SubmitHandler<ResourceSubmissionData> = async (data) => {
    if (onSubmit) {
      await onSubmit(data)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/submit-resource', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
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
        <FormField bgClassName="bg-[#FE93E7]" label="Title" error={errors.title} required>
          <TextInput
            registration={register('title')}
            inputClassName="text-[#FE93E7]"
            fieldClassName="bg-[#FE93E7]"
          />
        </FormField>

        <FormField bgClassName="bg-[#FE93E7]" label="URL" error={errors.link} required>
          <TextInput
            registration={register('link')}
            type="url"
            placeholder="https://..."
            inputClassName="text-[#FE93E7]"
            fieldClassName="bg-[#FE93E7]"
          />
        </FormField>

        <FormField bgClassName="bg-[#FE93E7]" label="E-mail" error={errors.email} required>
          <TextInput
            registration={register('email')}
            type="email"
            inputClassName="text-[#FE93E7]"
            fieldClassName="bg-[#FE93E7]"
          />
        </FormField>

        <FormField bgClassName="bg-[#FE93E7]" label="Category" error={errors.categories} required>
          <MultiSelectDropdown
            name="categories"
            placeholder="Select a category"
            control={control}
            options={categoryOptions}
            type="category"
          />
        </FormField>

        <FormField bgClassName="bg-[#FE93E7]" label="Tag(s)" error={errors.tags}>
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
        >
          <TextInput
            registration={register('description')}
            isTextArea
            rows={4}
            inputClassName="text-[#FE93E7]"
            fieldClassName="bg-[#FE93E7]"
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
