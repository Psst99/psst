export type EventDateFields = {
  date?: string | null
  endDate?: string | null
  dates?: Array<string | null> | null
}

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'numeric',
  day: 'numeric',
  year: 'numeric',
})

function parseDate(value?: string | null) {
  if (!value) return null

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function isSameCalendarDate(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  )
}

function formatDate(date: Date) {
  return DATE_FORMATTER.format(date)
}

function calendarDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

function sortedDates(values: Array<string | null | undefined>) {
  return values
    .map((value) => parseDate(value))
    .filter((date): date is Date => Boolean(date))
    .sort((a, b) => a.getTime() - b.getTime())
}

function uniqueSortedCalendarDates(values: Array<string | null | undefined>) {
  const seen = new Set<string>()

  return sortedDates(values).filter((entry) => {
    const key = calendarDateKey(entry)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function getEventEndDate(event: EventDateFields) {
  const dates = sortedDates([event.date, event.endDate, ...(event.dates ?? [])])
  return dates.length ? dates[dates.length - 1] : null
}

export function isEventUpcoming(event: EventDateFields, now = new Date()) {
  const endDate = getEventEndDate(event)
  return endDate ? endDate >= now : false
}

export function formatEventDateLabels(event: EventDateFields) {
  const startDate = parseDate(event.date)
  const endDate = parseDate(event.endDate)
  const labels: string[] = []
  const coveredDates = new Set<string>()

  if (startDate && endDate && !isSameCalendarDate(startDate, endDate)) {
    labels.push(`${formatDate(startDate)} - ${formatDate(endDate)}`)
    coveredDates.add(calendarDateKey(startDate))
    coveredDates.add(calendarDateKey(endDate))
  } else if (startDate) {
    labels.push(formatDate(startDate))
    coveredDates.add(calendarDateKey(startDate))
  } else if (endDate) {
    labels.push(formatDate(endDate))
    coveredDates.add(calendarDateKey(endDate))
  }

  for (const date of uniqueSortedCalendarDates(event.dates ?? [])) {
    if (coveredDates.has(calendarDateKey(date))) continue
    labels.push(formatDate(date))
  }

  return labels
}

export function formatEventDateLabel(event: EventDateFields) {
  const labels = formatEventDateLabels(event)
  return labels.length ? labels.join(', ') : undefined
}
