'use client'

import { useState } from 'react'
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  addDays,
  startOfWeek,
  endOfWeek,
} from 'date-fns'

interface CalendarProps {
  bookedDates: string[]
}

export default function Calendar({ bookedDates }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date())

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const isDateBooked = (date: Date) =>
    bookedDates.includes(format(date, 'yyyy-MM-dd'))
  // Calendar grid logic
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const dateFormat = 'd'
  const monthFormat = 'MMM yyyy'
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
  const mobileDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  const weeks = []
  let daysInWeek = []
  let day = startDate

  while (day <= endDate) {
    const weekStart = day

    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, dateFormat)
      const isCurrentMonth = isSameMonth(day, monthStart)

      daysInWeek.push(
        <div
          key={day.toString()}
          className={`flex-1 min-h-[60px] sm:min-h-[80px] flex items-center justify-center border border-[#81520a] transition-colors rounded-lg ${
            isDateBooked(day) ? 'bg-[#07f25b] cursor-not-allowed' : 'bg-white'
          }`}
        >
          <span
            className={`text-lg sm:text-2xl ${
              isDateBooked(day)
                ? 'text-[#81520a]'
                : isCurrentMonth
                  ? 'text-[#81520a]'
                  : 'text-[#07f25b]'
            }`}
          >
            {formattedDate}
          </span>
        </div>
      )
      day = addDays(day, 1)
    }

    weeks.push(
      <div key={weekStart.toString()} className='flex gap-1 flex-1'>
        {daysInWeek}
      </div>
    )
    daysInWeek = []
  }

  return (
    <div className='pt-0 bg-[#81520a] p-2 sm:p-4 rounded-lg h-[80svh] w-full md:max-w-[85vw] mx-auto flex flex-col'>
      <div className='grid grid-cols-7 gap-2 mb-2 shrink-0'>
        {days.map((day, index) => (
          <div
            key={day}
            className='p-1 sm:p-1 bg-[#07f25b] text-[#81520a] text-center border border-[#81520a] text-base leading-tight md:text-xl tracking-tight rounded-lg'
          >
            <span className='block sm:hidden'>{mobileDays[index]}</span>
            <span className='hidden sm:block'>{day}</span>
          </div>
        ))}
      </div>
      <div className='flex flex-col gap-1 flex-1 min-h-0'>{weeks}</div>
      <div className='mt-2 flex items-center justify-between gap-2 h-6 text-base leading-tight md:text-xl tracking-tight shrink-0'>
        <button
          onClick={prevMonth}
          className='bg-[#07f25b] text-[#81520a] px-2 sm:px-4 py-1 rounded-md flex items-center h-full'
        >
          ←
        </button>
        <div className='bg-[#07f25b] text-[#81520a] px-4 rounded-md w-full flex items-center justify-center h-full'>
          {format(currentMonth, monthFormat).toUpperCase()}
        </div>
        <button
          onClick={nextMonth}
          className='bg-[#07f25b] text-[#81520a] px-2 sm:px-4 py-1 rounded-md flex items-center h-full'
        >
          →
        </button>
      </div>
    </div>
  )
}
