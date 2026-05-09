import {Suspense} from 'react'

import EventsSkeleton from '@/components/events/EventsSkeleton'
import EventsContentAsync from '@/components/events/EventsContentAsync'
import SectionList from '@/components/section-list'
import {buildPageMetadata} from '@/lib/seo'
import {sanityFetch} from '@/sanity/lib/live'
import {pageSettingsSeoQuery} from '@/sanity/lib/queries'
import Loading from './loading'

export async function generateMetadata() {
  const {data: settings} = await sanityFetch({
    query: pageSettingsSeoQuery,
    params: {id: 'events-pageSettings'},
    stega: false,
  })

  return buildPageMetadata({
    title: settings?.title || 'Events',
    description: settings?.description,
    seo: settings?.seo,
    path: '/events',
  })
}

export default function EventsPage() {
  return (
    <>
      <main>
        {/* <Loading /> */}
        <EventsContentAsync />
      </main>
    </>
  )
}
