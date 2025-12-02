'use client'

import {useState, useMemo} from 'react'
import {useRouter} from 'next/navigation'
import WorkshopsFilter from './WorkshopsFilter'
import Tag from '../Tag'

interface Workshop {
  _id: string
  title: string
  dates: string[]
  dateObj: Date | null
  tags: any[]
  isUpcoming: boolean
  slug?: string
}

interface WorkshopsGridProps {
  workshops: Workshop[]
}

export default function WorkshopsGrid({workshops}: WorkshopsGridProps) {
  const router = useRouter()
  // Change to array to allow multiple selections
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const filteredWorkshops = useMemo(() => {
    if (activeFilters.length === 0) return workshops // Show all if no filters selected

    return workshops.filter((workshop) => {
      // Include workshop if it matches any selected filter
      if (activeFilters.includes('upcoming') && workshop.isUpcoming) return true
      if (activeFilters.includes('past') && !workshop.isUpcoming) return true
      return false
    })
  }, [workshops, activeFilters])

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => {
      // If the clicked filter is already active, deselect it (empty array)
      if (prev.includes(filter)) {
        return []
      }
      // Otherwise, select only this filter (replace any existing selection)
      return [filter]
    })
  }

  const handleWorkshopClick = (workshop: Workshop) => {
    // if (workshop.isUpcoming) {
    //   router.push(`/workshops/register/${workshop.slug || workshop._id}`)
    // } else {
    //   router.push(`/workshops/${workshop.slug || workshop._id}`)
    // }
    // Always go to detail page (modal) for both upcoming and past workshops
    router.push(`/workshops/${workshop.slug || workshop._id}`)
  }

  return (
    <>
      <WorkshopsFilter activeFilters={activeFilters} onFilterToggle={toggleFilter} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mx-auto">
        {filteredWorkshops.map((item) => (
          <div
            key={item._id}
            onClick={() => handleWorkshopClick(item)}
            className={`
              p-4 sm:p-2 sm:px-4 rounded-lg cursor-pointer transition-all relative overflow-hidden
              ${
                item.isUpcoming
                  ? 'animated-gradient-bg shadow-md hover:shadow-lg border'
                  : 'bg-white hover:shadow-md'
              }
            `}
          >
            <div className={`${item.isUpcoming ? 'relative z-10' : ''}`}>
              <h2
                className={`text-4xl md:text-3xl mb-2 ${item.isUpcoming ? 'text-[#D2D2D2]' : 'text-[#f50806]'} capitalize`}
              >
                {item.title}
              </h2>

              {item.dates && item.dates.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.dates.map((date, idx) => (
                    <span
                      key={idx}
                      className={`mt-1 px-1 py-0 text-sm font-mono 
                        ${item.isUpcoming ? 'bg-[#D2D2D2]' : 'bg-[#D2D2D2]'}
                      `}
                    >
                      {date}
                    </span>
                  ))}
                </div>
              )}

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.tags.map(
                    (tag: any, tagIdx: number) =>
                      tag &&
                      tag.title && (
                        <Tag
                          key={tag._id || tagIdx}
                          label={tag.title}
                          size="sm"
                          className={`block w-fit ${item.isUpcoming ? 'bg-white/90' : ''}`}
                        />
                      ),
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CSS for animated gradient */}
      <style jsx global>{`
        .animated-gradient-bg {
          background: linear-gradient(-45deg, #fe93e7, #f50806);
          background-size: 400% 400%;
          animation: gradient 5s ease infinite;
        }

        @keyframes gradient {
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
