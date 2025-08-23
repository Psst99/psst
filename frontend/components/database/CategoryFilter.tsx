'use client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CategoryFilter({
  category,
  isActive,
  selectedCategories,
}: {
  category: { _id: string; title: string; slug: string }
  isActive: boolean
  selectedCategories: string[]
}) {
  const router = useRouter()
  const params = useSearchParams()

  const handleClick = () => {
    let newCategories: string[]
    if (isActive) {
      newCategories = selectedCategories.filter(
        (slug) => slug !== category.slug
      )
    } else {
      newCategories = [...selectedCategories, category.slug]
    }
    const newParams = new URLSearchParams(params)
    if (newCategories.length > 0) {
      newParams.set('category', newCategories.join(','))
    } else {
      newParams.delete('category')
    }
    router.push(`?${newParams.toString()}`)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newCategories = selectedCategories.filter(
      (slug) => slug !== category.slug
    )
    const newParams = new URLSearchParams(params)
    if (newCategories.length > 0) {
      newParams.set('category', newCategories.join(','))
    } else {
      newParams.delete('category')
    }
    router.push(`?${newParams.toString()}`)
  }

  return (
    <div
      className={`px-1 py-0 cursor-pointer transition-colors uppercase flex items-center gap-1 ${
        isActive ? 'bg-[#d3cd7f] text-[#6600ff]' : 'bg-[#6600ff] text-white'
      }`}
      onClick={handleClick}
      role='button'
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter') handleClick()
      }}
    >
      {category.title}
      {isActive && (
        <span
          className='ml-1 text-lg leading-0 font-bold cursor-pointer'
          onClick={handleClear}
          role='button'
          tabIndex={-1}
          aria-label='Remove category filter'
        >
          ×
        </span>
      )}
    </div>
  )
}
