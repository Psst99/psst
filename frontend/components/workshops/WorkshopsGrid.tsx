'use client'

import { useState, useMemo } from 'react'
import WorkshopsFilter from './WorkshopsFilter'
import Tag from '../Tag'

interface Workshop {
  title: string
  date?: string
  dateObj: Date | null
  tags: any[]
}

interface WorkshopsGridProps {
  workshops: Workshop[]
}

export default function WorkshopsGrid({ workshops }: WorkshopsGridProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past'>(
    'all'
  )

  const filteredWorkshops = useMemo(() => {
    if (activeFilter === 'all') return workshops

    const now = new Date()

    return workshops.filter((workshop) => {
      if (!workshop.dateObj) return activeFilter === 'past' // Workshops without dates go to past

      if (activeFilter === 'upcoming') {
        return workshop.dateObj >= now
      } else {
        return workshop.dateObj < now
      }
    })
  }, [workshops, activeFilter])

  return (
    <>
      <WorkshopsFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full mx-auto'>
        {filteredWorkshops.map((item, idx) => (
          <div key={idx} className='bg-white p-4 sm:p-2 sm:px-4 rounded-lg'>
            <h2 className='text-4xl md:text-3xl mb-2 text-[#f50806] capitalize'>
              {item.title}
            </h2>
            {item.date && (
              <span className='mt-1 bg-[#f50806] text-white px-1 py-0 text-sm font-mono block w-fit'>
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
