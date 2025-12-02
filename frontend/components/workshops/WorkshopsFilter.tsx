'use client'

interface WorkshopsFilterProps {
  activeFilters: string[]
  onFilterToggle: (filter: string) => void
}

export default function WorkshopsFilter({
  activeFilters,
  onFilterToggle,
}: WorkshopsFilterProps) {
  return (
    <div className='flex gap-1 mb-4 justify-center mt-16'>
      <button
        onClick={() => onFilterToggle('upcoming')}
        className={`px-2 py-0 rounded-sm border border-[#f50806] transition-colors ${
          activeFilters.includes('upcoming')
            ? 'bg-[#f50806] text-white'
            : 'bg-white text-[#f50806] hover:bg-[#f50806] hover:text-white'
        }`}
      >
        Upcoming
      </button>
      <button
        onClick={() => onFilterToggle('past')}
        className={`px-2 py-0 rounded-sm border border-[#f50806] transition-colors ${
          activeFilters.includes('past')
            ? 'bg-[#f50806] text-white'
            : 'bg-white text-[#f50806] hover:bg-[#f50806] hover:text-white'
        }`}
      >
        Past
      </button>
    </div>
  )
}
