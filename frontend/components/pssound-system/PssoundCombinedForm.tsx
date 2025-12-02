'use client'

import {useState} from 'react'
import {useForm, useFieldArray} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {FormField} from '@/components/form/FormField'
import {TextInput} from '@/components/form/TextInput'
import {StyledCheckbox} from '../StyledCheckbox'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../ui/select'
import {IoAddCircle} from 'react-icons/io5'
import {RiDeleteBack2Fill} from 'react-icons/ri'

// Import combined schema
import {z} from 'zod'
import {pssoundRequestSchema, PssoundRequestFormData} from '@/lib/schemas/pssoundRequest'
import {pssoundMembershipSchema, PssoundMembershipFormData} from '@/lib/schemas/pssoundMembership'

// Create combined schema
const combinedFormSchema = z.object({
  // Is member field
  isMember: z.boolean(),
  selectedCollective: z.string().optional(),

  // Membership fields (conditional)
  membership: pssoundMembershipSchema.optional(),

  // Request fields (always required)
  request: pssoundRequestSchema,
})

type CombinedFormData = z.infer<typeof combinedFormSchema>

interface PssoundCombinedFormProps {
  bookedDates: string[]
  collectives: {_id: string; collectiveName: string}[]
}

function isDateBooked(dateStr: string, bookedDates: string[]) {
  return bookedDates.includes(dateStr)
}

export default function PssoundCombinedForm({bookedDates, collectives}: PssoundCombinedFormProps) {
  const [isMember, setIsMember] = useState<boolean | null>(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: {errors, isSubmitting},
    reset,
  } = useForm<CombinedFormData>({
    resolver: zodResolver(combinedFormSchema),
    defaultValues: {
      isMember: false,
      selectedCollective: '',
      membership: {
        collectiveName: '',
        isPolitical: [], // Initialize as empty array
        otherPolitical: '',
        caribbeanOrAfro: undefined,
        qualifiedSoundEngineer: undefined,
        annualContribution: '',
        charterSigned: false,
      },
      request: {
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
      },
    },
  })

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'request.marginalizedArtists',
  })

  const bookedDateObjs = bookedDates.map((date) => new Date(date))
  const eventDate = watch('request.eventDate') ? new Date(watch('request.eventDate')) : null
  const pickupDate = watch('request.pickupDate') ? new Date(watch('request.pickupDate')) : null
  const returnDate = watch('request.returnDate') ? new Date(watch('request.returnDate')) : null

  const onSubmit = async (data: CombinedFormData) => {
    // Check if any dates are booked
    if (
      isDateBooked(data.request.eventDate, bookedDates) ||
      isDateBooked(data.request.pickupDate, bookedDates) ||
      isDateBooked(data.request.returnDate, bookedDates)
    ) {
      alert('One or more selected dates are unavailable. Please choose different dates.')
      return
    }

    try {
      const res = await fetch('/api/pssound-combined', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        throw new Error('Submission failed')
      }

      reset()
      alert('Your request has been submitted!')
    } catch (error) {
      alert('Submission failed. Please try again.')
      console.error('Error submitting form:', error)
    }
  }

  return (
    <div className="p-4 h-full w-full md:max-w-[65vw] mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Membership selection */}
        <div className="p-6 bg-[#07f25b] rounded-xl">
          <h2 className="text-2xl mb-4 text-[#81520A]">PSSOUND REQUEST FORM</h2>

          <div className="mb-4">
            <p className="tracking-tight text-lg mb-2 text-[#81520A]">
              Are you already a Pssound Community member?
            </p>

            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={isMember === true}
                  onChange={() => {
                    setIsMember(true)
                    setValue('isMember', true)
                  }}
                  className="form-radio"
                />
                <span>Yes</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={isMember === false}
                  onChange={() => {
                    setIsMember(false)
                    setValue('isMember', false)
                  }}
                  className="form-radio"
                />
                <span>No</span>
              </label>
            </div>

            {isMember === true && (
              <div className="mt-4 bg-white p-2 rounded-xl">
                <Select onValueChange={(value) => setValue('selectedCollective', value)}>
                  <SelectTrigger className="w-full bg-white text-[#81520A] border-0 rounded px-2 py-1 text-xl">
                    <SelectValue placeholder="Select your collective" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#07f25b] text-[#81520A] border rounded">
                    {collectives.map((col) => (
                      <SelectItem key={col._id} value={col.collectiveName}>
                        {col.collectiveName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.selectedCollective && (
                  <p className="text-[#81520A] text-sm mt-1">Please select your collective</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Section A: Membership Form (conditional) */}
        {isMember === false && (
          <div className="border-2 border-[#07f25b] p-6 rounded-xl">
            <h2 className="text-2xl mb-4 text-[#07f25b] uppercase">Membership application</h2>

            <div className="space-y-4">
              <FormField
                label="Name of your collective / association"
                error={errors.membership?.collectiveName}
                required
                bgClassName="bg-[#07f25b]"
              >
                <TextInput
                  registration={register('membership.collectiveName')}
                  inputClassName="text-[#07f25b]"
                  fieldClassName="bg-[#07f25b]"
                />
              </FormField>

              <FormField
                label="Is your project political?"
                error={errors.membership?.isPolitical}
                bgClassName="bg-[#07f25b] items-center"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex gap-x-4 flex-wrap px-4 py-2">
                    {['feminist', 'queer', 'racial', 'disability', 'other'].map((opt) => (
                      <StyledCheckbox
                        key={opt}
                        label={opt}
                        value={opt}
                        {...register('membership.isPolitical')}
                      />
                    ))}
                  </div>
                  {Array.isArray(watch('membership.isPolitical')) &&
                    (watch('membership.isPolitical') as string[]).includes('other') && (
                      <TextInput
                        registration={register('membership.otherPolitical')}
                        placeholder="Other (specify)"
                        inputClassName="text-[#07f25b]"
                        fieldClassName="bg-[#07f25b]"
                      />
                    )}
                </div>
              </FormField>

              <FormField
                label="Does your project include/feature people of Caribbean or Afro descent?"
                error={errors.membership?.caribbeanOrAfro}
                required
                bgClassName="bg-[#07f25b]"
              >
                <select
                  {...register('membership.caribbeanOrAfro')}
                  className="w-full rounded-t-none rounded-b-lg text-[#07f25b] px-4 py-2 text-xl border-0 outline-0 md:rounded-l-none md:rounded-tr-lg bg-white h-full"
                >
                  <option value="">Select…</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </FormField>

              <FormField
                label="Qualified sound engineer in your team?"
                error={errors.membership?.qualifiedSoundEngineer}
                required
                bgClassName="bg-[#07f25b]"
              >
                <select
                  {...register('membership.qualifiedSoundEngineer')}
                  className="w-full rounded-t-none rounded-b-lg text-[#07f25b] px-4 py-2 text-xl border-0 outline-0 md:rounded-l-none md:rounded-tr-lg bg-white h-full"
                >
                  <option value="">Select…</option>
                  <option value="yes">Yes</option>
                  <option value="no_commit">
                    No, but we commit to work with a qualified person at our events.
                  </option>
                </select>
              </FormField>

              <FormField
                label="Annual contribution (between 75 and 150 euros to BE78735060790086)"
                error={errors.membership?.annualContribution}
                required
                bgClassName="bg-[#07f25b]"
              >
                <TextInput
                  registration={register('membership.annualContribution')}
                  inputClassName="text-[#07f25b]"
                  fieldClassName="bg-[#07f25b]"
                />
              </FormField>

              <FormField
                label="Charter of principles"
                error={errors.membership?.charterSigned}
                required
                bgClassName="bg-[#07f25b]"
              >
                <div className="flex justify-start items-center h-full w-full p-4">
                  <StyledCheckbox
                    label="I certify that all persons involved in the sound project have read and signed the charter of principles and are aware of the moral, technical and financial requirements of the loan."
                    {...register('membership.charterSigned')}
                  />
                </div>
              </FormField>
            </div>
          </div>
        )}

        {/* Section B: Request Form */}
        {(isMember === true || isMember === false) && (
          <div className="border-2 border-[#07f25b] p-6 rounded-xl mt-8">
            <h2 className="text-2xl uppercase mb-4 text-[#07f25b]">Loan request</h2>

            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Event Date"
                  error={errors.request?.eventDate}
                  required
                  bgClassName="bg-[#07f25b]"
                >
                  <DatePicker
                    selected={eventDate}
                    onChange={(date) =>
                      setValue('request.eventDate', date?.toISOString().slice(0, 10) || '')
                    }
                    excludeDates={bookedDateObjs}
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()}
                    placeholderText="Select event date"
                    className="px-4 py-2 text-[#81520A] w-full"
                  />
                </FormField>

                <FormField
                  label="Pick-up Date (weekdays only)"
                  error={errors.request?.pickupDate}
                  required
                  bgClassName="bg-[#07f25b]"
                >
                  <DatePicker
                    selected={pickupDate}
                    onChange={(date) =>
                      setValue('request.pickupDate', date?.toISOString().slice(0, 10) || '')
                    }
                    excludeDates={bookedDateObjs}
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()}
                    placeholderText="Select pick-up date"
                    className="px-4 py-2 text-[#81520A] w-full"
                  />
                </FormField>

                <FormField
                  label="Return Date (weekdays only)"
                  error={errors.request?.returnDate}
                  required
                  bgClassName="bg-[#07f25b]"
                >
                  <DatePicker
                    selected={returnDate}
                    onChange={(date) =>
                      setValue('request.returnDate', date?.toISOString().slice(0, 10) || '')
                    }
                    excludeDates={bookedDateObjs}
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()}
                    placeholderText="Select return date"
                    className="px-4 py-2 text-[#81520A] w-full"
                  />
                </FormField>
              </div>
            </div>

            <FormField
              label="Event Title"
              error={errors.request?.eventTitle}
              required
              bgClassName="bg-[#07f25b]"
            >
              <TextInput
                registration={register('request.eventTitle')}
                inputClassName="text-[#07f25b]"
                fieldClassName="bg-[#07f25b]"
              />
            </FormField>

            <FormField
              label="Event Link"
              error={errors.request?.eventLink}
              bgClassName="bg-[#07f25b]"
            >
              <TextInput
                registration={register('request.eventLink')}
                inputClassName="text-[#07f25b]"
                fieldClassName="bg-[#07f25b]"
              />
            </FormField>

            <FormField
              label="Event Location"
              error={errors.request?.eventLocation}
              required
              bgClassName="bg-[#07f25b]"
            >
              <TextInput
                registration={register('request.eventLocation')}
                inputClassName="text-[#07f25b]"
                fieldClassName="bg-[#07f25b]"
              />
            </FormField>

            <FormField
              label="Event Description"
              error={errors.request?.eventDescription}
              required
              bgClassName="bg-[#07f25b]"
            >
              <TextInput
                registration={register('request.eventDescription')}
                isTextArea
                rows={3}
                inputClassName="text-[#07f25b]"
                fieldClassName="bg-[#07f25b]"
              />
            </FormField>

            <FormField
              label="Is the event political?"
              error={undefined}
              bgClassName="bg-[#07f25b] items-center"
            >
              <div className="flex flex-col gap-4">
                <div className="flex gap-x-4 flex-wrap px-4 py-2">
                  {['feminist', 'queer', 'racial', 'disability'].map((key) => (
                    <StyledCheckbox
                      key={key}
                      label={key}
                      {...register(`request.isPolitical.${key}` as const)}
                    />
                  ))}

                  <StyledCheckbox
                    label="fundraiser"
                    checked={!!watch('request.isPolitical.fundraiser')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setValue('request.isPolitical.fundraiser', ' ')
                      } else {
                        setValue('request.isPolitical.fundraiser', '')
                      }
                    }}
                  />

                  <StyledCheckbox
                    label="other"
                    checked={!!watch('request.isPolitical.other')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setValue('request.isPolitical.other', ' ')
                      } else {
                        setValue('request.isPolitical.other', '')
                      }
                    }}
                  />
                </div>

                {/* Text inputs appear below when checked */}
                {watch('request.isPolitical.fundraiser') && (
                  <TextInput
                    registration={register('request.isPolitical.fundraiser')}
                    placeholder="Fundraiser (specify)"
                    inputClassName="text-[#07f25b]"
                    fieldClassName="bg-[#07f25b]"
                  />
                )}

                {watch('request.isPolitical.other') && (
                  <TextInput
                    registration={register('request.isPolitical.other')}
                    placeholder="Other (specify)"
                    inputClassName="text-[#07f25b]"
                    fieldClassName="bg-[#07f25b]"
                  />
                )}
              </div>
            </FormField>

            <FormField
              label="Marginalized Artists"
              error={errors.request?.marginalizedArtists}
              bgClassName="bg-[#07f25b]"
            >
              {fields.map((field, idx) => (
                <div key={field.id} className="flex flex-col gap-1 mb-2">
                  <div className="flex w-full relative">
                    {/* Name field */}
                    <TextInput
                      registration={register(`request.marginalizedArtists.${idx}.name` as const)}
                      placeholder="Name"
                      inputClassName="text-[#07f25b]"
                      fieldClassName="bg-[#07f25b]"
                      className="!rounded-none border-r-0 flex-1"
                    />

                    {/* Link field */}
                    <div className="flex-[2] relative">
                      <TextInput
                        registration={register(`request.marginalizedArtists.${idx}.link` as const)}
                        placeholder="Link (URL or leave blank)"
                        inputClassName="text-[#07f25b]"
                        fieldClassName="bg-[#07f25b]"
                        className="!rounded-none !rounded-tr-xl pr-10 flex-1"
                      />

                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#81520A] hover:text-[#A20018] transition-colors"
                        aria-label="Remove artist"
                      >
                        <RiDeleteBack2Fill />
                      </button>
                    </div>
                  </div>

                  {/* Error messages */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      {errors.request?.marginalizedArtists?.[idx]?.name && (
                        <span className="text-[#81520A] text-xs italic">
                          {errors.request?.marginalizedArtists[idx]?.name?.message}
                        </span>
                      )}
                    </div>
                    <div className="flex-[2]">
                      {errors.request?.marginalizedArtists?.[idx]?.link && (
                        <span className="text-[#81520A] text-xs italic">
                          {errors.request?.marginalizedArtists[idx]?.link?.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => append({name: '', link: ''})}
                className="text-[#81520A] flex items-center gap-1 hover:underline -mt-3 py-1 text-sm px-2"
              >
                <IoAddCircle />
                Add another artist
              </button>
            </FormField>

            <FormField
              label="Wage Policy"
              error={errors.request?.wagePolicy}
              required
              bgClassName="bg-[#07f25b]"
            >
              <TextInput
                registration={register('request.wagePolicy')}
                isTextArea
                rows={2}
                inputClassName="text-[#07f25b]"
                fieldClassName="bg-[#07f25b]"
                placeholder="Please detail with transparency"
              />
            </FormField>

            <FormField
              label="Certifications"
              error={
                errors.request?.vehicleCert ||
                errors.request?.teamCert ||
                errors.request?.charterCert
              }
              bgClassName="bg-[#07f25b]"
            >
              <div className="flex justify-center items-center h-full w-full p-4 text-sm">
                <div className="flex flex-col gap-2 w-full">
                  <StyledCheckbox
                    label="I certify that I have a vehicle to transport the sound safely (minimum 8 m³)."
                    {...register('request.vehicleCert')}
                  />
                  <StyledCheckbox
                    label="I certify that at least 3 people will manage pick-up, build-up, build-down and return of the system."
                    {...register('request.teamCert')}
                  />
                  <StyledCheckbox
                    label="I certify that all persons involved have read and signed the charter of principles."
                    {...register('request.charterCert')}
                  />
                </div>
              </div>
            </FormField>
          </div>
        )}

        {/* Installation Manual Link */}
        <div className="border-2 border-[#07f25b] p-6 rounded-xl mt-4">
          <h2 className="text-xl mb-4 text-[#07f25b]">Installation Manual</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/docs/pssound-manual-en.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#07f25b] text-[#81520a] hover:bg-opacity-80 rounded-md text-center"
            >
              English Manual (PDF)
            </a>
            <a
              href="/docs/pssound-manual-fr.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#07f25b] text-[#81520a] hover:bg-opacity-80 rounded-md text-center"
            >
              Manuel Français (PDF)
            </a>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting || isMember === null}
          className="mt-16 bg-[#07f25b] text-[#81520A] text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-64 h-64 rounded-full text-center mx-auto block disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
