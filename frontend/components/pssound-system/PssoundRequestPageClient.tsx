'use client'

import {useState} from 'react'
import Calendar from '@/components/calendar'
import PssoundCombinedForm from './PssoundCombinedForm'
import type {PssoundFileLink} from './PssoundCombinedForm'

interface PssoundRequestPageClientProps {
  bookedDates: string[]
  collectives: {_id: string; collectiveName: string}[]
  files: PssoundFileLink[]
}

export default function PssoundRequestPageClient({
  bookedDates,
  collectives,
  files,
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

      <div className="p-6 mt-16">
        <PssoundCombinedForm
          bookedDates={bookedDates}
          collectives={collectives}
          files={files}
          selectedStartDate={selectedStartDate}
          selectedEndDate={selectedEndDate}
        />
      </div>
    </>
  )
}
