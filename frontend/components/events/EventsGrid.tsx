'use client'

import { useState, useMemo } from 'react'
import EventsFilter from './EventsFilter'
import Tag from '../Tag'

interface Event {
  title: string
  date?: string
  dateObj: Date | null
  tags: any[]
}

interface EventsGridProps {
  events: Event[]
}

export default function EventsGrid({ events }: EventsGridProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past'>(
    'all'
  )

  const filteredEvents = useMemo(() => {
    if (activeFilter === 'all') return events

    const now = new Date()

    return events.filter((event) => {
      if (!event.dateObj) return activeFilter === 'past' // Events without dates go to past

      if (activeFilter === 'upcoming') {
        return event.dateObj >= now
      } else {
        return event.dateObj < now
      }
    })
  }, [events, activeFilter])

  return (
    <>
      <EventsFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full mx-auto'>
        {filteredEvents.map((item, idx) => (
          <div key={idx} className='bg-white p-4 sm:p-2 sm:px-4 rounded-lg'>
            <h2 className='text-4xl md:text-3xl mb-2 text-[#4E4E4E]'>
              {item.title}
            </h2>
            {item.date && (
              <span className='mt-1 bg-[#4E4E4E] text-white px-1 py-0 text-sm font-mono block w-fit'>
                {item.date}
              </span>
            )}
            {item.tags && item.tags.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-3'>
                {item.tags.map(
                  (tag: any, tagIdx: number) =>
                    tag &&
                    tag.title && (
                      <Tag
                        key={tag._id || tagIdx}
                        label={tag.title}
                        size='sm'
                        className='block w-fit'
                      />
                    )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
