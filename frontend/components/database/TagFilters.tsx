'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import TagPill from './TagPill'

type TagDoc = { _id: string; title: string; slug?: { current?: string } }

export default function TagFilters({ tags }: { tags: TagDoc[] }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const sp = new URLSearchParams(searchParams?.toString() ?? '')
  const selected = new Set(
    (sp.get('tags') ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  )

  return (
    <div className='flex flex-wrap gap-1.5'>
      {tags.map((t) => (
        <TagPill
          key={t._id}
          label={t.title}
          pathname={pathname}
          selectedSlugs={selected}
          searchParams={sp}
        />
      ))}
    </div>
  )
}
