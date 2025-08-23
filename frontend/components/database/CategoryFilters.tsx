import CategoryFilter from './CategoryFilter'

export default function CategoryFilters({
  categories,
  category,
}: {
  categories: Array<{ _id: string; title: string; slug: string }>
  category: string
}) {
  const selectedCategories = category
    ? category
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : []

  return (
    <div className='flex flex-wrap gap-1.5 font-mono text-lg uppercase font-light leading-tight'>
      {categories.map((cat) => (
        <CategoryFilter
          key={cat._id}
          category={cat}
          isActive={selectedCategories.includes(cat.slug)}
          selectedCategories={selectedCategories}
        />
      ))}
    </div>
  )
}
