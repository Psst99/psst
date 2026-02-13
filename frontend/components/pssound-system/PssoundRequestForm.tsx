'use client'

import {useForm, useFieldArray} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {pssoundRequestSchema, PssoundRequestFormData} from '@/lib/schemas/pssoundRequest'
import {useEffect} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {FormField} from '@/components/form/FormField'
import {TextInput} from '@/components/form/TextInput'
import {StyledCheckbox} from '../StyledCheckbox'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../ui/select'

import {IoAddCircle} from 'react-icons/io5'
import {RiDeleteBack2Fill} from 'react-icons/ri'

interface PssoundRequestFormProps {
  bookedDates: string[]
  collectives: {_id: string; collectiveName: string}[]
}

function isDateBooked(dateStr: string, bookedDates: string[]) {
  return bookedDates.includes(dateStr)
}

export default function PssoundRequestForm({bookedDates, collectives}: PssoundRequestFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: {errors, isSubmitting},
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
      marginalizedArtists: [{name: '', link: ''}],
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

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'marginalizedArtists',
  })

  const bookedDateObjs = bookedDates.map((date) => new Date(date))
  const eventDate = watch('eventDate') ? new Date(watch('eventDate')) : null
  const pickupDate = watch('pickupDate') ? new Date(watch('pickupDate')) : null
  const returnDate = watch('returnDate') ? new Date(watch('returnDate')) : null

  const onSubmit = async (data: PssoundRequestFormData) => {
    if (
      isDateBooked(data.eventDate, bookedDates) ||
      isDateBooked(data.pickupDate, bookedDates) ||
      isDateBooked(data.returnDate, bookedDates)
    ) {
      alert('One or more selected dates are unavailable. Please choose different dates.')
      return
    }

    const res = await fetch('/api/request-pssound', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
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
    <div className="p-4 h-full w-full md:max-w-[65vw] mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit, (formErrors) => {
          console.error('Validation errors:', formErrors)
        })}
        className="space-y-4"
      >
        <FormField
          bgClassName="bg-[color:var(--section-accent)] flex flex-col xl:flex-row items-center"
          label="Choose your collective"
          error={errors.collective}
        >
          <div className="bg-white">
            <Select
              onValueChange={(value) => setValue('collective', value)}
              defaultValue={watch('collective')}
            >
              <SelectTrigger className="w-full bg-[#fff] text-[color:var(--section-bg)] border-0 border-[color:var(--section-bg)] rounded px-2 py-1 text-3xl">
                <SelectValue placeholder="Select your collective" />
              </SelectTrigger>
              <SelectContent className="bg-[color:var(--section-accent)] text-[color:var(--section-bg)] border border-[color:var(--section-bg)] rounded text-3xl">
                {collectives.map((col) => (
                  <SelectItem key={col._id} value={col.collectiveName} className="text-3xl">
                    {col.collectiveName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </FormField>

        <FormField
          bgClassName="bg-[color:var(--section-accent)]"
          label="Event Title"
          error={errors.eventTitle}
          required
        >
          <TextInput
            registration={register('eventTitle')}
            inputClassName="text-[color:var(--section-accent)]"
            fieldClassName="bg-[color:var(--section-accent)]"
          />
        </FormField>

        <FormField
          bgClassName="bg-[color:var(--section-accent)]"
          label="Event Link"
          error={errors.eventLink}
        >
          <TextInput
            registration={register('eventLink')}
            inputClassName="text-[color:var(--section-accent)]"
            fieldClassName="bg-[color:var(--section-accent)]"
          />
        </FormField>

        <FormField
          bgClassName="bg-[color:var(--section-accent)]"
          label="Event Location"
          error={errors.eventLocation}
          required
        >
          <TextInput
            registration={register('eventLocation')}
            inputClassName="text-[color:var(--section-accent)]"
            fieldClassName="bg-[color:var(--section-accent)]"
          />
        </FormField>

        <FormField
          bgClassName="bg-[color:var(--section-accent)]"
          label="Event Description"
          error={errors.eventDescription}
          required
        >
          <TextInput
            registration={register('eventDescription')}
            isTextArea
            rows={3}
            inputClassName="text-[color:var(--section-accent)]"
            fieldClassName="bg-[color:var(--section-accent)]"
          />
        </FormField>

        <FormField
          bgClassName="bg-[color:var(--section-accent)] items-center"
          label="Is the event political?"
          error={undefined}
        >
          <div className="flex flex-col gap-4">
            {/* All checkboxes in same row */}
            <div className="flex gap-x-4 flex-wrap px-4 py-2">
              {['feminist', 'queer', 'racial', 'disability'].map((key) => (
                <StyledCheckbox
                  key={key}
                  label={key}
                  {...register(`isPolitical.${key}` as const)}
                />
              ))}

              {/* Fundraiser checkbox */}
              <StyledCheckbox
                label="fundraiser"
                checked={!!watch('isPolitical.fundraiser')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setValue('isPolitical.fundraiser', ' ')
                  } else {
                    setValue('isPolitical.fundraiser', '')
                  }
                }}
              />

              {/* Other checkbox */}
              <StyledCheckbox
                label="other"
                checked={!!watch('isPolitical.other')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setValue('isPolitical.other', ' ')
                  } else {
                    setValue('isPolitical.other', '')
                  }
                }}
              />
            </div>

            {/* Text inputs appear below when checked */}
            {watch('isPolitical.fundraiser') && (
              <TextInput
                registration={register('isPolitical.fundraiser')}
                placeholder="Fundraiser (specify)"
                inputClassName="text-[color:var(--section-accent)]"
                fieldClassName="bg-[color:var(--section-accent)]"
              />
            )}

            {watch('isPolitical.other') && (
              <TextInput
                registration={register('isPolitical.other')}
                placeholder="Other (specify)"
                inputClassName="text-[color:var(--section-accent)]"
                fieldClassName="bg-[color:var(--section-accent)]"
              />
            )}
          </div>
        </FormField>

        <FormField
          bgClassName="bg-[color:var(--section-accent)]"
          label="Marginalized Artists"
          error={errors.marginalizedArtists}
        >
          {fields.map((field, idx) => (
            <div key={field.id} className="flex flex-col gap-1 mb-2">
              <div className="flex w-full relative">
                {/* Name field - no right rounded corners */}
                <TextInput
                  registration={register(`marginalizedArtists.${idx}.name` as const)}
                  placeholder="Name"
                  inputClassName="text-[color:var(--section-accent)]"
                  fieldClassName="bg-[color:var(--section-accent)]"
                  className="!rounded-none border-r-0 flex-1"
                />

                {/* Link field - no left rounded corners */}
                <div className="flex-[2] relative">
                  <TextInput
                    registration={register(`marginalizedArtists.${idx}.link` as const)}
                    placeholder="Link (URL or leave blank)"
                    inputClassName="text-[color:var(--section-accent)]"
                    fieldClassName="bg-[color:var(--section-accent)]"
                    className="!rounded-none !rounded-tr-xl pr-10 flex-1"
                  />

                  {/* Trash icon inside the input */}
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--section-bg)] hover:text-[#A20018] transition-colors"
                    aria-label="Remove artist"
                  >
                    <RiDeleteBack2Fill />
                  </button>
                </div>
              </div>

              {/* Error messages */}
              <div className="flex gap-2">
                <div className="flex-1">
                  {errors.marginalizedArtists?.[idx]?.name && (
                    <span className="text-[color:var(--section-bg)] text-xs italic">
                      {errors.marginalizedArtists[idx]?.name?.message}
                    </span>
                  )}
                </div>
                <div className="flex-[2]">
                  {errors.marginalizedArtists?.[idx]?.link && (
                    <span className="text-[color:var(--section-bg)] text-xs italic">
                      {errors.marginalizedArtists[idx]?.link?.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({name: '', link: ''})}
            className="text-[color:var(--section-bg)] flex items-center gap-1 hover:underline -mt-3 py-1 text-sm xl:text-base px-2"
          >
            <IoAddCircle />
            Add another artist
          </button>
        </FormField>

        <FormField
          bgClassName="bg-[color:var(--section-accent)]"
          label="Wage Policy"
          error={errors.wagePolicy}
          required
        >
          <TextInput
            registration={register('wagePolicy')}
            isTextArea
            rows={2}
            inputClassName="text-[color:var(--section-accent)]"
            fieldClassName="bg-[color:var(--section-accent)]"
          />
        </FormField>

        <FormField
          bgClassName="bg-[color:var(--section-accent)]"
          label="Event Date"
          error={errors.eventDate}
          required
        >
          <DatePicker
            selected={eventDate}
            onChange={(date) => setValue('eventDate', date?.toISOString().slice(0, 10) || '')}
            excludeDates={bookedDateObjs}
            dateFormat="yyyy-MM-dd"
            minDate={new Date()}
            placeholderText="Select event date"
            className="px-4 py-2 text-[color:var(--section-bg)] text-sm xl:text-base"
          />
        </FormField>

        <FormField
          bgClassName="bg-[color:var(--section-accent)]"
          label="Pick-up Date"
          error={errors.pickupDate}
          required
        >
          <DatePicker
            selected={pickupDate}
            onChange={(date) => setValue('pickupDate', date?.toISOString().slice(0, 10) || '')}
            excludeDates={bookedDateObjs}
            dateFormat="yyyy-MM-dd"
            minDate={new Date()}
            placeholderText="Select pick-up date"
            className="px-4 py-2 text-[color:var(--section-bg)] text-sm xl:text-base"
          />
        </FormField>

        <FormField
          bgClassName="bg-[color:var(--section-accent)]"
          label="Return Date"
          error={errors.returnDate}
          required
        >
          <DatePicker
            selected={returnDate}
            onChange={(date) => setValue('returnDate', date?.toISOString().slice(0, 10) || '')}
            excludeDates={bookedDateObjs}
            dateFormat="yyyy-MM-dd"
            minDate={new Date()}
            placeholderText="Select return date"
            className="px-4 py-2 text-[color:var(--section-bg)] text-sm xl:text-base"
          />
        </FormField>

        <FormField
          bgClassName="bg-[color:var(--section-accent)]"
          label="Certifications"
          error={
            errors.vehicleCert || errors.teamCert || errors.charterCert || errors.membershipCert
          }
        >
          <div className="flex justify-center items-center h-full w-full p-4 text-sm xl:text-base">
            <div className="flex flex-col gap-2 w-full">
              <StyledCheckbox
                label="I certify that I have a vehicle to transport the sound safely (minimum 8 m³)."
                {...register('vehicleCert')}
              />
              <StyledCheckbox
                label="I certify that at least 3 people will manage pick-up, build-up, build-down and return of the system."
                {...register('teamCert')}
              />
              <StyledCheckbox
                label="I certify that all persons involved have read and signed the charter of principles."
                {...register('charterCert')}
              />
              {/* <StyledCheckbox
                label={`If you don't have a membership yet: You understand the community-based financial aspect of the project and wish to make an annual contribution adapted to your means (between 75 and 150 euros).`}
                {...register('membershipCert')}
              /> */}
            </div>
          </div>
        </FormField>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-16 bg-[color:var(--section-accent)] text-[color:var(--section-bg)] text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-64 h-64 rounded-full text-center mx-auto block disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
