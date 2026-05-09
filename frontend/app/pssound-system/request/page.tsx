import {eachDayOfInterval, parseISO, format} from 'date-fns'
import PssoundRequestPageClient from '@/components/pssound-system/PssoundRequestPageClient'
import {buildPageMetadata} from '@/lib/seo'
import {sanityFetch} from '@/sanity/lib/live'
import {
  allApprovedCollectivesQuery,
  allBlockedDatesQuery,
  pageSettingsSeoQuery,
  pssoundFilesQuery,
} from '@/sanity/lib/queries'

export async function generateMetadata() {
  const {data: settings} = await sanityFetch({
    query: pageSettingsSeoQuery,
    params: {id: 'pssound-request-pageSettings'},
    stega: false,
  })

  return buildPageMetadata({
    title: settings?.title || 'Request PSƧOUND System',
    description: settings?.description,
    seo: settings?.seo,
    path: '/pssound-system/request',
  })
}

export default async function SoundSystemRequestPage() {
  const {data} = await sanityFetch({query: allBlockedDatesQuery})
  const blockedDates: string[] = data.flatMap((item: {startDate: string; endDate: string}) => {
    if (!item.startDate || !item.endDate) return []
    return eachDayOfInterval({
      start: parseISO(item.startDate),
      end: parseISO(item.endDate),
    }).map((date) => format(date, 'yyyy-MM-dd'))
  })

  const {data: collectives} = await sanityFetch({
    query: allApprovedCollectivesQuery,
  })

  const {data: files} = await sanityFetch({
    query: pssoundFilesQuery,
  })

  return (
    <PssoundRequestPageClient bookedDates={blockedDates} collectives={collectives} files={files} />
  )
}
