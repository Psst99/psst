'use client'

import { slugifyTag } from '@/lib/tags'
import Tag from '@/components/Tag'

type OptimisticTagPillProps = {
  label: string
  selectedSlugs: string[] | Set<string>
  onToggle: (label: string) => void
}

export default function ResourcesOptimisticTagPill({
  label,
  selectedSlugs,
  onToggle,
}: OptimisticTagPillProps) {
  const slug = slugifyTag(label)

  // Ensure we have a Set to use has() method on
  const slugsSet =
    selectedSlugs instanceof Set ? selectedSlugs : new Set(selectedSlugs)

  const isActive = slugsSet.has(slug)

  return (
    <Tag
      label={label}
      isActive={isActive}
      onClick={() => onToggle(label)}
      interactive={true}
      showCloseIcon={isActive}
      size='sm'
    />
  )
}
