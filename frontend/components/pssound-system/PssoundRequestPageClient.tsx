'use client'

import {useState} from 'react'
import Calendar from '@/components/calendar'
import PssoundCombinedForm from './PssoundCombinedForm'

interface PssoundRequestPageClientProps {
  bookedDates: string[]
  collectives: {_id: string; collectiveName: string}[]
}

export default function PssoundRequestPageClient({
  bookedDates,
  collectives,
}: PssoundRequestPageClientProps) {
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(null)
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null)

  const handleDateRangeSelect = (startDate: string, endDate: string | null) => {
    setSelectedStartDate(startDate || null)
    setSelectedEndDate(endDate)
  }

  return (
    <>
      <Calendar
        bookedDates={bookedDates}
        onDateRangeSelect={handleDateRangeSelect}
        selectedStartDate={selectedStartDate}
        selectedEndDate={selectedEndDate}
      />

      <div className="p-4 mt-16">
        <PssoundCombinedForm
          bookedDates={bookedDates}
          collectives={collectives}
          selectedStartDate={selectedStartDate}
          selectedEndDate={selectedEndDate}
        />
      </div>
    </>
  )
}
