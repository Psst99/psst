'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function SearchBox({ search }: { search: string }) {
  const router = useRouter()
  const params = useSearchParams()
  const [value, setValue] = useState(search)

  useEffect(() => {
    setValue(search)
  }, [search])

  useEffect(() => {
    const timeout = setTimeout(() => {
      const newParams = new URLSearchParams(params)
      if (value) newParams.set('search', value)
      else newParams.delete('search')
      router.replace(`?${newParams.toString()}`)
    }, 250) // 250ms debounce

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input
      type='text'
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className='w-full p-1 text-center text-[#6600ff] uppercase tracking-tight md:text-xl'
      placeholder='Search'
    />
  )
}
