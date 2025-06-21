'use client'

import type React from 'react'

import { useState } from 'react'
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  addDays,
  startOfWeek,
  endOfWeek,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Sample data for booked dates
const bookedDates = [
  new Date(2025, 2, 14), // March 14, 2025
  new Date(2025, 2, 21), // March 21, 2025
  new Date(2025, 2, 22), // March 22, 2025
  new Date(2025, 2, 27), // March 27, 2025
]

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 2, 1)) // March 2025
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    purpose: '',
  })

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleDateClick = (day: Date) => {
    setSelectedDate(day)
    setShowBookingModal(true)
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send this data to your backend
    console.log('Booking submitted:', {
      date: selectedDate,
      ...bookingDetails,
    })
    setShowBookingModal(false)
    setBookingDetails({ name: '', email: '', purpose: '' })
    // Add the date to booked dates (in a real app, this would come from the backend)
    // This is just for demonstration
    if (selectedDate) {
      bookedDates.push(new Date(selectedDate))
    }
  }

  const isDateBooked = (date: Date) => {
    return bookedDates.some((bookedDate) => isSameDay(bookedDate, date))
  }

  // Get days for the calendar grid
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }) // Start on Monday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const dateFormat = 'd'
  const monthFormat = 'MMMM yyyy'
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

  const weeks = []
  let daysInWeek = []
  let day = startDate
  let formattedDate = ''

  // Create weeks array
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat)
      const cloneDay = day
      const isCurrentMonth = isSameMonth(day, monthStart)

      daysInWeek.push(
        <div
          key={day.toString()}
          className={`p-2 sm:p-8 flex items-center justify-center border border-[#81520a] bg-white hover:bg-[#07f25b]/20 cursor-pointer transition-colors rounded-lg ${
            isDateBooked(day) ? 'bg-[#07f25b]' : ''
          }`}
          onClick={() => handleDateClick(cloneDay)}
        >
          <span
            className={`text-lg sm:text-2xl ${isCurrentMonth ? 'text-[#81520a]' : 'text-[#07f25b]'}`}
          >
            {formattedDate}
          </span>
        </div>
      )
      day = addDays(day, 1)
    }
    weeks.push(
      <div key={day.toString()} className='grid grid-cols-7 gap-2'>
        {daysInWeek}
      </div>
    )
    daysInWeek = []
  }

  return (
    <div className='bg-[#81520a] p-2 sm:p-4 rounded-lg'>
      <div className='mb-4 grid grid-cols-7 gap-2'>
        {days.map((day) => (
          <div
            key={day}
            className='p-1 sm:p-1 bg-[#07f25b] text-black font-bold text-center border border-[#81520a] text-xs sm:text-base rounded-lg'
          >
            {day}
          </div>
        ))}
      </div>

      <div className='mb-4 flex flex-col gap-2'>{weeks}</div>

      <div className='flex items-center justify-between gap-2'>
        <button
          onClick={prevMonth}
          className='bg-[#07f25b] text-black px-2 sm:px-4 py-1 rounded-md flex items-center'
        >
          <ChevronLeft size={16} />
        </button>
        <div className='bg-[#07f25b] text-black px-4 rounded-md font-bold text-sm sm:text-base w-full flex items-center justify-center'>
          {format(currentMonth, monthFormat).toUpperCase()}
        </div>
        <button
          onClick={nextMonth}
          className='bg-[#07f25b] text-black px-2 sm:px-4 py-1 rounded-md flex items-center'
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDate && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4'>
          <div className='bg-white p-4 sm:p-6 rounded-lg w-full max-w-md'>
            <h2 className='text-xl sm:text-2xl font-bold mb-4 text-[#81520a]'>
              Book Sound System for {format(selectedDate, 'MMMM d, yyyy')}
            </h2>
            <form onSubmit={handleBookingSubmit}>
              <div className='mb-4'>
                <label className='block text-[#81520a] mb-1'>Name</label>
                <input
                  type='text'
                  value={bookingDetails.name}
                  onChange={(e) =>
                    setBookingDetails({
                      ...bookingDetails,
                      name: e.target.value,
                    })
                  }
                  className='w-full border border-[#81520a] p-2'
                  required
                />
              </div>
              <div className='mb-4'>
                <label className='block text-[#81520a] mb-1'>Email</label>
                <input
                  type='email'
                  value={bookingDetails.email}
                  onChange={(e) =>
                    setBookingDetails({
                      ...bookingDetails,
                      email: e.target.value,
                    })
                  }
                  className='w-full border border-[#81520a] p-2'
                  required
                />
              </div>
              <div className='mb-4'>
                <label className='block text-[#81520a] mb-1'>Purpose</label>
                <textarea
                  value={bookingDetails.purpose}
                  onChange={(e) =>
                    setBookingDetails({
                      ...bookingDetails,
                      purpose: e.target.value,
                    })
                  }
                  className='w-full border border-[#81520a] p-2 h-24'
                  required
                />
              </div>
              <div className='flex justify-end gap-2'>
                <button
                  type='button'
                  onClick={() => setShowBookingModal(false)}
                  className='bg-gray-300 text-black px-4 py-2 rounded'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='bg-[#07f25b] text-black px-4 py-2 rounded'
                >
                  Book Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
