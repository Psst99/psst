'use client'

import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  workshopRegistrationSchema,
  WorkshopRegistrationData,
} from '@/lib/schemas/workshop'
import { FormField } from '@/components/form/FormField'
import { TextInput } from '@/components/form/TextInput'

const EXPERIENCE_OPTIONS = [
  { value: '', label: 'Select...' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const

interface WorkshopRegistrationFormProps {
  workshopId?: string
  workshopTitle?: string
  onSubmit?: (data: WorkshopRegistrationData) => Promise<void>
}

export const WorkshopRegistrationForm: React.FC<
  WorkshopRegistrationFormProps
> = ({ workshopId, workshopTitle, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkshopRegistrationData>({
    resolver: zodResolver(workshopRegistrationSchema),
    defaultValues: {
      workshopId,
      name: '',
      email: '',
      phone: '',
      experience: '' as any,
      motivation: '',
      notes: '',
    },
  })

  const handleFormSubmit: SubmitHandler<WorkshopRegistrationData> = async (
    data
  ) => {
    if (onSubmit) {
      await onSubmit(data)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/register-workshop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      // Redirect to success page
      router.push('/workshops/register/success')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='h-full w-full md:max-w-[65vw] mx-auto mt-16'>
      {/* {workshopTitle && (
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold text-[#F50806]'>Register for:</h1>
          <h2 className='text-2xl text-gray-800 mt-2'>{workshopTitle}</h2>
        </div>
      )} */}

      <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
        <FormField
          bgClassName='bg-[#F50806]'
          label='Name'
          error={errors.name}
          required
        >
          <TextInput
            registration={register('name')}
            inputClassName='text-[#F50806]'
            fieldClassName='bg-[#F50806]'
          />
        </FormField>

        <FormField
          bgClassName='bg-[#F50806]'
          label='E-mail'
          error={errors.email}
          required
        >
          <TextInput
            registration={register('email')}
            type='email'
            inputClassName='text-[#F50806]'
            fieldClassName='bg-[#F50806]'
          />
        </FormField>

        <FormField
          bgClassName='bg-[#F50806]'
          label='Phone'
          error={errors.phone}
        >
          <TextInput
            registration={register('phone')}
            type='tel'
            inputClassName='text-[#F50806]'
            fieldClassName='bg-[#F50806]'
          />
        </FormField>

        <FormField
          bgClassName='bg-[#F50806]'
          label='Experience Level'
          error={errors.experience}
          required
        >
          <select
            {...register('experience')}
            className='w-full rounded-t-none rounded-b-lg text-[#F50806] px-4 py-2 text-2xl md:text-3xl border-0 outline-0 md:rounded-l-none md:rounded-tr-lg bg-white h-full'
          >
            {EXPERIENCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          bgClassName='bg-[#F50806]'
          label='Why do you want to join?'
          error={errors.motivation}
          required
        >
          <TextInput
            registration={register('motivation')}
            isTextArea
            rows={3}
            inputClassName='text-[#F50806]'
            fieldClassName='bg-[#F50806]'
          />
        </FormField>

        <FormField
          bgClassName='bg-[#F50806]'
          label='Notes / Special Requirements'
          error={errors.notes}
        >
          <TextInput
            registration={register('notes')}
            isTextArea
            rows={2}
            inputClassName='text-[#F50806]'
            fieldClassName='bg-[#F50806]'
          />
        </FormField>

        {error && <div className='text-red-600 text-center'>{error}</div>}

        <button
          type='submit'
          disabled={isSubmitting}
          className='mt-16 bg-[#F50806] text-white text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-64 h-64 rounded-full text-center mx-auto block disabled:opacity-50'
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
