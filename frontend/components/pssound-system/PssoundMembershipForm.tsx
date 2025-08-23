'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  pssoundMembershipSchema,
  PssoundMembershipFormData,
} from '@/lib/schemas/pssoundMembership'
import { FormField } from '@/components/form/FormField'
import { TextInput } from '@/components/form/TextInput'
import { StyledCheckbox } from '../ui/StyledCheckbox'

export default function PssoundMembershipForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PssoundMembershipFormData>({
    resolver: zodResolver(pssoundMembershipSchema),
    defaultValues: {
      collectiveName: '',
      isPolitical: [],
      otherPolitical: '',
      caribbeanOrAfro: undefined,
      qualifiedSoundEngineer: undefined,
      annualContribution: '',
      charterSigned: false,
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<string | null>(null)

  const onSubmit = async (data: PssoundMembershipFormData) => {
    setIsSubmitting(true)
    setSubmitStatus(null)
    try {
      const res = await fetch('/api/register-pssound-membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitStatus('success')
      reset()
    } catch (err) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='p-4 h-full w-full md:max-w-[65vw] mx-auto'>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          label='Name of your collective / association'
          error={errors.collectiveName}
          required
          bgClassName='bg-[#07f25b]'
        >
          <TextInput registration={register('collectiveName')} />
        </FormField>

        <FormField
          label='Is your project political?'
          error={errors.isPolitical}
          bgClassName='bg-[#07f25b]'
        >
          <div className='h-full flex items-center'>
            <div className='flex flex-wrap gap-8 p-4'>
              {['feminist', 'queer', 'racial', 'disability', 'other'].map(
                (opt) => (
                  <StyledCheckbox
                    key={opt}
                    label={opt}
                    value={opt}
                    {...register('isPolitical')}
                  />
                )
              )}
            </div>
            {watch('isPolitical')?.includes('other') && (
              <TextInput
                registration={register('otherPolitical')}
                placeholder='Other (specify)'
              />
            )}
          </div>
        </FormField>

        <FormField
          label='Does your project include/feature people of Caribbean or Afro descent?'
          error={errors.caribbeanOrAfro}
          required
          bgClassName='bg-[#07f25b]'
        >
          <select
            {...register('caribbeanOrAfro')}
            className='w-full rounded-t-none rounded-b-lg text-[#07f25b] px-4 py-2 text-2xl md:text-3xl border-0 outline-0 md:rounded-l-none md:rounded-tr-lg bg-white h-full'
          >
            <option value=''>Select…</option>
            <option value='true'>Yes</option>
            <option value='false'>No</option>
          </select>
        </FormField>

        <FormField
          label='Qualified sound engineer in your team?'
          error={errors.qualifiedSoundEngineer}
          required
          bgClassName='bg-[#07f25b]'
        >
          <select
            {...register('qualifiedSoundEngineer')}
            className='w-full rounded-t-none rounded-b-lg text-[#07f25b] px-4 py-2 text-2xl md:text-3xl border-0 outline-0 md:rounded-l-none md:rounded-tr-lg bg-white h-full'
          >
            <option value=''>Select…</option>
            <option value='yes'>Yes</option>
            <option value='no_commit'>
              No, but we commit to work with a qualified person at our events.
            </option>
          </select>
        </FormField>

        <FormField
          label='Annual contribution (between 75 and 150 euros)'
          error={errors.annualContribution}
          required
          bgClassName='bg-[#07f25b]'
        >
          <TextInput registration={register('annualContribution')} />
        </FormField>

        <FormField
          label='Charter of principles signed?'
          error={errors.charterSigned}
          required
          bgClassName='bg-[#07f25b]'
        >
          <div className='flex justify-start items-center h-full w-full p-4'>
            <StyledCheckbox
              label='I certify all persons involved have read and signed the charter.'
              {...register('charterSigned')}
            />
          </div>
        </FormField>

        {submitStatus === 'success' && (
          <div className='text-green-600 text-center'>
            Thank you! Your membership request was received.
          </div>
        )}
        {submitStatus === 'error' && (
          <div className='text-red-600 text-center'>
            Something went wrong. Please try again.
          </div>
        )}

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
