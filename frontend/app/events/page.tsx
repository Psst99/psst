import { Suspense } from 'react'

import EventsSkeleton from '@/components/events/EventsSkeleton'
import EventsContentAsync from '@/components/events/EventsContentAsync'
import SectionList from '@/components/section-list'
import Loading from './loading'

export default function EventsPage() {
  return (
    <>
      <main>
        <Loading />
        <EventsContentAsync />
      </main>
    </>
  )
}
