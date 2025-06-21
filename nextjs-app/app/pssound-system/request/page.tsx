'use client'

import type React from 'react'

import { useState } from 'react'

export default function RequestPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    eventDate: '',
    eventDescription: '',
    equipmentNeeded: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData)
    alert('Request submitted successfully!')
    setFormData({
      name: '',
      email: '',
      organization: '',
      eventDate: '',
      eventDescription: '',
      equipmentNeeded: '',
    })
  }

  return (
    <div className='max-w-3xl mx-auto px-4'>
      <h1 className='text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-[#07f25b]'>
        REQUEST SOUND SYSTEM
      </h1>
      <div className='bg-white p-4 sm:p-6 rounded-lg'>
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <div>
              <label className='block text-[#81520a] mb-1'>Name</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='w-full border border-[#81520a] p-2'
                required
              />
            </div>
            <div>
              <label className='block text-[#81520a] mb-1'>Email</label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                className='w-full border border-[#81520a] p-2'
                required
              />
            </div>
          </div>

          <div className='mb-4'>
            <label className='block text-[#81520a] mb-1'>
              Organization/Collective
            </label>
            <input
              type='text'
              name='organization'
              value={formData.organization}
              onChange={handleChange}
              className='w-full border border-[#81520a] p-2'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-[#81520a] mb-1'>Preferred Date</label>
            <input
              type='date'
              name='eventDate'
              value={formData.eventDate}
              onChange={handleChange}
              className='w-full border border-[#81520a] p-2'
              required
            />
          </div>

          <div className='mb-4'>
            <label className='block text-[#81520a] mb-1'>
              Event Description
            </label>
            <textarea
              name='eventDescription'
              value={formData.eventDescription}
              onChange={handleChange}
              className='w-full border border-[#81520a] p-2 h-32'
              required
            />
          </div>

          <div className='mb-6'>
            <label className='block text-[#81520a] mb-1'>
              Equipment Needed
            </label>
            <textarea
              name='equipmentNeeded'
              value={formData.equipmentNeeded}
              onChange={handleChange}
              className='w-full border border-[#81520a] p-2 h-24'
              required
            />
          </div>

          <div className='text-center'>
            <button
              type='submit'
              className='bg-[#07f25b] text-black px-8 py-2 font-bold rounded w-full sm:w-auto'
            >
              SUBMIT REQUEST
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
