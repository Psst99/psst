import Calendar from '@/components/calendar'
import { eachDayOfInterval, parseISO, format } from 'date-fns'
import PssoundCombinedForm from '@/components/pssound-system/PssoundCombinedForm'
import { sanityFetch } from '@/sanity/lib/live'
import {
  allApprovedCollectivesQuery,
  allBlockedDatesQuery,
} from '@/sanity/lib/queries'

export default async function SoundSystemRequestPage() {
  const { data } = await sanityFetch({ query: allBlockedDatesQuery })
  const blockedDates: string[] = data.flatMap(
    (item: { startDate: string; endDate: string }) => {
      if (!item.startDate || !item.endDate) return []
      return eachDayOfInterval({
        start: parseISO(item.startDate),
        end: parseISO(item.endDate),
      }).map((date) => format(date, 'yyyy-MM-dd'))
    }
  )

  const { data: collectives } = await sanityFetch({
    query: allApprovedCollectivesQuery,
  })

  return (
    <>
      <Calendar bookedDates={blockedDates} />

      <div className='p-4 mt-16'>
        <PssoundCombinedForm
          bookedDates={blockedDates}
          collectives={collectives}
        />
      </div>
    </>
  )
}
