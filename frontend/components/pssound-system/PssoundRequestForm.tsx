'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  pssoundRequestSchema,
  PssoundRequestFormData,
} from '@/lib/schemas/pssoundRequest'
import { useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FormField } from '@/components/form/FormField'
import { TextInput } from '@/components/form/TextInput'

interface PssoundRequestFormProps {
  bookedDates: string[]
  collectives: { _id: string; collectiveName: string }[]
}

function isDateBooked(dateStr: string, bookedDates: string[]) {
  return bookedDates.includes(dateStr)
}

export default function PssoundRequestForm({
  bookedDates,
  collectives,
}: PssoundRequestFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PssoundRequestFormData>({
    resolver: zodResolver(pssoundRequestSchema),
    defaultValues: {
      eventTitle: '',
      eventLink: '',
      eventLocation: '',
      eventDescription: '',
      isPolitical: {
        feminist: false,
        queer: false,
        racial: false,
        disability: false,
        fundraiser: '',
        other: '',
      },
      marginalizedArtists: [{ name: '', link: '' }],
      wagePolicy: '',
      eventDate: '',
      pickupDate: '',
      returnDate: '',
      vehicleCert: false,
      teamCert: false,
      charterCert: false,
      membershipCert: false,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'marginalizedArtists',
  })

  const bookedDateObjs = bookedDates.map((date) => new Date(date))
  const eventDate = watch('eventDate') ? new Date(watch('eventDate')) : null
  const pickupDate = watch('pickupDate') ? new Date(watch('pickupDate')) : null
  const returnDate = watch('returnDate') ? new Date(watch('returnDate')) : null

  const onSubmit = async (data: PssoundRequestFormData) => {
    console.log('Submitting data:', data)
    if (
      isDateBooked(data.eventDate, bookedDates) ||
      isDateBooked(data.pickupDate, bookedDates) ||
      isDateBooked(data.returnDate, bookedDates)
    ) {
      alert(
        'One or more selected dates are unavailable. Please choose different dates.'
      )
      return
    }

    const res = await fetch('/api/request-pssound', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      reset()
      alert('Request submitted!')
    } else {
      alert('Submission failed')
    }
  }

  return (
    <div className='p-4 h-full w-full md:max-w-[65vw] mx-auto'>
      <form
        onSubmit={handleSubmit(onSubmit, (formErrors) => {
          console.error('Validation errors:', formErrors)
        })}
        className='space-y-4'
      >
        <FormField
          bgClassName='bg-[#07f25b]'
          label='Choose your collective'
          error={errors.collective}
        >
          <select
            {...register('collective')}
            className='w-full bg-[#07f25b] text-[#81520A] border border-[#81520A] rounded px-2 py-1'
            defaultValue=''
          >
            <option value='' disabled>
              -- Select a collective --
            </option>
            {collectives.map((col) => (
              <option key={col._id} value={col.collectiveName}>
                {col.collectiveName}
              </option>
            ))}
          </select>
        </FormField>
        <FormField
          bgClassName='bg-[#07f25b]'
          label='Event Title'
          error={errors.eventTitle}
          required
        >
          <TextInput
            registration={register('eventTitle')}
            inputClassName='text-[#07f25b]'
            fieldClassName='bg-[#07f25b]'
          />
        </FormField>

        <FormField
          bgClassName='bg-[#07f25b]'
          label='Event Link'
          error={errors.eventLink}
        >
          <TextInput
            registration={register('eventLink')}
            inputClassName='text-[#07f25b]'
            fieldClassName='bg-[#07f25b]'
          />
        </FormField>

        <FormField
          bgClassName='bg-[#07f25b]'
          label='Event Location'
          error={errors.eventLocation}
          required
        >
          <TextInput
            registration={register('eventLocation')}
            inputClassName='text-[#07f25b]'
            fieldClassName='bg-[#07f25b]'
          />
        </FormField>

        <FormField
          bgClassName='bg-[#07f25b]'
          label='Event Description'
          error={errors.eventDescription}
          required
        >
          <TextInput
            registration={register('eventDescription')}
            isTextArea
            rows={3}
            inputClassName='text-[#07f25b]'
            fieldClassName='bg-[#07f25b]'
          />
        </FormField>

        <FormField
          bgClassName='bg-[#07f25b]'
          label='Is the event political? Specify'
          error={undefined}
        >
          <div className='flex gap-4 flex-wrap'>
            {['feminist', 'queer', 'racial', 'disability'].map((key) => (
              <label key={key} className='flex items-center gap-1'>
                <input
                  type='checkbox'
                  {...register(`isPolitical.${key}` as const)}
                  className='accent-[#81520A]'
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
          </div>
          <TextInput
            registration={register('isPolitical.fundraiser')}
            placeholder='Fundraiser (specify)'
            inputClassName='text-[#07f25b]'
            fieldClassName='bg-[#07f25b]'
          />
          <TextInput
            registration={register('isPolitical.other')}
            placeholder='Other (specify)'
            inputClassName='text-[#07f25b]'
            fieldClassName='bg-[#07f25b]'
          />
        </FormField>

        <FormField
          bgClassName='bg-[#07f25b]'
          label='Marginalized Artists'
          error={errors.marginalizedArtists}
        >
          {fields.map((field, idx) => (
            <div key={field.id} className='flex flex-col gap-1 mb-2'>
              <div className='flex gap-2'>
                <TextInput
                  registration={register(
                    `marginalizedArtists.${idx}.name` as const
                  )}
                  placeholder='Name'
                  inputClassName='text-[#07f25b]'
                  fieldClassName='bg-[#07f25b]'
                />
                <TextInput
                  registration={register(
                    `marginalizedArtists.${idx}.link` as const
                  )}
                  placeholder='Link (URL or leave blank)'
                  inputClassName='text-[#07f25b]'
                  fieldClassName='bg-[#07f25b]'
                />
                <button
                  type='button'
                  onClick={() => remove(idx)}
                  className='text-[#81520A] underline'
                >
                  Remove
                </button>
              </div>
              {/* Show name error */}
              {errors.marginalizedArtists?.[idx]?.name && (
                <span className='text-red-600 text-sm'>
                  {errors.marginalizedArtists[idx]?.name?.message}
                </span>
              )}
              {/* Show link error */}
              {errors.marginalizedArtists?.[idx]?.link && (
                <span className='text-red-600 text-sm'>
                  {errors.marginalizedArtists[idx]?.link?.message}
                </span>
              )}
            </div>
          ))}
          <button
            type='button'
            onClick={() => append({ name: '', link: '' })}
            className='text-[#81520A] underline'
          >
            + Add another artist
          </button>
        </FormField>

        <FormField
          bgClassName='bg-[#07f25b]'
          label='Wage Policy'
          error={errors.wagePolicy}
          required
        >
          <TextInput
            registration={register('wagePolicy')}
            isTextArea
            rows={2}
            inputClassName='text-[#07f25b]'
            fieldClassName='bg-[#07f25b]'
          />
        </FormField>

        <FormField
          bgClassName='bg-[#07f25b]'
          label='Event Date'
          error={errors.eventDate}
          required
        >
          <DatePicker
            selected={eventDate}
            onChange={(date) =>
              setValue('eventDate', date?.toISOString().slice(0, 10) || '')
            }
            excludeDates={bookedDateObjs}
            dateFormat='yyyy-MM-dd'
            minDate={new Date()}
            placeholderText='Select event date'
            className='border rounded px-2 py-1'
          />
        </FormField>

        <FormField
          bgClassName='bg-[#07f25b]'
          label='Pick-up Date'
          error={errors.pickupDate}
          required
        >
          <DatePicker
            selected={pickupDate}
            onChange={(date) =>
              setValue('pickupDate', date?.toISOString().slice(0, 10) || '')
            }
            excludeDates={bookedDateObjs}
            dateFormat='yyyy-MM-dd'
            minDate={new Date()}
            placeholderText='Select pick-up date'
            className='border rounded px-2 py-1'
          />
        </FormField>

        <FormField
          bgClassName='bg-[#07f25b]'
          label='Return Date'
          error={errors.returnDate}
          required
        >
          <DatePicker
            selected={returnDate}
            onChange={(date) =>
              setValue('returnDate', date?.toISOString().slice(0, 10) || '')
            }
            excludeDates={bookedDateObjs}
            dateFormat='yyyy-MM-dd'
            minDate={new Date()}
            placeholderText='Select return date'
            className='border rounded px-2 py-1'
          />
        </FormField>

        <FormField
          bgClassName='bg-[#07f25b]'
          label='Certifications'
          error={
            errors.vehicleCert ||
            errors.teamCert ||
            errors.charterCert ||
            errors.membershipCert
          }
        >
          <div className='flex flex-col gap-2'>
            <label>
              <input
                type='checkbox'
                {...register('vehicleCert')}
                className='accent-[#81520A]'
              />{' '}
              I certify that I have a vehicle to transport the sound safely
              (minimum 8 m³).
            </label>
            <label>
              <input
                type='checkbox'
                {...register('teamCert')}
                className='accent-[#81520A]'
              />{' '}
              I certify that at least 3 people will manage pick-up, build-up,
              build-down and return of the system.
            </label>
            <label>
              <input
                type='checkbox'
                {...register('charterCert')}
                className='accent-[#81520A]'
              />{' '}
              I certify that all persons involved have read and signed the
              charter of principles.
            </label>
            <label>
              <input
                type='checkbox'
                {...register('membershipCert')}
                className='accent-[#81520A]'
              />{' '}
              If you don’t have a membership yet: You understand the
              community-based financial aspect of the project and wish to make
              an annual contribution adapted to your means (between 75 and 150
              euros).
            </label>
          </div>
        </FormField>

        <button
          type='submit'
          disabled={isSubmitting}
          className='mt-16 bg-[#07f25b] text-[#81520A] text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-64 h-64 rounded-full text-center mx-auto block disabled:opacity-50'
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
