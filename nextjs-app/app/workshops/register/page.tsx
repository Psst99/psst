'use client'

import { useState } from 'react'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    motivation: '',
    notes: '',
    consent: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className='p-4 h-full'>
      <form className='space-y-4'>
        {/* Name */}
        <div className='w-full bg-[#F50806] text-[#D2D2D2] rounded-lg mb-6 md:flex md:items-center md:justify-center'>
          <label className='block text-[#D2D2D2] font-medium text-center uppercase font-mono p-0 md:w-[30%]'>
            Full Name
          </label>
          <input
            type='text'
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className='w-full rounded-t-none rounded-b-lg text-[#F50806] px-4 py-1 border-0 outline-0 md:rounded-l-none md:rounded-tr-lg'
            required
          />
        </div>

        {/* Email */}
        <div className='w-full bg-[#F50806] text-[#D2D2D2] rounded-lg mb-6 md:flex md:items-center md:justify-center'>
          <label className='block text-[#D2D2D2] font-medium text-center uppercase font-mono p-0 md:w-[30%]'>
            Email
          </label>
          <input
            type='email'
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className='w-full rounded-t-none rounded-b-lg text-[#F50806] px-4 py-1 border-0 outline-0 md:rounded-l-none md:rounded-tr-lg'
            required
          />
        </div>

        {/* Phone (optional) */}
        <div className='w-full bg-[#F50806] text-[#D2D2D2] rounded-lg mb-6 md:flex md:items-center md:justify-center'>
          <label className='block text-[#D2D2D2] font-medium text-center uppercase font-mono p-0 md:w-[30%]'>
            Phone (optional)
          </label>
          <input
            type='tel'
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className='w-full rounded-t-none rounded-b-lg text-[#F50806] px-4 py-1 border-0 outline-0 md:rounded-l-none md:rounded-tr-lg'
          />
        </div>

        {/* Experience Level */}
        <div className='w-full bg-[#F50806] text-[#D2D2D2] rounded-lg mb-6 md:flex md:items-center md:justify-center'>
          <label className='block text-[#D2D2D2] font-medium text-center uppercase font-mono p-0 md:w-[30%]'>
            Experience Level
          </label>
          <select
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            className='w-full rounded-t-none rounded-b-lg text-[#F50806] px-4 py-1 border-0 outline-0 md:rounded-l-none md:rounded-tr-lg'
            required
          >
            <option value=''>Select...</option>
            <option value='beginner'>Beginner</option>
            <option value='intermediate'>Intermediate</option>
            <option value='advanced'>Advanced</option>
          </select>
        </div>

        {/* Motivation */}
        <div className='w-full bg-[#F50806] text-[#D2D2D2] rounded-lg mb-6 md:flex md:items-center md:justify-center'>
          <label className='block text-[#D2D2D2] font-medium text-center uppercase font-mono p-0 md:w-[30%]'>
            Why do you want to join?
          </label>
          <textarea
            value={formData.motivation}
            onChange={(e) => handleInputChange('motivation', e.target.value)}
            rows={4}
            className='w-full rounded-t-none rounded-b-lg text-[#F50806] px-4 py-2 border-0 outline-0 resize-none md:rounded-l-none md:rounded-tr-lg'
            required
          />
        </div>

        {/* Notes (optional) */}
        <div className='w-full bg-[#F50806] text-[#D2D2D2] rounded-lg mb-6 md:flex md:items-center md:justify-center'>
          <label className='block text-[#D2D2D2] font-medium text-center uppercase font-mono p-0 md:w-[30%]'>
            Notes / Special Requirements
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={2}
            className='w-full rounded-t-none rounded-b-lg text-[#F50806] px-4 py-2 border-0 outline-0 resize-none md:rounded-l-none md:rounded-tr-lg'
          />
        </div>

        {/* Consent */}
        {/* <div className='flex items-center mb-6'>
          <input
            type='checkbox'
            checked={formData.consent}
            onChange={(e) => handleInputChange('consent', e.target.checked)}
            className='accent-[#F50806] mr-2'
            required
          />
          <span className='text-[#F50806] font-mono text-sm'>
            I agree to the terms and privacy policy.
          </span>
        </div> */}

        {/* Submit Button */}
        <button
          type='submit'
          className='mt-16 bg-[#F50806] text-[#D2D2D2] text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-64 h-64 rounded-full text-center mx-auto block'
        >
          Submit
        </button>
      </form>
    </div>
  )
}
