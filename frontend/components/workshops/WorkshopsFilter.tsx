'use client'

interface WorkshopsFilterProps {
  activeFilters: string[]
  onFilterToggle: (filter: string) => void
}

export default function WorkshopsFilter({activeFilters, onFilterToggle}: WorkshopsFilterProps) {
  return (
    <div className="flex gap-1 mb-4 justify-center mt-16">
      <button
        onClick={() => onFilterToggle('upcoming')}
        className={`px-2 py-0 rounded-sm border section-border transition-colors cursor-pointer ${
          activeFilters.includes('upcoming')
            ? 'tab-active'
            : 'tab-inactive hover:[background-color:var(--section-fg)] hover:[color:var(--section-bg)]'
        }`}
      >
        Upcoming
      </button>
      <button
        onClick={() => onFilterToggle('past')}
        className={`px-2 py-0 rounded-sm border section-border transition-colors cursor-pointer ${
          activeFilters.includes('past')
            ? 'tab-active'
            : 'tab-inactive hover:[background-color:var(--section-fg)] hover:[color:var(--section-bg)]'
        }`}
      >
        Past
      </button>
    </div>
  )
}
