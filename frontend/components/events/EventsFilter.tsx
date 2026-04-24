'use client'

interface EventsFilterProps {
  activeFilters: string[]
  onFilterToggle: (filter: string) => void
}

export default function EventsFilter({
  activeFilters,
  onFilterToggle,
}: EventsFilterProps) {
  const buttonClassName = (filter: string) =>
    [
      'event-filter-button px-2 py-0 rounded-sm border transition-colors cursor-pointer',
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
        .event-filter-button {
          background: transparent;
          border-color: var(--panel-fg);
          color: var(--panel-fg);
        }

        .event-filter-button:hover,
        .event-filter-button.is-active {
          background: var(--panel-fg);
          border-color: var(--panel-fg);
          color: var(--panel-bg);
        }
      `}</style>
    </div>
  )
}
