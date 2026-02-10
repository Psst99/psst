import React from 'react'
import {UseFormRegisterReturn} from 'react-hook-form'

interface TextInputProps {
  registration: UseFormRegisterReturn
  type?: 'text' | 'email' | 'url' | 'tel'
  placeholder?: string
  isTextArea?: boolean
  rows?: number
  disabled?: boolean
}

export const TextInput: React.FC<TextInputProps> = ({
  registration,
  type = 'text',
  placeholder,
  isTextArea = false,
  rows = 4,
  disabled = false,
}) => {
  const baseClasses =
    'w-full text-[color:var(--section-fg)] px-4 py-3 text-2xl md:text-3xl border-0 outline-0 bg-white'

  if (isTextArea) {
    return (
      <textarea
        {...registration}
        rows={rows}
        className={`${baseClasses} resize-none`}
        placeholder={placeholder}
        disabled={disabled}
      />
    )
  }

  return (
    <input
      {...registration}
      type={type}
      className={baseClasses}
      placeholder={placeholder}
      disabled={disabled}
    />
  )
}
