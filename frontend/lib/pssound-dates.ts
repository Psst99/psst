export const PSSOUND_UNAVAILABLE_RANGE_MESSAGE =
  'The selected loan period includes unavailable dates. Please choose a range that does not cross booked days.'

export const PSSOUND_INVALID_RANGE_MESSAGE =
  'Return date must be the same as or after the pick-up date.'

export function isDateRangeInOrder(startDate?: string | null, endDate?: string | null) {
  if (!startDate || !endDate) return true
  return startDate <= endDate
}

export function getBookedDateInRange(
  startDate: string | undefined | null,
  endDate: string | undefined | null,
  bookedDates: string[],
) {
  if (!startDate || !endDate) return undefined

  const rangeStart = startDate <= endDate ? startDate : endDate
  const rangeEnd = startDate <= endDate ? endDate : startDate

  return bookedDates.find((date) => date >= rangeStart && date <= rangeEnd)
}
