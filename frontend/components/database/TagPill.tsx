'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { slugifyTag, getTagColors } from '@/lib/tags'
import clsx from 'clsx'

type TagPillProps = {
  label: string
  pathname: string // current pathname (e.g. "/database")
  selectedSlugs: Set<string> // current selection from URL
  searchParams: URLSearchParams
}

export default function TagPill({
  label,
  pathname,
  selectedSlugs,
  searchParams,
}: TagPillProps) {
  const slug = slugifyTag(label)
  const isActive = selectedSlugs.has(slug)
  const { bg, fg } = getTagColors(label)

  // Build next URL with toggle
  const next = new URLSearchParams(searchParams.toString())
  const current = new Set(
    (next.get('tags') ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  )
  if (current.has(slug)) current.delete(slug)
  else current.add(slug)

  if (current.size) next.set('tags', Array.from(current).join(','))
  else next.delete('tags')

  const href = `${pathname}${next.toString() ? `?${next}` : ''}`

  // Default variables
  let style = {
    // @ts-ignore CSS vars
    '--tag-bg': bg,
    '--tag-fg': fg,
    '--tag-bd': bg,
  } as React.CSSProperties

  // Selected = invert bg/fg and set border = text color
  if (isActive) {
    style = {
      '--tag-bg': fg,
      '--tag-fg': bg,
      '--tag-bd': fg,
    } as React.CSSProperties
  }

  return (
    <Link
      href={href}
      prefetch={false}
      className={clsx(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs',
        'transition-colors',
        'bg-[var(--tag-bg)] text-[var(--tag-fg)] border-[var(--tag-bd)]',
        'hover:opacity-90'
      )}
      style={style}
      aria-pressed={isActive}
    >
      <span className='uppercase font-mono tracking-tight'>{label}</span>
      {isActive && <ChevronRight className='h-3 w-3' aria-hidden='true' />}
    </Link>
  )
}
