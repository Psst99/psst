'use client'

import {useState, useEffect} from 'react'
import {useForm, useFieldArray} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {FormField} from '@/components/form/FormField'
import {TextInput} from '@/components/form/TextInput'
import {DateInput} from '@/components/form/DateInput'
import {StyledCheckbox} from '../StyledCheckbox'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../ui/select'
import {IoAddCircle} from 'react-icons/io5'
import {RiDeleteBack2Fill} from 'react-icons/ri'

// Import combined schema
import {z} from 'zod'
import {pssoundRequestSchema, PssoundRequestFormData} from '@/lib/schemas/pssoundRequest'
import {pssoundMembershipSchema, PssoundMembershipFormData} from '@/lib/schemas/pssoundMembership'

// Create combined schema
const combinedFormSchema = z.discriminatedUnion('isMember', [
  z.object({
    isMember: z.literal(true),
    selectedCollective: z.string().min(1, 'Please select your collective'),
    membership: z.any().optional(),
    request: pssoundRequestSchema,
  }),
  z.object({
    isMember: z.literal(false),
    selectedCollective: z.string().optional(),
    membership: pssoundMembershipSchema,
    request: pssoundRequestSchema,
  }),
])

type CombinedFormData = z.infer<typeof combinedFormSchema>

interface PssoundCombinedFormProps {
  bookedDates: string[]
  collectives: {_id: string; collectiveName: string}[]
  selectedStartDate?: string | null
  selectedEndDate?: string | null
}

function isDateBooked(dateStr: string, bookedDates: string[]) {
  return bookedDates.includes(dateStr)
}

export default function PssoundCombinedForm({
  bookedDates,
  collectives,
  selectedStartDate,
  selectedEndDate,
}: PssoundCombinedFormProps) {
  const [isMember, setIsMember] = useState<boolean | null>(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: {errors, touchedFields, isSubmitted, isSubmitting},
    reset,
  } = useForm<CombinedFormData>({
    resolver: zodResolver(combinedFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
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
  const dateTabLabel = selectedStartDate
    ? selectedEndDate
      ? `${selectedStartDate} → ${selectedEndDate}`
      : selectedStartDate
    : 'Dates'

  // Auto-populate dates from calendar selection
  useEffect(() => {
    if (selectedStartDate && selectedStartDate !== watch('request.pickupDate')) {
      setValue('request.pickupDate', selectedStartDate, {
        shouldTouch: true,
        shouldValidate: true,
      })
    }
  }, [selectedStartDate, setValue, watch])

  useEffect(() => {
    if (selectedEndDate && selectedEndDate !== watch('request.returnDate')) {
      setValue('request.returnDate', selectedEndDate, {
        shouldTouch: true,
        shouldValidate: true,
      })
    }
  }, [selectedEndDate, setValue, watch])

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
        <div className="p-6 section-bg rounded-xl">
          <div className="mb-4 flex items-baseline justify-between">
            <p className="tracking-tight text-2xl mb-4 section-fg">
              Are you already a Pssound Community member?
            </p>

            <div className="flex gap-4 justify-center">
              <button
                type="button"
                onClick={() => {
                  if (isMember === true) {
                    setIsMember(null)
                    return
                  }
                  setIsMember(true)
                  setValue('isMember', true, {
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }}
                className={`w-32 h-32 rounded-full text-2xl font-medium cursor-pointer ${
                  isMember === true
                    ? 'panel-bg ring-4 ring-[var(--panel-fg)]/30'
                    : 'bg-white section-fg hover:opacity-80'
                }`}
              >
                Yes
              </button>

              <button
                type="button"
                onClick={() => {
                  if (isMember === false) {
                    setIsMember(null)
                    return
                  }
                  setIsMember(false)
                  setValue('isMember', false, {
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }}
                className={`w-32 h-32 rounded-full text-2xl font-medium cursor-pointer ${
                  isMember === false
                    ? 'panel-bg ring-4 ring-[var(--panel-fg)]/30'
                    : 'bg-white section-fg hover:opacity-80'
                }`}
              >
                No
              </button>
            </div>
          </div>
        </div>

        {isMember === true && (
          <div className="p-6 section-bg rounded-xl">
            <p className="tracking-tight text-2xl mb-4 section-fg">Select your collective</p>
            <div className="bg-white p-2 rounded-xl">
              <Select
                onValueChange={(value) =>
                  setValue('selectedCollective', value, {
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full bg-white section-fg border-0 rounded px-2 py-1 text-xl">
                  <SelectValue placeholder="Select your collective" />
                </SelectTrigger>
                <SelectContent className="section-bg section-fg border rounded">
                  {collectives.map((col) => (
                    <SelectItem key={col._id} value={col.collectiveName}>
                      {col.collectiveName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(touchedFields.selectedCollective || isSubmitted) && errors.selectedCollective && (
                <p className="section-fg text-sm mt-1">Please select your collective</p>
              )}
            </div>
          </div>
        )}

        {/* Section A: Membership Form (conditional) */}
        {isMember === false && (
          <div className="relative border panel-border rounded-3xl panel-bg p-6 pt-10 mt-16">
            <div className="absolute left-6 -top-[31px]">
              <div className="relative inline-flex items-center justify-center px-8 py-1 border border-b-0 rounded-t-xl uppercase tracking-tight panel-bg panel-fg panel-border">
                <span className="font-normal text-[24px] leading-[22px]">
                  Membership application
                </span>
                <span className="pointer-events-none absolute left-0 right-0 bottom-[-1px] h-[1px] panel-bg" />
              </div>
            </div>

            <div className="space-y-4">
              <FormField
                label="Name of your collective / association"
                error={errors.membership?.collectiveName}
                required
                showError={!!touchedFields.membership?.collectiveName || isSubmitted}
              >
                <TextInput registration={register('membership.collectiveName')} />
              </FormField>

              <FormField
                label="Is your project political?"
                error={errors.membership?.isPolitical}
                showError={!!touchedFields.membership?.isPolitical || isSubmitted}
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
                      />
                    )}
                </div>
              </FormField>

              <FormField
                label="Does your project include/feature people of Caribbean or Afro descent?"
                error={errors.membership?.caribbeanOrAfro}
                required
                showError={!!touchedFields.membership?.caribbeanOrAfro || isSubmitted}
              >
                <select
                  {...register('membership.caribbeanOrAfro')}
                  className="w-full rounded-t-none rounded-b-lg section-fg px-4 py-2 text-xl border-0 outline-0 md:rounded-l-none md:rounded-tr-lg bg-white h-full"
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
                showError={!!touchedFields.membership?.qualifiedSoundEngineer || isSubmitted}
              >
                <select
                  {...register('membership.qualifiedSoundEngineer')}
                  className="w-full rounded-t-none rounded-b-lg section-fg px-4 py-2 text-xl border-0 outline-0 md:rounded-l-none md:rounded-tr-lg bg-white h-full"
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
                showError={!!touchedFields.membership?.annualContribution || isSubmitted}
              >
                <TextInput registration={register('membership.annualContribution')} />
              </FormField>

              <FormField
                label="Manifesto"
                error={errors.membership?.charterSigned}
                required
                showError={!!touchedFields.membership?.charterSigned || isSubmitted}
              >
                <div className="flex justify-start items-center h-full w-full p-4">
                  <StyledCheckbox
                    label="I certify that all persons involved in the sound project have read and signed the manifesto and are aware of the moral, technical and financial requirements of the loan."
                    {...register('membership.charterSigned')}
                  />
                </div>
              </FormField>
            </div>
          </div>
        )}

        {/* Section B: Request Form */}
        {(isMember === true || isMember === false) && (
          <div className="relative border panel-border rounded-3xl panel-bg p-6 pt-10 mt-16">
            <div className="absolute left-6 -top-[31px]">
              <div className="relative inline-flex items-center justify-center px-8 py-1 border border-b-0 rounded-t-xl uppercase tracking-tight panel-bg panel-fg panel-border">
                <span className="font-normal text-[24px] leading-[22px]">Loan request</span>
                <span className="pointer-events-none absolute left-0 right-0 bottom-[-1px] h-[1px] panel-bg" />
              </div>
            </div>
            <div className="absolute right-6 -top-[31px]">
              <div className="relative inline-flex items-center justify-center px-8 py-1 border border-b-0 rounded-t-xl uppercase tracking-tight panel-bg panel-fg panel-border">
                <span className="font-normal text-[24px] leading-[22px]">{dateTabLabel}</span>
                <span className="pointer-events-none absolute left-0 right-0 bottom-[-1px] h-[1px] panel-bg" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <FormField
                  label="Event Date"
                  error={errors.request?.eventDate}
                  required
                  showError={!!touchedFields.request?.eventDate || isSubmitted}
                >
                  <DatePicker
                    selected={eventDate}
                    onChange={(date) =>
                      setValue('request.eventDate', date?.toISOString().slice(0, 10) || '', {
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                    excludeDates={bookedDateObjs}
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()}
                    customInput={<DateInput placeholder="Select event date" />}
                  />
                </FormField>

                {selectedStartDate && (
                  <div className="p-4 panel-bg/20 rounded-lg border panel-border">
                    <p className="text-sm panel-fg mb-1 font-medium">Selected from calendar:</p>
                    <p className="text-lg panel-fg">
                      {selectedEndDate ? (
                        <>
                          <span className="font-bold">{selectedStartDate}</span>
                          {' → '}
                          <span className="font-bold">{selectedEndDate}</span>
                          <span className="text-sm ml-2 opacity-70">(multi-day event)</span>
                        </>
                      ) : (
                        <>
                          <span className="font-bold">{selectedStartDate}</span>
                          <span className="text-sm ml-2 opacity-70">
                            (click another date to select range)
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Pick-up Date (weekdays only)"
                  error={errors.request?.pickupDate}
                  required
                  showError={!!touchedFields.request?.pickupDate || isSubmitted}
                >
                  <DatePicker
                    selected={pickupDate}
                    onChange={(date) =>
                      setValue('request.pickupDate', date?.toISOString().slice(0, 10) || '', {
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                    excludeDates={bookedDateObjs}
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()}
                    customInput={<DateInput placeholder="Select pick-up date" />}
                  />
                </FormField>

                <FormField
                  label="Return Date (weekdays only)"
                  error={errors.request?.returnDate}
                  required
                  showError={!!touchedFields.request?.returnDate || isSubmitted}
                >
                  <DatePicker
                    selected={returnDate}
                    onChange={(date) =>
                      setValue('request.returnDate', date?.toISOString().slice(0, 10) || '', {
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                    excludeDates={bookedDateObjs}
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()}
                    customInput={<DateInput placeholder="Select return date" />}
                  />
                </FormField>
              </div>

              <div className="space-y-4">
                <FormField
                  label="Event Title"
                  error={errors.request?.eventTitle}
                  required
                  showError={!!touchedFields.request?.eventTitle || isSubmitted}
                >
                  <TextInput registration={register('request.eventTitle')} />
                </FormField>

                <FormField
                  label="Event Link"
                  error={errors.request?.eventLink}
                  showError={!!touchedFields.request?.eventLink || isSubmitted}
                >
                  <TextInput registration={register('request.eventLink')} />
                </FormField>

                <FormField
                  label="Event Location"
                  error={errors.request?.eventLocation}
                  required
                  showError={!!touchedFields.request?.eventLocation || isSubmitted}
                >
                  <TextInput registration={register('request.eventLocation')} />
                </FormField>

                <FormField
                  label="Event Description"
                  error={errors.request?.eventDescription}
                  required
                  showError={!!touchedFields.request?.eventDescription || isSubmitted}
                >
                  <TextInput
                    registration={register('request.eventDescription')}
                    isTextArea
                    rows={3}
                  />
                </FormField>

                <FormField label="Is the event political?" error={undefined}>
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
                            setValue('request.isPolitical.fundraiser', ' ', {
                              shouldTouch: true,
                              shouldValidate: true,
                            })
                          } else {
                            setValue('request.isPolitical.fundraiser', '', {
                              shouldTouch: true,
                              shouldValidate: true,
                            })
                          }
                        }}
                      />

                      <StyledCheckbox
                        label="other"
                        checked={!!watch('request.isPolitical.other')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setValue('request.isPolitical.other', ' ', {
                              shouldTouch: true,
                              shouldValidate: true,
                            })
                          } else {
                            setValue('request.isPolitical.other', '', {
                              shouldTouch: true,
                              shouldValidate: true,
                            })
                          }
                        }}
                      />
                    </div>

                    {watch('request.isPolitical.fundraiser') && (
                      <TextInput
                        registration={register('request.isPolitical.fundraiser')}
                        placeholder="Fundraiser (specify)"
                      />
                    )}

                    {watch('request.isPolitical.other') && (
                      <TextInput
                        registration={register('request.isPolitical.other')}
                        placeholder="Other (specify)"
                      />
                    )}
                  </div>
                </FormField>

                <FormField
                  label="Line-up"
                  error={errors.request?.marginalizedArtists}
                  showError={!!touchedFields.request?.marginalizedArtists || isSubmitted}
                >
                  {fields.map((field, idx) => (
                    <div key={field.id} className="flex flex-col gap-1 mb-2">
                      <div className="flex w-full relative">
                        <TextInput
                          registration={register(
                            `request.marginalizedArtists.${idx}.name` as const,
                          )}
                          placeholder="Name"
                          className="!rounded-none border-r-0 flex-1"
                        />

                        <div className="flex-[2] relative">
                          <TextInput
                            registration={register(
                              `request.marginalizedArtists.${idx}.link` as const,
                            )}
                            placeholder="Link (URL or leave blank)"
                            className="!rounded-none !rounded-tr-xl pr-10 flex-1"
                          />

                          <button
                            type="button"
                            onClick={() => remove(idx)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 section-fg hover:opacity-70 transition-opacity"
                            aria-label="Remove artist"
                          >
                            <RiDeleteBack2Fill />
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1">
                          {errors.request?.marginalizedArtists?.[idx]?.name && (
                            <span className="section-fg text-xs italic">
                              {errors.request?.marginalizedArtists[idx]?.name?.message}
                            </span>
                          )}
                        </div>
                        <div className="flex-[2]">
                          {errors.request?.marginalizedArtists?.[idx]?.link && (
                            <span className="section-fg text-xs italic">
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
                    className="section-fg flex items-center gap-1 hover:underline -mt-3 py-1 text-sm px-2"
                  >
                    <IoAddCircle />
                    Add another artist
                  </button>
                </FormField>

                <FormField
                  label="Wage Policy"
                  error={errors.request?.wagePolicy}
                  required
                  showError={!!touchedFields.request?.wagePolicy || isSubmitted}
                >
                  <TextInput
                    registration={register('request.wagePolicy')}
                    isTextArea
                    rows={2}
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
                  showError={
                    !!touchedFields.request?.vehicleCert ||
                    !!touchedFields.request?.teamCert ||
                    !!touchedFields.request?.charterCert ||
                    isSubmitted
                  }
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
                        label="I certify that all persons involved have read and signed the manifesto."
                        {...register('request.charterCert')}
                      />
                    </div>
                  </div>
                </FormField>
              </div>
            </div>
          </div>
        )}

        {/* Installation Manual and Manifesto Links */}
        <div className="border panel-border p-6 rounded-xl mt-4">
          <h2 className="text-xl mb-4 panel-fg">Technical manuals</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <a
              href="/docs/pssound-manual-en.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 section-bg invert-panel hover:opacity-80 rounded-md text-center"
            >
              English Manual (PDF)
            </a>
            <a
              href="/docs/pssound-manual-fr.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 panel-bg invert-panel hover:opacity-80 rounded-md text-center"
            >
              Manuel Français (PDF)
            </a>
          </div>

          <h2 className="text-xl mb-4 panel-fg">Manifesto</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/docs/pssound-manifesto-en.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 panel-bg invert-panel hover:opacity-80 rounded-md text-center"
            >
              English Manifesto (PDF)
            </a>
            <a
              href="/docs/pssound-manifesto-fr.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 panel-bg invert-panel hover:opacity-80 rounded-md text-center"
            >
              Manifeste Français (PDF)
            </a>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting || isMember === null}
          className="mt-16 section-bg invert-panel text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-64 h-64 rounded-full text-center mx-auto block disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
