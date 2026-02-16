import React from 'react'
import {UseFormRegisterReturn} from 'react-hook-form'

interface TextInputProps {
  registration: UseFormRegisterReturn
  type?: 'text' | 'email' | 'url' | 'tel'
  placeholder?: string
  isTextArea?: boolean
  rows?: number
  disabled?: boolean
  className?: string
  inputClassName?: string
  fieldClassName?: string
}

export const TextInput: React.FC<TextInputProps> = ({
  registration,
  type = 'text',
  placeholder,
  isTextArea = false,
  rows = 4,
  disabled = false,
  className = '',
  inputClassName = '',
  fieldClassName = '',
}) => {
  const baseClasses =
    'w-full text-[color:var(--section-fg)] px-4 py-3 text-2xl md:text-3xl border-0 outline-0 bg-white'
  const mergedClassName = `${baseClasses} ${className} ${inputClassName}`.trim()

  if (isTextArea) {
    return (
      <textarea
        {...registration}
        rows={rows}
        className={`${mergedClassName} resize-none`.trim()}
        placeholder={placeholder}
        disabled={disabled}
        data-field-class={fieldClassName || undefined}
      />
    )
  }

  return (
    <input
      {...registration}
      type={type}
      className={mergedClassName}
      placeholder={placeholder}
      disabled={disabled}
      data-field-class={fieldClassName || undefined}
    />
  )
}
