'use client'

interface EventsFilterProps {
  activeFilters: string[]
  onFilterToggle: (filter: string) => void
}

export default function EventsFilter({
  activeFilters,
  onFilterToggle,
}: EventsFilterProps) {
  return (
    <div className='flex gap-1 mb-4 justify-center mt-16'>
      <button
        onClick={() => onFilterToggle('upcoming')}
        className={`px-2 py-0 rounded-sm border border-[#4E4E4E] transition-colors ${
          activeFilters.includes('upcoming')
            ? 'bg-[#4E4E4E] text-white'
            : 'bg-white text-[#4E4E4E] hover:bg-[#4E4E4E] hover:text-white'
        }`}
      >
        Upcoming
      </button>
      <button
        onClick={() => onFilterToggle('past')}
        className={`px-2 py-0 rounded-sm border border-[#4E4E4E] transition-colors ${
          activeFilters.includes('past')
            ? 'bg-[#4E4E4E] text-white'
            : 'bg-white text-[#4E4E4E] hover:bg-[#4E4E4E] hover:text-white'
        }`}
      >
        Past
      </button>
    </div>
  )
}
