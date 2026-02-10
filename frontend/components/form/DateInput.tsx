import React from 'react'

type DateInputProps = {
  value?: string
  onClick?: () => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const DateInput = React.forwardRef<HTMLButtonElement, DateInputProps>(
  ({value, onClick, placeholder, disabled, className}, ref) => {
    const hasValue = !!(value && value.trim())

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={[
          // match your field shape
          'w-full h-full min-h-[88px]',
          'px-4',
          'bg-white section-fg',
          'rounded-t-none rounded-b-lg md:rounded-l-none md:rounded-tr-lg',
          'border-0 outline-none',
          // ✅ vertical + horizontal alignment
          'flex items-center justify-start',
          // polish
          'cursor-pointer disabled:opacity-50',
          className || '',
        ].join(' ')}
      >
        <span className={['text-2xl', hasValue ? '' : 'opacity-50'].join(' ')}>
          {hasValue ? value : placeholder}
        </span>
      </button>
    )
  },
)

DateInput.displayName = 'DateInput'
