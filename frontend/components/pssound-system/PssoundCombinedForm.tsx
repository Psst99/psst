'use client'

import {useState, useEffect} from 'react'
import {useForm, useFieldArray, type FieldError} from 'react-hook-form'
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
import {useRouter} from 'next/navigation'
import {
  getBookedDateInRange,
  isDateRangeInOrder,
  PSSOUND_INVALID_RANGE_MESSAGE,
  PSSOUND_UNAVAILABLE_RANGE_MESSAGE,
} from '@/lib/pssound-dates'

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
    request: z.any().optional(),
  }),
])

type CombinedFormData =
  | {
      isMember: true
      selectedCollective: string
      membership?: unknown
      request: PssoundRequestFormData
    }
  | {
      isMember: false
      selectedCollective?: string
      membership: PssoundMembershipFormData
      request?: PssoundRequestFormData
    }

export type PssoundFileGroup = 'technicalManuals' | 'manifesto' | 'other'

export interface PssoundFileLink {
  _id: string
  label?: string | null
  fileGroup?: PssoundFileGroup | string | null
  languageCode?: string | null
  languageName?: string | null
  url?: string | null
}

interface PssoundCombinedFormProps {
  bookedDates: string[]
  collectives: {_id: string; collectiveName: string}[]
  files?: PssoundFileLink[]
  selectedStartDate?: string | null
  selectedEndDate?: string | null
}

const PSSOUND_FILE_GROUPS: Array<{title: string; value: PssoundFileGroup}> = [
  {title: 'Technical manuals', value: 'technicalManuals'},
  {title: 'Manifesto', value: 'manifesto'},
  {title: 'Files', value: 'other'},
]

const LINEUP_INPUT_CLASSNAME =
  '!bg-transparent !rounded-none !border-b !border-current !px-0 !py-2 min-[69.375rem]:!text-2xl placeholder:text-current placeholder:opacity-60'

function resolveFileGroup(fileGroup: PssoundFileLink['fileGroup']): PssoundFileGroup {
  if (fileGroup === 'technicalManuals' || fileGroup === 'manifesto' || fileGroup === 'other') {
    return fileGroup
  }

  return 'other'
}

function formatFileTitle(file: PssoundFileLink) {
  const title = file.label?.trim() || file.languageName?.trim() || 'Open PDF'
  const languageCode = file.languageCode?.trim()

  if (!languageCode) {
    return title
  }

  const formattedCode = languageCode.toUpperCase()
  if (title.toLowerCase().endsWith(`(${languageCode.toLowerCase()})`)) {
    return title
  }

  return `${title} (${formattedCode})`
}

function isDateBooked(dateStr: string, bookedDates: string[]) {
  return bookedDates.includes(dateStr)
}

function getLineupErrorMessage(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') {
    return undefined
  }

  const maybeError = error as {
    message?: unknown
    name?: {message?: unknown}
    link?: {message?: unknown}
  }

  if (typeof maybeError.message === 'string') {
    return maybeError.message
  }

  if (Array.isArray(error)) {
    for (const item of error) {
      const itemMessage = getLineupErrorMessage(item)
      if (itemMessage) return itemMessage
    }
  }

  if (typeof maybeError.name?.message === 'string') {
    return maybeError.name.message
  }

  if (typeof maybeError.link?.message === 'string') {
    return maybeError.link.message
  }

  return undefined
}

export default function PssoundCombinedForm({
  bookedDates,
  collectives,
  files = [],
  selectedStartDate,
  selectedEndDate,
}: PssoundCombinedFormProps) {
  const [isMember, setIsMember] = useState<boolean | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: {errors, touchedFields, isSubmitted, isSubmitting},
  } = useForm<CombinedFormData>({
    resolver: zodResolver(combinedFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      isMember: false,
      selectedCollective: '',
      membership: {
        collectiveName: '',
        email: '',
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
        membershipCert: true,
      },
    },
  })

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'request.marginalizedArtists',
  })

  const bookedDateObjs = bookedDates.map((date) => new Date(date))
  const watchedEventDate = watch('request.eventDate')
  const watchedPickupDate = watch('request.pickupDate')
  const watchedReturnDate = watch('request.returnDate')
  const eventDate = watchedEventDate ? new Date(watchedEventDate) : null
  const pickupDate = watchedPickupDate ? new Date(watchedPickupDate) : null
  const returnDate = watchedReturnDate ? new Date(watchedReturnDate) : null
  const selectedCalendarLabel = selectedStartDate
    ? selectedEndDate
      ? `${selectedStartDate} to ${selectedEndDate}`
      : selectedStartDate
    : null
  const membershipErrors =
    isMember === false && errors.membership && typeof errors.membership === 'object'
      ? (errors.membership as Partial<Record<keyof PssoundMembershipFormData, any>>)
      : undefined
  const membershipTouched =
    isMember === false && touchedFields.membership && typeof touchedFields.membership === 'object'
      ? (touchedFields.membership as Partial<Record<keyof PssoundMembershipFormData, boolean>>)
      : undefined
  const fileGroups = PSSOUND_FILE_GROUPS.map((group) => ({
    ...group,
    files: files.filter((file) => resolveFileGroup(file.fileGroup) === group.value && file.url),
  })).filter((group) => group.files.length > 0)
  const lineupErrorMessage = getLineupErrorMessage(errors.request?.marginalizedArtists)
  const lineupError = lineupErrorMessage
    ? ({type: 'manual', message: lineupErrorMessage} as FieldError)
    : undefined
  const visibleSubmitError =
    submitError === 'Please complete the required fields above.' ? null : submitError

  // Auto-populate dates from calendar selection
  useEffect(() => {
    if (!selectedStartDate) return

    if (selectedStartDate !== watchedEventDate) {
      setValue('request.eventDate', selectedStartDate, {
        shouldTouch: true,
        shouldValidate: true,
      })
    }

    if (selectedStartDate !== watchedPickupDate) {
      setValue('request.pickupDate', selectedStartDate, {
        shouldTouch: true,
        shouldValidate: true,
      })
    }

    const selectedReturnDate = selectedEndDate || selectedStartDate
    if (selectedReturnDate !== watchedReturnDate) {
      setValue('request.returnDate', selectedReturnDate, {
        shouldTouch: true,
        shouldValidate: true,
      })
    }
  }, [
    selectedEndDate,
    selectedStartDate,
    setValue,
    watchedEventDate,
    watchedPickupDate,
    watchedReturnDate,
  ])

  const onSubmit = async (data: CombinedFormData) => {
    setSubmitError(null)

    // Check if any request dates are booked
    if (data.isMember) {
      if (!isDateRangeInOrder(data.request.pickupDate, data.request.returnDate)) {
        setSubmitError(PSSOUND_INVALID_RANGE_MESSAGE)
        return
      }

      if (
        isDateBooked(data.request.eventDate, bookedDates) ||
        getBookedDateInRange(data.request.pickupDate, data.request.returnDate, bookedDates)
      ) {
        setSubmitError(PSSOUND_UNAVAILABLE_RANGE_MESSAGE)
        return
      }
    }

    try {
      const payload = data.isMember
        ? {
            isMember: true,
            selectedCollective: data.selectedCollective,
            request: data.request,
          }
        : {
            isMember: false,
            membership: data.membership,
          }
      const res = await fetch('/api/pssound-combined', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as {error?: string} | null
        throw new Error(payload?.error || 'Submission failed')
      }

      router.push('/pssound-system/request/success')
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Submission failed. Please try again.',
      )
      console.error('Error submitting form:', error)
    }
  }

  const onInvalidSubmit = () => {
    setSubmitError(null)
  }

  return (
    <div className="h-full w-full md:max-w-[65vw] mx-auto md:p-4">
      <form
        onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
        className="space-y-6 form-scroll-bottom-space"
      >
        {/* Membership selection */}
        <div className="p-6 section-bg rounded-xl">
          <div className="mb-4 flex flex-col items-center gap-4 min-[86rem]:flex-row min-[86rem]:items-baseline min-[86rem]:justify-between">
            <p className="tracking-tight text-2xl mb-4 section-fg text-center min-[86rem]:text-left">
              Are you already a Pssound Community member?
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
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
                    ? 'panel-bg panel-fg ring-4 ring-[var(--panel-fg)]/30'
                    : 'bg-white section-fg hover:[background:var(--panel-bg)] hover:[color:var(--panel-fg)] hover:ring-4 hover:ring-[var(--panel-fg)]/30'
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
                    ? 'panel-bg panel-fg ring-4 ring-[var(--panel-fg)]/30'
                    : 'bg-white section-fg hover:[background:var(--panel-bg)] hover:[color:var(--panel-fg)] hover:ring-4 hover:ring-[var(--panel-fg)]/30'
                }`}
              >
                No
              </button>
            </div>
          </div>
        </div>

        {isMember === true && (
          <div className="p-6 section-bg rounded-xl">
            <p className="tracking-tight text-2xl mb-4 section-fg">
              Select your collective
              <span className="ml-1 text-red-500">*</span>
            </p>
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
                <SelectContent className="section-bg section-fg border rounded max-h-[min(22rem,var(--radix-select-content-available-height))]">
                  {collectives.map((col) => (
                    <SelectItem
                      key={col._id}
                      value={col.collectiveName}
                      className="text-base md:text-xl py-2"
                    >
                      {col.collectiveName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(touchedFields.selectedCollective || isSubmitted) && errors.selectedCollective && (
              <p className="panel-fg text-lg tracking-tight mt-2 ml-2">
                <span className="mr-0.5 text-red-500">*</span>
                {errors.selectedCollective.message}
              </p>
            )}
          </div>
        )}

        {/* Section A: Membership Form (conditional) */}
        {isMember === false && (
          <div className="relative border panel-border rounded-3xl panel-bg p-6 pt-10 mt-16">
            <div className="absolute left-14 -top-[31px]">
              <div className="loan-request-tab relative inline-flex items-center justify-center px-8 py-1 border border-b-0 uppercase tracking-tight panel-bg panel-fg panel-border">
                <span className="relative z-[2] font-normal text-[24px] leading-[22px]">
                  Membership application
                </span>
                <span className="pointer-events-none absolute left-0 right-0 bottom-[-1px] h-[1px] panel-bg" />
              </div>
            </div>

            <div className="space-y-4">
              <FormField
                label="Name of your collective / association"
                error={membershipErrors?.collectiveName}
                required
                showError={!!membershipTouched?.collectiveName || isSubmitted}
              >
                <TextInput registration={register('membership.collectiveName')} />
              </FormField>

              <FormField
                label="Contact email"
                error={membershipErrors?.email}
                required
                showError={!!membershipTouched?.email || isSubmitted}
              >
                <TextInput registration={register('membership.email')} type="email" />
              </FormField>

              <FormField
                label="Is your project political?"
                error={membershipErrors?.isPolitical}
                showError={!!membershipTouched?.isPolitical || isSubmitted}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2 px-4 py-3">
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
                error={membershipErrors?.caribbeanOrAfro}
                required
                showError={!!membershipTouched?.caribbeanOrAfro || isSubmitted}
              >
                <div className="flex h-full flex-col justify-center gap-2 px-4 py-3">
                  {[
                    {label: 'Yes', value: 'true' as const},
                    {label: 'No', value: 'false' as const},
                  ].map((option) => (
                    <StyledCheckbox
                      key={option.value}
                      label={option.label}
                      checked={watch('membership.caribbeanOrAfro') === option.value}
                      onChange={() =>
                        setValue('membership.caribbeanOrAfro', option.value, {
                          shouldTouch: true,
                          shouldValidate: true,
                        })
                      }
                    />
                  ))}
                </div>
              </FormField>

              <FormField
                label="Qualified sound engineer in your team?"
                error={membershipErrors?.qualifiedSoundEngineer}
                required
                showError={!!membershipTouched?.qualifiedSoundEngineer || isSubmitted}
              >
                <div className="flex h-full flex-col justify-center gap-2 px-4 py-3">
                  {[
                    {label: 'Yes', value: 'yes' as const},
                    {
                      label: 'No, but we commit to work with a qualified person at our events.',
                      value: 'no_commit' as const,
                    },
                  ].map((option) => (
                    <StyledCheckbox
                      key={option.value}
                      label={option.label}
                      checked={watch('membership.qualifiedSoundEngineer') === option.value}
                      onChange={() =>
                        setValue('membership.qualifiedSoundEngineer', option.value, {
                          shouldTouch: true,
                          shouldValidate: true,
                        })
                      }
                    />
                  ))}
                </div>
              </FormField>

              <FormField
                label="Annual contribution (between 75 and 150 euros to BE78735060790086)"
                error={membershipErrors?.annualContribution}
                required
                showError={!!membershipTouched?.annualContribution || isSubmitted}
              >
                <TextInput registration={register('membership.annualContribution')} />
              </FormField>

              <FormField
                label="Manifesto"
                error={membershipErrors?.charterSigned}
                required
                showError={!!membershipTouched?.charterSigned || isSubmitted}
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
        {isMember === true && (
          <div className="relative border panel-border rounded-3xl panel-bg p-6 pt-10 mt-16">
            <div className="absolute left-14 -top-[31px]">
              <div className="loan-request-tab relative inline-flex items-center justify-center px-8 py-1 border border-b-0 uppercase tracking-tight panel-bg panel-fg panel-border">
                <span className="relative z-[2] font-normal text-[24px] leading-[22px]">
                  Loan request
                </span>
                <span className="pointer-events-none absolute left-0 right-0 bottom-[-1px] h-[1px] panel-bg" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div>
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
                </div>

                {selectedStartDate && (
                  <div className="min-h-[88px] px-4 rounded-xl border panel-border flex items-center justify-center text-center panel-bg invert-panel">
                    <p className="font-normal text-[24px] leading-[22px]">
                      {selectedCalendarLabel}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
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
                </div>

                <div>
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
                    <div className="flex flex-col gap-2 px-4 py-3">
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
                  error={lineupError}
                  required
                  showError={
                    Boolean(lineupError) &&
                    (!!touchedFields.request?.marginalizedArtists || isSubmitted)
                  }
                >
                  <div className="flex flex-col gap-4 px-4 py-4">
                    {fields.map((field, idx) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-1 gap-4 min-[69.375rem]:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_2.5rem] min-[69.375rem]:items-center"
                      >
                        <TextInput
                          registration={register(
                            `request.marginalizedArtists.${idx}.name` as const,
                          )}
                          placeholder="Name"
                          className={LINEUP_INPUT_CLASSNAME}
                        />

                        <div className="relative">
                          <TextInput
                            registration={register(
                              `request.marginalizedArtists.${idx}.link` as const,
                            )}
                            placeholder="Link (URL or leave blank)"
                            className={`${LINEUP_INPUT_CLASSNAME} !pr-10`}
                          />

                          {fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(idx)}
                              className="absolute right-0 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center section-fg transition-opacity hover:opacity-70 cursor-pointer min-[69.375rem]:hidden"
                              aria-label="Remove artist"
                            >
                              <RiDeleteBack2Fill aria-hidden="true" />
                            </button>
                          )}
                        </div>

                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(idx)}
                            className="hidden h-9 w-9 items-center justify-center section-fg transition-opacity hover:opacity-70 cursor-pointer min-[69.375rem]:flex"
                            aria-label="Remove artist"
                          >
                            <RiDeleteBack2Fill aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => append({name: '', link: ''})}
                      className="mt-1 inline-flex w-fit items-center gap-2 section-fg text-lg leading-tight transition-opacity hover:opacity-75 cursor-pointer min-[69.375rem]:text-xl"
                    >
                      <IoAddCircle aria-hidden="true" />
                      Add another artist
                    </button>
                  </div>
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
                  required
                  showError={
                    !!touchedFields.request?.vehicleCert ||
                    !!touchedFields.request?.teamCert ||
                    !!touchedFields.request?.charterCert ||
                    isSubmitted
                  }
                >
                  <div className="flex h-full w-full items-center px-4 py-4">
                    <div className="flex w-full flex-col gap-4">
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

        {isMember === true && fileGroups.length > 0 && (
          <div className="border panel-border p-6 rounded-xl mt-4">
            {fileGroups.map((group, groupIndex) => (
              <section
                key={group.value}
                className={groupIndex < fileGroups.length - 1 ? 'mb-6' : undefined}
              >
                <h2 className="text-xl mb-4 panel-fg">{group.title}</h2>
                <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                  {group.files.map((file) => (
                    <a
                      key={file._id}
                      href={file.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      hrefLang={file.languageCode || undefined}
                      className="px-4 py-2 panel-bg invert-panel hover:opacity-80 rounded-md text-center"
                    >
                      {formatFileTitle(file)}
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {visibleSubmitError && (
          <p className="panel-fg text-lg tracking-tight text-center">
            <span className="mr-0.5 text-red-500">*</span>
            {visibleSubmitError}
          </p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting || isMember === null}
          className="mt-16 section-bg invert-panel text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-64 h-64 rounded-full text-center mx-auto block cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
