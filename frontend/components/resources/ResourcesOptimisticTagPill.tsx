'use client'

import { slugifyTag } from '@/lib/tags'
import Tag from '@/components/Tag'

type OptimisticTagPillProps = {
  label: string
  selectedSlugs: Set<string>
  onToggle: (label: string) => void
}

export default function ResourcesOptimisticTagPill({
  label,
  selectedSlugs,
  onToggle,
}: OptimisticTagPillProps) {
  const slug = slugifyTag(label)
  const isActive = selectedSlugs.has(slug)

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
