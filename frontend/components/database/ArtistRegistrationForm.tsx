'use client'

import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {artistFormSchema, type ArtistFormData} from '@/lib/schemas/artist'
import {FormField} from '@/components/form/FormField'
import {TextInput} from '@/components/form/TextInput'
import {MultiSelectDropdown} from '@/components/form/MultiSelectDropdown'
import {SocialLinksInput} from '@/components/form/SocialLinksInput'
import {useRouter} from 'next/navigation'

const PRONOUN_OPTIONS = [
  {value: 'he/him', label: 'He/Him'},
  {value: 'she/her', label: 'She/Her'},
  {value: 'they/them', label: 'They/Them'},
  {value: 'he/they', label: 'He/They'},
  {value: 'she/they', label: 'She/They'},
  {value: 'prefer_not_to_say', label: 'Prefer not to say'},
  {value: 'other', label: 'Other'},
]

interface ArtistRegistrationFormProps {
  onSubmit?: (data: ArtistFormData) => Promise<void>
  initialData?: Partial<ArtistFormData>
  categories?: {_id: string; title: string}[]
  tags?: {_id: string; title: string}[]
}

export const ArtistRegistrationForm: React.FC<ArtistRegistrationFormProps> = ({
  categories,
  tags,
  onSubmit,
  initialData,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'error' | null
    message: string
  }>({type: null, message: ''})

  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: {errors, touchedFields, isSubmitted},
  } = useForm<ArtistFormData>({
    resolver: zodResolver(artistFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
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
    setSubmitStatus({type: null, message: ''})

    try {
      const response = await fetch('/api/register-artist', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Submission failed')

      router.push('/database/submit/success')
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Something went wrong',
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
    <div className="p-6 h-full w-full min-[69.375rem]:max-w-[65vw] mx-auto min-[69.375rem]:p-4">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 form-scroll-bottom-space">
        <FormField
          label="Name"
          error={errors.artistName}
          required
          showError={!!touchedFields.artistName || isSubmitted}
        >
          <TextInput registration={register('artistName')} />
        </FormField>

        <FormField
          label="Pronouns"
          error={errors.pronouns}
          required
          showError={!!touchedFields.pronouns || isSubmitted}
        >
          <select
            {...register('pronouns')}
            className="w-full rounded-t-none rounded-b-lg min-[69.375rem]:rounded-b-none text-[color:var(--section-bg)] px-4 py-2 text-xl min-[69.375rem]:text-3xl border-0 outline-0 min-[69.375rem]:rounded-l-none min-[69.375rem]:rounded-tr-lg min-[69.375rem]:rounded-br-lg bg-white h-full"
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
            label="Custom Pronouns"
            error={errors.customPronouns}
            required
            showError={!!touchedFields.customPronouns || isSubmitted}
          >
            <TextInput registration={register('customPronouns')} />
          </FormField>
        )}

        <FormField
          label="E-mail"
          error={errors.email}
          required
          showError={!!touchedFields.email || isSubmitted}
        >
          <TextInput registration={register('email')} type="email" />
        </FormField>

        <FormField
          label="Categorie(s)"
          error={errors.categories}
          required
          showError={!!touchedFields.categories || isSubmitted}
        >
          <MultiSelectDropdown
            name="categories"
            placeholder="Select your categorie(s)"
            control={control}
            options={categoryOptions}
            type="category"
          />
        </FormField>

        <FormField
          label="Tag(s)"
          error={errors.tags}
          showError={!!touchedFields.tags || isSubmitted}
        >
          <MultiSelectDropdown
            name="tags"
            control={control}
            options={tagOptions}
            type="tag"
            placeholder="Select your tag(s)"
          />
        </FormField>

        <FormField
          label="Link(s)"
          error={errors.links}
          showError={!!touchedFields.links || isSubmitted}
        >
          <SocialLinksInput name="links" control={control} />
        </FormField>

        <FormField
          label="Description"
          error={errors.description}
          showError={!!touchedFields.description || isSubmitted}
        >
          <TextInput registration={register('description')} isTextArea rows={4} />
        </FormField>

        {submitStatus.type && (
          <div className="text-red-600">{submitStatus.message}</div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-16 section-bg section-fg text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-64 h-64 rounded-full text-center mx-auto block disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
