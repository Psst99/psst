'use client'
import { useRouter, useSearchParams } from 'next/navigation'

const SORTS = [
  { key: 'alpha', label: 'Alphabetically' },
  { key: 'chrono', label: 'Chronologically' },
  { key: 'random', label: 'Randomly' },
]

export default function SortFilters({ sort }: { sort: string }) {
  const router = useRouter()
  const params = useSearchParams()

  const setSort = (key: string) => {
    const newParams = new URLSearchParams(params)
    newParams.set('sort', key)
    router.push(`?${newParams.toString()}`)
  }

  return (
    <div className='bg-white py-1 pb-3 px-6 rounded-md'>
      <div className='text-center text-[#6600ff] uppercase tracking-tight md:text-xl mb-2'>
        Sort
      </div>
      <div className='space-y-2 text-lg'>
        {SORTS.map((s) => (
          <button
            key={s.key}
            className={`w-full border border-[#6600ff] p-0 rounded-md ${
              sort === s.key ? 'bg-[#6600ff] text-white' : 'text-[#6600ff]'
            }`}
            onClick={() => setSort(s.key)}
            type='button'
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
