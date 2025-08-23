'use client'

interface EventsFilterProps {
  activeFilter: 'all' | 'upcoming' | 'past'
  onFilterChange: (filter: 'all' | 'upcoming' | 'past') => void
}

export default function EventsFilter({
  activeFilter,
  onFilterChange,
}: EventsFilterProps) {
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
              ? 'bg-[#4E4E4E] text-white'
              : 'bg-white text-[#4E4E4E] border border-[#4E4E4E] hover:bg-[#4E4E4E] hover:text-white'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
