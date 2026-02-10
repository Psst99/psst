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

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function isSameDay(a: string, b: string) {
  // If your strings are ISO datetimes, this prevents timezone surprises.
  // If they're already YYYY-MM-DD, this still works fine.
  const da = new Date(a)
  const db = new Date(b)
  if (!Number.isNaN(da.getTime()) && !Number.isNaN(db.getTime())) {
    return (
      da.getFullYear() === db.getFullYear() &&
      da.getMonth() === db.getMonth() &&
      da.getDate() === db.getDate()
    )
  }
  return a === b
}

type DatesPickerProps = {
  dates: string[]
  value: string[]
  maxSelected?: number
  disabled?: boolean
  onChange: (next: string[]) => void
}

function DatesPicker({dates, value, maxSelected = 2, disabled, onChange}: DatesPickerProps) {
  const selectedCount = value.length
  const atLimit = selectedCount >= maxSelected

  const toggle = (dateStr: string) => {
    if (disabled) return

    const isSelected = value.some((v) => isSameDay(v, dateStr))

    if (isSelected) {
      onChange(value.filter((v) => !isSameDay(v, dateStr)))
      return
    }

    if (atLimit) return
    onChange([...value, dateStr])
  }

  const clearAll = () => {
    if (disabled) return
    onChange([])
  }

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-sm md:text-base opacity-80">
          Pick up to <span className="font-medium">{maxSelected}</span> dates
          <span className="mx-2">•</span>
          Selected <span className="font-medium">{selectedCount}</span>/{maxSelected}
        </div>

        <button
          type="button"
          onClick={clearAll}
          disabled={disabled || selectedCount === 0}
          className="text-sm md:text-base underline underline-offset-4 disabled:opacity-40"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {dates.map((dateStr) => {
          const selected = value.some((v) => isSameDay(v, dateStr))
          const blocked = !selected && atLimit

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => toggle(dateStr)}
              disabled={disabled}
              aria-pressed={selected}
              className={[
                'text-left rounded-2xl px-4 py-4 transition',
                'border border-black/10',
                'bg-white',
                'focus:outline-none focus:ring-2 focus:ring-black/20',
                selected ? 'bg-black text-white border-black' : '',
                blocked ? 'opacity-40' : 'hover:bg-black/5',
                disabled ? 'opacity-60 cursor-not-allowed' : '',
              ].join(' ')}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-xl md:text-2xl tracking-tight font-medium">
                  {formatDateLabel(dateStr)}
                </div>

                <div
                  className={[
                    'h-8 w-8 rounded-full grid place-items-center',
                    selected ? 'bg-white text-black' : 'bg-black/5 text-black',
                  ].join(' ')}
                  aria-hidden="true"
                >
                  {selected ? '✓' : '+'}
                </div>
              </div>

              {blocked && (
                <div className="mt-2 text-sm opacity-80">
                  Max {maxSelected} selected — unselect one to pick another
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
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
    formState: {errors, touchedFields, isSubmitted},
  } = useForm<WorkshopRegistrationData>({
    resolver: zodResolver(workshopRegistrationSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
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
          <FormField label="Workshop" required>
            <div className="relative">
              <select
                value={selectedWorkshopId}
                onChange={(event) => setSelectedWorkshopId(event.target.value)}
                className={[
                  'w-full appearance-none',
                  'rounded-t-none rounded-b-2xl md:rounded-tr-2xl',
                  'bg-white',
                  'px-4 py-3 md:py-4',
                  'text-2xl md:text-3xl tracking-tight font-medium',
                  'border border-black/10',
                  'outline-none focus:ring-2 focus:ring-black/20',
                  'section-fg',
                ].join(' ')}
              >
                {workshops.map((workshop) => (
                  <option key={workshop._id} value={workshop._id}>
                    {workshop.title}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xl opacity-70">
                ▼
              </div>
            </div>
          </FormField>

          <FormField
            label="Select Dates"
            error={errors.selectedDates}
            required
            showError={!!touchedFields.selectedDates || isSubmitted}
          >
            <DatesPicker
              dates={selectedWorkshop.dates || []}
              value={selectedDates}
              maxSelected={2}
              disabled={isFull}
              onChange={(next) => {
                setValue('selectedDates', next, {shouldTouch: true, shouldValidate: true})
              }}
            />
          </FormField>

          <FormField
            label="Name"
            error={errors.name}
            required
            showError={!!touchedFields.name || isSubmitted}
          >
            <TextInput registration={register('name')} disabled={isFull} />
          </FormField>

          <FormField
            label="E-mail"
            error={errors.email}
            required
            showError={!!touchedFields.email || isSubmitted}
          >
            <TextInput registration={register('email')} type="email" disabled={isFull} />
          </FormField>

          <FormField
            label="Why do you want to join?"
            error={errors.message}
            required
            showError={!!touchedFields.message || isSubmitted}
          >
            <TextInput registration={register('message')} isTextArea rows={3} disabled={isFull} />
          </FormField>

          {error && <div className="text-red-600 text-center">{error}</div>}

          <button
            type="submit"
            disabled={isSubmitting || isFull}
            className="mt-16 bg-(--panel-fg) text-(--panel-bg) text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-64 h-64 rounded-full text-center mx-auto block disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}
    </div>
  )
}
