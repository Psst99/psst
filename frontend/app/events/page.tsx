import { Suspense } from 'react'

import EventsSkeleton from '@/components/events/EventsSkeleton'
import EventsContentAsync from '@/components/events/EventsContentAsync'
import SectionList from '@/components/section-list'

export default function EventsPage() {
  return (
    <>
      <main>
        <EventsContentAsync />
      </main>
    </>
  )
}
