'use client'

import { getTagColors, getActiveTagColors } from '@/lib/tags'
import { IoMdClose } from 'react-icons/io'
import clsx from 'clsx'

type TagProps = {
  label: string
  isActive?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  showCloseIcon?: boolean
  className?: string
}

export default function Tag({
  label,
  isActive = false,
  onClick,
  size = 'md',
  interactive = false,
  showCloseIcon = false,
  className = '',
}: TagProps) {
  // Get appropriate colors based on active state
  const colors = isActive ? getActiveTagColors(label) : getTagColors(label)

  // Set base style
  const style = {
    '--tag-bg': colors.bg,
    '--tag-fg': colors.fg,
    '--tag-bd': colors.bd,
  } as React.CSSProperties

  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-0.5',
    lg: 'text-base px-3 py-1',
  }

  // If this is a button or just a display tag
  const TagElement = onClick || interactive ? 'button' : 'span'

  return (
    <TagElement
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-1 rounded-full border',
        'font-mono lowercase',
        'bg-[var(--tag-bg)] text-[var(--tag-fg)] border-[var(--tag-bd)]',
        sizeClasses[size],
        interactive && 'hover:opacity-90 transition-colors',
        className
      )}
      style={style}
      {...(interactive ? { type: 'button', 'aria-pressed': isActive } : {})}
    >
      {label}
      {isActive && showCloseIcon && (
        <IoMdClose className='h-3 w-3' aria-hidden='true' />
      )}
    </TagElement>
  )
}
