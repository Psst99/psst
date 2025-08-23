'use client'

interface WorkshopsFilterProps {
  activeFilter: 'all' | 'upcoming' | 'past'
  onFilterChange: (filter: 'all' | 'upcoming' | 'past') => void
}

export default function WorkshopsFilter({
  activeFilter,
  onFilterChange,
}: WorkshopsFilterProps) {
  const filters = [
    { key: 'all' as const, label: 'All' },
    { key: 'upcoming' as const, label: 'Upcoming' },
    { key: 'past' as const, label: 'Past' },
  ]

  return (
    <div className='flex justify-center gap-1 mb-4 mt-16'>
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-2 py-0 rounded-sm transition-colors ${
            activeFilter === filter.key
              ? 'bg-[#f50806] text-white'
              : 'bg-white text-[#f50806] border border-[#f50806] hover:bg-[#f50806] hover:text-white'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
