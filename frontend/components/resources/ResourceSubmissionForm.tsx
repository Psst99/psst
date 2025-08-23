'use client'

import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  resourceSubmissionSchema,
  ResourceSubmissionData,
} from '@/lib/schemas/resource'
import { FormField } from '@/components/form/FormField'
import { TextInput } from '@/components/form/TextInput'

const TAGS = [
  { id: 'software', label: 'Software', color: 'bg-[#FE93E7] text-white' },
  { id: 'audio', label: 'Audio', color: 'bg-[#1D53FF] text-white' },
  { id: 'free', label: 'Free', color: 'bg-[#FFCC00] text-[#81520A]' },
  { id: 'images', label: 'Images', color: 'bg-[#FE93E7] text-white' },
  { id: 'music', label: 'Music', color: 'bg-[#A20018] text-white' },
  {
    id: 'creative-commons',
    label: 'Creative Commons',
    color: 'bg-[#00FFDD] text-[#4E4E4E]',
  },
  { id: 'tools', label: 'Tools', color: 'bg-[#6600ff] text-white' },
  { id: 'archive', label: 'Archive', color: 'bg-[#FE93E7] text-[#1D53FF]' },
]

interface ResourceSubmissionFormProps {
  onSubmit?: (data: ResourceSubmissionData) => Promise<void>
}

export const ResourceSubmissionForm: React.FC<ResourceSubmissionFormProps> = ({
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResourceSubmissionData>({
    resolver: zodResolver(resourceSubmissionSchema),
    defaultValues: {
      title: '',
      url: '',
      email: '',
      tags: [],
      description: '',
    },
  })

  const toggleTag = (tagId: string) => {
    const updatedTags = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId]

    setSelectedTags(updatedTags)
    setValue('tags', updatedTags)
  }

  const removeTag = (tagId: string) => {
    const updatedTags = selectedTags.filter((id) => id !== tagId)
    setSelectedTags(updatedTags)
    setValue('tags', updatedTags)
  }

  const handleFormSubmit: SubmitHandler<ResourceSubmissionData> = async (
    data
  ) => {
    if (onSubmit) {
      await onSubmit(data)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/submit-resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      // Redirect to success page
      router.push('/resources/submit/success')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='p-4 h-full w-full md:max-w-[65vw] mx-auto'>
      <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
        <FormField
          bgClassName='bg-[#FE93E7]'
          label='Title'
          error={errors.title}
          required
        >
          <TextInput
            registration={register('title')}
            inputClassName='text-[#FE93E7]'
            fieldClassName='bg-[#FE93E7]'
          />
        </FormField>

        <FormField
          bgClassName='bg-[#FE93E7]'
          label='URL'
          error={errors.link} // Changed from errors.url
          required
        >
          <TextInput
            registration={register('link')} // Changed from 'url'
            type='url'
            placeholder='https://...'
            inputClassName='text-[#FE93E7]'
            fieldClassName='bg-[#FE93E7]'
          />
        </FormField>

        <FormField
          bgClassName='bg-[#FE93E7]'
          label='E-mail'
          error={errors.email}
          required
        >
          <TextInput
            registration={register('email')}
            type='email'
            inputClassName='text-[#FE93E7]'
            fieldClassName='bg-[#FE93E7]'
          />
        </FormField>

        <FormField
          bgClassName='bg-[#FE93E7]'
          label='Tag(s)'
          error={errors.tags}
          required
        >
          <div className='bg-white rounded-b-lg p-4 md:w-full md:rounded-l-none md:rounded-tr-lg'>
            <div className='flex items-center justify-between mb-3'>
              <span className='text-[#FE93E7] font-medium'>Select tags:</span>
              <button
                type='button'
                onClick={() => setShowTagDropdown(!showTagDropdown)}
                className='text-[#FE93E7] text-lg'
              >
                {showTagDropdown ? '▲' : '▼'}
              </button>
            </div>

            {/* Selected Tags */}
            <div className='flex flex-wrap gap-2 mb-3'>
              {selectedTags.map((tagId) => {
                const tag = TAGS.find((t) => t.id === tagId)
                return tag ? (
                  <span
                    key={tagId}
                    className={`${tag.color} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2`}
                  >
                    {tag.label}
                    <button
                      type='button'
                      onClick={() => removeTag(tagId)}
                      className='text-current hover:opacity-70'
                    >
                      ×
                    </button>
                  </span>
                ) : null
              })}
            </div>

            {/* Tag Dropdown */}
            {showTagDropdown && (
              <div className='border border-gray-200 rounded-lg p-2 bg-gray-50 max-h-48 overflow-y-auto'>
                {TAGS.map((tag) => (
                  <button
                    key={tag.id}
                    type='button'
                    onClick={() => toggleTag(tag.id)}
                    className={`w-full text-left p-2 rounded hover:bg-gray-100 ${
                      selectedTags.includes(tag.id)
                        ? 'bg-gray-200 font-medium'
                        : ''
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </FormField>

        <FormField
          bgClassName='bg-[#FE93E7]'
          label='Description'
          error={errors.description}
          required
        >
          <TextInput
            registration={register('description')}
            isTextArea
            rows={4}
            inputClassName='text-[#FE93E7]'
            fieldClassName='bg-[#FE93E7]'
          />
        </FormField>

        {error && <div className='text-red-600 text-center'>{error}</div>}

        <button
          type='submit'
          disabled={isSubmitting}
          className='mt-16 bg-[#FE93E7] text-white text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-64 h-64 rounded-full text-center mx-auto block disabled:opacity-50'
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
