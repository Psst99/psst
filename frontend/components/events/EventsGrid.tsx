'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import EventsFilter from './EventsFilter'
import Tag from '../Tag'

interface Event {
  _id: string
  title: string
  date?: string
  dateObj: Date | null
  isUpcoming: boolean
  slug?: string
  tags: any[]
}

interface EventsGridProps {
  events: Event[]
}

export default function EventsGrid({ events }: EventsGridProps) {
  const router = useRouter()
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const filteredEvents = useMemo(() => {
    if (activeFilters.length === 0) return events // Show all if no filters selected

    return events.filter((event) => {
      // Include event if it matches any selected filter
      if (activeFilters.includes('upcoming') && event.isUpcoming) return true
      if (activeFilters.includes('past') && !event.isUpcoming) return true
      return false
    })
  }, [events, activeFilters])

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => {
      // If the clicked filter is already active, deselect it
      if (prev.includes(filter)) {
        return []
      }
      // Otherwise, select only this filter
      return [filter]
    })
  }

  const handleEventClick = (event: Event) => {
    if (!event.slug) {
      console.error('Event missing slug:', event)
      return
    }

    router.push(`/events/${event.slug}`)
  }

  return (
    <>
      <EventsFilter
        activeFilters={activeFilters}
        onFilterToggle={toggleFilter}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full mx-auto'>
        {filteredEvents.map((item) => (
          <div
            key={item._id}
            onClick={() => handleEventClick(item)}
            className={`p-4 sm:p-2 sm:px-4 rounded-lg cursor-pointer transition-all relative overflow-hidden
              ${
                item.isUpcoming
                  ? 'animated-gradient-bg shadow-md hover:shadow-lg border'
                  : 'bg-white hover:shadow-md'
              }`}
          >
            <h2 className='text-4xl md:text-3xl mb-2 text-[#4E4E4E] capitalize'>
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

      {/* CSS for animated border */}
      <style jsx global>{`
        .animated-gradient-bg {
          background: linear-gradient(135deg, #fff 0%, #d2d2d2 50%, #fff 100%);
          background-size: 200% 200%;
          animation: gradientMove 4s ease-in-out infinite;
        }

        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </>
  )
}
