'use client'

import React, {useEffect, useMemo, useState} from 'react'
import {useForm, SubmitHandler} from 'react-hook-form'
import {useRouter} from 'next/navigation'
import {zodResolver} from '@hookform/resolvers/zod'
import {workshopRegistrationSchema, WorkshopRegistrationData} from '@/lib/schemas/workshop'
import {FormField} from '@/components/form/FormField'
import {TextInput} from '@/components/form/TextInput'
import {urlForImage} from '@/sanity/lib/utils'

const EXPERIENCE_OPTIONS = [
  {value: '', label: 'Select...'},
  {value: 'beginner', label: 'Beginner'},
  {value: 'intermediate', label: 'Intermediate'},
  {value: 'advanced', label: 'Advanced'},
] as const

type WorkshopOption = {
  _id: string
  title: string
  slug?: string
  coverImage?: any
  dates: string[]
  totalSpots: number
  availableSpots: number
}

interface WorkshopRegistrationFormProps {
  workshops: WorkshopOption[]
  initialWorkshopId: string
  onSubmit?: (data: WorkshopRegistrationData) => Promise<void>
}

export const WorkshopRegistrationForm: React.FC<WorkshopRegistrationFormProps> = ({
  workshops,
  initialWorkshopId,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedWorkshopId, setSelectedWorkshopId] = useState(initialWorkshopId)
  const router = useRouter()

  const selectedWorkshop = useMemo(
    () => workshops.find((workshop) => workshop._id === selectedWorkshopId) || workshops[0],
    [selectedWorkshopId, workshops],
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useForm<WorkshopRegistrationData>({
    resolver: zodResolver(workshopRegistrationSchema),
    defaultValues: {
      workshop: {_type: 'reference', _ref: selectedWorkshop?._id},
      name: '',
      email: '',
      selectedDates: [],
      message: '',
    },
  })

  useEffect(() => {
    if (selectedWorkshop) {
      setValue('workshop', {_type: 'reference', _ref: selectedWorkshop._id})
      setValue('selectedDates', [])
    }
  }, [selectedWorkshop, setValue])

  const selectedDates = watch('selectedDates') || []
  const isFull = !selectedWorkshop || selectedWorkshop.availableSpots <= 0

  const handleFormSubmit: SubmitHandler<WorkshopRegistrationData> = async (data) => {
    if (isFull) return
    if (onSubmit) {
      await onSubmit(data)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/register-workshop', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      router.push('/workshops/register/success')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedWorkshop) {
    return <p className="text-center text-lg">No workshops available for registration.</p>
  }

  return (
    <div className="h-full w-full md:max-w-[65vw] mx-auto mt-4">
      {/* Poster */}
      {selectedWorkshop.coverImage?.asset?._ref && (
        <div className="relative w-full h-64 md:h-[28rem] mb-8">
          <img
            src={
              urlForImage(selectedWorkshop.coverImage)
                ?.height(1200)
                .width(1200)
                .auto('format')
                .url() ?? ''
            }
            alt={selectedWorkshop.title}
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>
      )}

      {/* Availability */}
      {/* <div className="mb-6 text-center text-lg">
        <p>
          Spots available: {selectedWorkshop.availableSpots} / {selectedWorkshop.totalSpots}
        </p>
        {isFull && (
          <p className="text-red-600 mt-1 tracking-tight">
            Registration is closed for this workshop.
          </p>
        )}
      </div> */}

      {isFull ? (
        <div className="mb-6 text-center text-lg">
          <p className="text-red-600 mt-1 tracking-tight">
            Registration is closed for this workshop.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <FormField bgClassName="bg-[#F50806]" label="Workshop" required>
            <select
              value={selectedWorkshopId}
              onChange={(event) => setSelectedWorkshopId(event.target.value)}
              className="w-full rounded-t-none rounded-b-lg text-[#F50806] px-4 py-2 text-2xl md:text-3xl border-0 outline-0 md:rounded-l-none md:rounded-tr-lg bg-white"
            >
              {workshops.map((workshop) => (
                <option key={workshop._id} value={workshop._id}>
                  {workshop.title}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            bgClassName="bg-[#F50806]"
            label="Select Dates"
            error={errors.selectedDates}
            required
          >
            <select
              multiple
              value={selectedDates}
              onChange={(event) => {
                const values = Array.from(event.target.selectedOptions, (option) => option.value)
                setValue('selectedDates', values)
              }}
              className="w-full rounded-t-none rounded-b-lg text-[#F50806] px-4 py-2 text-2xl md:text-3xl border-0 outline-0 md:rounded-l-none md:rounded-tr-lg bg-white h-40"
              disabled={isFull}
            >
              {selectedWorkshop.dates?.map((date, idx) => (
                <option key={idx} value={date}>
                  {new Date(date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </option>
              ))}
            </select>
          </FormField>

          <FormField bgClassName="bg-[#F50806]" label="Name" error={errors.name} required>
            <TextInput
              registration={register('name')}
              inputClassName="text-[#F50806]"
              fieldClassName="bg-[#F50806]"
              disabled={isFull}
            />
          </FormField>

          <FormField bgClassName="bg-[#F50806]" label="E-mail" error={errors.email} required>
            <TextInput
              registration={register('email')}
              type="email"
              inputClassName="text-[#F50806]"
              fieldClassName="bg-[#F50806]"
              disabled={isFull}
            />
          </FormField>

          <FormField
            bgClassName="bg-[#F50806]"
            label="Why do you want to join?"
            error={errors.message}
            required
          >
            <TextInput
              registration={register('message')}
              isTextArea
              rows={3}
              inputClassName="text-[#F50806]"
              fieldClassName="bg-[#F50806]"
              disabled={isFull}
            />
          </FormField>

          {error && <div className="text-red-600 text-center">{error}</div>}

          <button
            type="submit"
            disabled={isSubmitting || isFull}
            className="mt-16 bg-[#F50806] text-white text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-64 h-64 rounded-full text-center mx-auto block disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}
    </div>
  )
}
