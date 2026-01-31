'use client'

import {useState, useMemo} from 'react'
import {useRouter} from 'next/navigation'
import WorkshopsFilter from './WorkshopsFilter'
import Tag from '../Tag'
import WorkshopModalSkeleton from './WorkshopModalSkeleton'

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
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [pendingWorkshopSlug, setPendingWorkshopSlug] = useState<string | null>(null)

  const filteredWorkshops = useMemo(() => {
    if (activeFilters.length === 0) return workshops

    return workshops.filter((workshop) => {
      if (activeFilters.includes('upcoming') && workshop.isUpcoming) return true
      if (activeFilters.includes('past') && !workshop.isUpcoming) return true
      return false
    })
  }, [workshops, activeFilters])

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => {
      if (prev.includes(filter)) {
        return []
      }
      return [filter]
    })
  }

  const handleWorkshopHover = (workshop: Workshop) => {
    // Prefetch on hover for instant feel
    router.prefetch(`/workshops/w/${workshop.slug || workshop._id}`)
  }

  const handleWorkshopClick = (workshop: Workshop) => {
    const slug = workshop.slug || workshop._id
    // Show optimistic modal immediately
    setPendingWorkshopSlug(slug)
    // Then navigate
    router.push(`/workshops/w/${slug}`)
    // Clear pending after navigation starts
    setTimeout(() => setPendingWorkshopSlug(null), 100)
  }

  // Helper to format date range
  const formatDateRange = (dates: string[]) => {
    if (!dates || dates.length === 0) return null

    // Parse all dates
    const parsedDates = dates.map((d) => new Date(d)).sort((a, b) => a.getTime() - b.getTime())
    const firstDate = parsedDates[0]
    const lastDate = parsedDates[parsedDates.length - 1]

    const formatOptions: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }

    if (dates.length === 1) {
      return firstDate.toLocaleDateString('en-US', formatOptions)
    }

    return `From ${firstDate.toLocaleDateString('en-US', formatOptions)} to ${lastDate.toLocaleDateString('en-US', formatOptions)}`
  }

  // Show message when filtering for upcoming but there are none
  const showEmptyUpcoming = activeFilters.includes('upcoming') && filteredWorkshops.length === 0

  return (
    <>
      <WorkshopsFilter activeFilters={activeFilters} onFilterToggle={toggleFilter} />

      {showEmptyUpcoming && (
        <div className="text-center py-16">
          <p className="text-base leading-tight min-[83rem]:text-xl text-[#F50806]">
            {`There's no upcoming workshops at the moment, keep an eye on this page and our socials
            for future opportunities.`}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mx-auto">
        {filteredWorkshops.map((item) => (
          <div
            key={item._id}
            onMouseEnter={() => handleWorkshopHover(item)}
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
                <div className="mb-2">
                  <span
                    className={`mt-1 px-2 py-1 text-sm font-mono inline-block
                      ${item.isUpcoming ? 'bg-[#D2D2D2] text-[#f50806]' : 'bg-[#D2D2D2] text-[#f50806]'}
                    `}
                  >
                    {formatDateRange(item.dates)}
                  </span>
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

      {/* Show optimistic modal skeleton while pending */}
      {pendingWorkshopSlug && <WorkshopModalSkeleton />}

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
