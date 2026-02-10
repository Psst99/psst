'use client'

import {useState, useContext} from 'react'
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
  isBefore,
  startOfDay,
  isSameDay,
  isWithinInterval,
  isAfter,
} from 'date-fns'
import {ThemeContext} from '@/app/ThemeProvider'
import {getTheme} from '@/lib/theme/sections'

interface CalendarProps {
  bookedDates: string[]
  onDateRangeSelect?: (startDate: string, endDate: string | null) => void
  selectedStartDate?: string | null
  selectedEndDate?: string | null
}

export default function Calendar({
  bookedDates,
  onDateRangeSelect,
  selectedStartDate,
  selectedEndDate,
}: CalendarProps) {
  const themeCtx = useContext(ThemeContext)
  const theme = getTheme('pssound-system', themeCtx?.mode || 'brand', themeCtx?.themeOverrides)

  const [currentMonth, setCurrentMonth] = useState(() => new Date())
  const [rangeStart, setRangeStart] = useState<Date | null>(
    selectedStartDate ? new Date(selectedStartDate) : null,
  )

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const isDateBooked = (date: Date) => bookedDates.includes(format(date, 'yyyy-MM-dd'))

  const isPastDate = (date: Date) => isBefore(startOfDay(date), startOfDay(new Date()))

  const isStartDate = (date: Date) => rangeStart && isSameDay(date, rangeStart)

  const isEndDate = (date: Date) => {
    if (!selectedEndDate) return false
    return isSameDay(date, new Date(selectedEndDate))
  }

  const isInRange = (date: Date) => {
    if (!rangeStart || !selectedEndDate) return false
    const end = new Date(selectedEndDate)
    try {
      return isWithinInterval(date, {
        start: rangeStart,
        end: end,
      })
    } catch {
      return false
    }
  }

  const handleDateClick = (date: Date) => {
    if (!isDateBooked(date) && !isPastDate(date) && isSameMonth(date, currentMonth)) {
      const dateStr = format(date, 'yyyy-MM-dd')

      if (!rangeStart) {
        // First click - set start date
        setRangeStart(date)
        onDateRangeSelect?.(dateStr, null)
      } else if (isSameDay(date, rangeStart)) {
        // Click on start date again - clear selection
        setRangeStart(null)
        onDateRangeSelect?.('', null)
      } else if (isBefore(date, rangeStart)) {
        // Click before start - reset to new start
        setRangeStart(date)
        onDateRangeSelect?.(dateStr, null)
      } else {
        // Click after start - set end date
        onDateRangeSelect?.(format(rangeStart, 'yyyy-MM-dd'), dateStr)
        // Keep rangeStart for visual feedback
      }
    }
  }
  // Calendar grid logic
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const startDate = startOfWeek(monthStart, {weekStartsOn: 1}) // Monday
  const endDate = endOfWeek(monthEnd, {weekStartsOn: 1})

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
      const currentDay = day

      const isBooked = isDateBooked(currentDay)
      const isPast = isPastDate(currentDay)
      const isStart = isStartDate(currentDay)
      const isEnd = isEndDate(currentDay)
      const inRange = isInRange(currentDay)
      const isClickable = !isBooked && !isPast && isCurrentMonth

      daysInWeek.push(
        <div
          key={day.toString()}
          onClick={() => handleDateClick(currentDay)}
          style={{
            borderColor: theme.bg,
            ...(isBooked
              ? {backgroundColor: '#A20018'}
              : isStart || isEnd
                ? {
                    backgroundColor: theme.bg,
                    boxShadow: `0 0 0 4px ${theme.fg}80`,
                  }
                : inRange
                  ? {backgroundColor: `${theme.bg}99`}
                  : isPast
                    ? {backgroundColor: 'white', opacity: 0.4}
                    : {backgroundColor: 'white'}),
          }}
          className={`flex-1 min-h-[60px] sm:min-h-[80px] flex items-center justify-center transition-colors rounded-lg ${
            isBooked
              ? 'cursor-not-allowed'
              : isStart || isEnd
                ? 'cursor-pointer'
                : inRange
                  ? 'cursor-pointer'
                  : isPast
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer'
          }`}
          onMouseEnter={(e) => {
            if (!isBooked && !isPast && !(isStart || isEnd || inRange)) {
              e.currentTarget.style.backgroundColor = theme.bg
            }
          }}
          onMouseLeave={(e) => {
            if (!isBooked && !isPast && !(isStart || isEnd || inRange)) {
              e.currentTarget.style.backgroundColor = 'white'
            }
          }}
        >
          <span
            style={{
              color: isBooked
                ? 'white'
                : isStart || isEnd || inRange
                  ? theme.fg
                  : isCurrentMonth
                    ? theme.fg
                    : `${theme.bg}`,
            }}
            className={`text-lg sm:text-2xl ${
              isStart || isEnd ? 'font-bold' : inRange ? 'font-semibold' : ''
            }`}
          >
            {formattedDate}
          </span>
        </div>,
      )
      day = addDays(day, 1)
    }

    weeks.push(
      <div key={weekStart.toString()} className="flex gap-1 flex-1">
        {daysInWeek}
      </div>,
    )
    daysInWeek = []
  }

  return (
    <div
      // style={{backgroundColor: theme.bg}}
      className="pt-0 p-2 sm:p-4 rounded-lg h-[80svh] w-full md:max-w-[85vw] mx-auto flex flex-col"
    >
      <div className="grid grid-cols-7 gap-2 mb-2 shrink-0">
        {days.map((day, index) => (
          <div
            key={day}
            style={{
              backgroundColor: theme.bg,
              color: theme.fg,
            }}
            className="p-1 sm:p-1 text-center text-base leading-tight md:text-xl tracking-tight rounded-lg"
          >
            <span className="block sm:hidden">{mobileDays[index]}</span>
            <span className="hidden sm:block">{day}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1 flex-1 min-h-0">{weeks}</div>

      {/* Legend */}
      {/* <div className="mt-2 mb-2 flex flex-wrap gap-2 text-xs sm:text-sm text-[#07f25b] justify-center">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-white border border-[#81520a] rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-[#07f25b] border border-[#81520a] rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-[#A20018] border border-[#81520a] rounded"></div>
          <span>Booked</span>
        </div>
      </div> */}

      <div className="mt-2 flex items-center justify-between gap-2 h-6 text-base leading-tight md:text-xl tracking-tight shrink-0">
        <button
          onClick={prevMonth}
          style={{backgroundColor: theme.bg, color: theme.fg}}
          className="px-2 sm:px-4 py-1 rounded-md flex items-center h-full"
        >
          ←
        </button>
        <div
          style={{backgroundColor: theme.bg, color: theme.fg}}
          className="px-4 rounded-md w-full flex items-center justify-center h-full"
        >
          {format(currentMonth, monthFormat).toUpperCase()}
        </div>
        <button
          onClick={nextMonth}
          style={{backgroundColor: theme.bg, color: theme.fg}}
          className="px-2 sm:px-4 py-1 rounded-md flex items-center h-full"
        >
          →
        </button>
      </div>
    </div>
  )
}
