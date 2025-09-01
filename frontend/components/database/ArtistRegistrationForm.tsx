'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { artistFormSchema, ArtistFormData } from '@/lib/schemas/artist'
import { FormField } from '@/components/form/FormField'
import { TextInput } from '@/components/form/TextInput'
import { MultiSelectDropdown } from '@/components/form/MultiSelectDropdown'
import { SocialLinksInput } from '@/components/form/SocialLinksInput'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  { id: 'dj', label: 'DJ', color: 'bg-[#6600ff] text-white' },
  { id: 'producer', label: 'PRODUCER', color: 'bg-[#6600ff] text-white' },
  { id: 'vocalist', label: 'VOCALIST', color: 'bg-[#6600ff] text-white' },
  {
    id: 'instrumentalist',
    label: 'INSTRUMENTALIST',
    color: 'bg-[#6600ff] text-white',
  },
]

const TAGS = [
  { id: 'electronic', label: 'electronic', color: 'bg-[#6600ff] text-white' },
  { id: 'ambient', label: 'ambient', color: 'bg-[#07f25b] text-[#81520A]' },
  { id: 'breaks', label: 'breaks', color: 'bg-[#1D53FF] text-white' },
  { id: 'bass', label: 'bass', color: 'bg-[#FFCC00] text-[#81520A]' },
  { id: 'dub', label: 'dub', color: 'bg-[#A20018] text-white' },
  { id: 'techno', label: 'techno', color: 'bg-[#6600ff] text-white' },
  { id: 'house', label: 'house', color: 'bg-[#00FFDD] text-[#4E4E4E]' },
  {
    id: 'experimental',
    label: 'experimental',
    color: 'bg-[#FE93E7] text-[#1D53FF]',
  },
]

const PRONOUN_OPTIONS = [
  { value: 'he/him', label: 'He/Him' },
  { value: 'she/her', label: 'She/Her' },
  { value: 'they/them', label: 'They/Them' },
  { value: 'he/they', label: 'He/They' },
  { value: 'she/they', label: 'She/They' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
  { value: 'other', label: 'Other' },
]

interface ArtistRegistrationFormProps {
  onSubmit?: (data: ArtistFormData) => Promise<void>
  initialData?: Partial<ArtistFormData>
  categories?: { _id: string; title: string }[]
  tags?: { _id: string; title: string }[]
}

export const ArtistRegistrationForm: React.FC<ArtistRegistrationFormProps> = ({
  categories,
  tags,
  onSubmit,
  initialData,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ArtistFormData>({
    resolver: zodResolver(artistFormSchema),
    defaultValues: {
      artistName: '',
      pronouns: 'prefer_not_to_say',
      customPronouns: '',
      email: '',
      categories: [],
      tags: [],
      links: [],
      description: '',
      ...initialData,
    },
  })

  const selectedPronouns = watch('pronouns')

  const handleFormSubmit = async (data: ArtistFormData) => {
    if (onSubmit) {
      await onSubmit(data)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/register-artist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      setSubmitStatus({
        type: 'success',
        message: 'Thank you! Your submission was received.',
      })
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Something went wrong',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const categoryOptions =
    categories?.map((c) => ({
      id: c._id,
      label: c.title,
      color: 'bg-[#6600ff] text-white',
    })) ?? []

  const tagOptions =
    tags?.map((t) => ({
      id: t._id,
      label: t.title,
      color: 'bg-[#A20018] text-[#00FFDD]',
    })) ?? []

  return (
    <div className='p-4 h-full w-full md:max-w-[65vw] mx-auto'>
      <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
        <FormField
          label='Name'
          error={errors.artistName}
          required
          bgClassName='bg-[#6600ff]'
        >
          <TextInput registration={register('artistName')} />
        </FormField>

        <FormField
          bgClassName='bg-[#6600ff]'
          label='Pronouns'
          error={errors.pronouns}
          required
        >
          <select
            {...register('pronouns')}
            className='w-full rounded-t-none rounded-b-lg text-[#6600ff] px-4 py-2 text-2xl md:text-3xl border-0 outline-0 md:rounded-l-none md:rounded-tr-lg bg-white h-full'
          >
            {PRONOUN_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        {selectedPronouns === 'other' && (
          <FormField
            bgClassName='bg-[#6600ff]'
            label='Custom Pronouns'
            error={errors.customPronouns}
            required
          >
            <TextInput registration={register('customPronouns')} />
          </FormField>
        )}

        <FormField
          bgClassName='bg-[#6600ff]'
          label='E-mail'
          error={errors.email}
          required
        >
          <TextInput registration={register('email')} type='email' />
        </FormField>

        <FormField
          bgClassName='bg-[#6600ff]'
          label='Categorie(s)'
          error={errors.categories}
          required
        >
          <MultiSelectDropdown
            name='categories'
            control={control}
            options={categoryOptions}
            renderTag={(option, onRemove) => (
              <span
                key={option.id}
                className={`${option.color} p-1.25 py-0.25 font-mono text-lg uppercase font-thin leading-tight flex items-center gap-3`}
              >
                {option.label}
                <button
                  type='button'
                  onClick={onRemove}
                  className='text-current hover:opacity-70'
                >
                  ×
                </button>
              </span>
            )}
          />
        </FormField>

        <FormField
          bgClassName='bg-[#6600ff]'
          label='Tag(s)'
          error={errors.tags}
        >
          <MultiSelectDropdown
            name='tags'
            control={control}
            options={tagOptions}
          />
        </FormField>

        <FormField
          bgClassName='bg-[#6600ff]'
          label='Link(s)'
          error={errors.links}
        >
          <SocialLinksInput name='links' control={control} />
        </FormField>

        <FormField
          bgClassName='bg-[#6600ff]'
          label='Description'
          error={errors.description}
        >
          <TextInput
            registration={register('description')}
            isTextArea
            rows={4}
          />
        </FormField>

        {submitStatus.type && (
          <div
            className={`${
              submitStatus.type === 'success'
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <button
          type='submit'
          disabled={isSubmitting}
          className='mt-16 bg-[#6600ff] text-white text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-64 h-64 rounded-full text-center mx-auto block disabled:opacity-50'
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
