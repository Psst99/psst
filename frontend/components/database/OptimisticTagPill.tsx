'use client'

import { ChevronRight } from 'lucide-react'
import { slugifyTag, getTagColors } from '@/lib/tags'
import clsx from 'clsx'

type OptimisticTagPillProps = {
  label: string
  selectedSlugs: Set<string> // current selection from optimistic state
  onToggle: (label: string) => void // callback to update optimistic state
}

export default function OptimisticTagPill({
  label,
  selectedSlugs,
  onToggle,
}: OptimisticTagPillProps) {
  const slug = slugifyTag(label)
  const isActive = selectedSlugs.has(slug)
  const { bg, fg } = getTagColors(label)

  // Default variables
  let style = {
    '--tag-bg': bg,
    '--tag-fg': fg,
    '--tag-bd': bg,
  } as React.CSSProperties

  // Selected = invert bg/fg and set border = text color
  if (isActive) {
    style = {
      '--tag-bg': 'white',
      '--tag-fg': bg,
      '--tag-bd': bg,
    } as React.CSSProperties
  }

  return (
    <button
      onClick={() => onToggle(label)}
      className={clsx(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs',
        'transition-colors',
        'bg-[var(--tag-bg)] text-[var(--tag-fg)] border-[var(--tag-bd)]',
        'hover:opacity-90'
      )}
      style={style}
      aria-pressed={isActive}
      type='button'
    >
      <span className='font-mono tracking-tight'>{label}</span>
      {isActive && <ChevronRight className='h-3 w-3' aria-hidden='true' />}
    </button>
  )
}
