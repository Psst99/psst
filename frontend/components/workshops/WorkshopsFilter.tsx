'use client'

interface WorkshopsFilterProps {
  activeFilters: string[]
  onFilterToggle: (filter: string) => void
}

export default function WorkshopsFilter({activeFilters, onFilterToggle}: WorkshopsFilterProps) {
  const buttonClassName = (filter: string) =>
    [
      'workshop-filter-button px-2 py-0 rounded-sm border transition-colors cursor-pointer',
      activeFilters.includes(filter) ? 'is-active' : '',
    ].join(' ')

  return (
    <div className="flex gap-1 mb-4 justify-center mt-16">
      <button
        onClick={() => onFilterToggle('upcoming')}
        className={buttonClassName('upcoming')}
      >
        Upcoming
      </button>
      <button
        onClick={() => onFilterToggle('past')}
        className={buttonClassName('past')}
      >
        Past
      </button>

      <style jsx>{`
        .workshop-filter-button {
          background: transparent;
          border-color: var(--panel-fg);
          color: var(--panel-fg);
        }

        .workshop-filter-button:hover,
        .workshop-filter-button.is-active {
          background: var(--panel-fg);
          border-color: var(--panel-fg);
          color: var(--panel-bg);
        }
      `}</style>
    </div>
  )
}
