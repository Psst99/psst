// components/form/TextInput.tsx
import React from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

interface TextInputProps {
  registration: UseFormRegisterReturn
  type?: 'text' | 'email' | 'url' | 'tel'
  placeholder?: string
  isTextArea?: boolean
  rows?: number
  inputClassName?: string
  fieldClassName?: string
}

export const TextInput: React.FC<TextInputProps> = ({
  registration,
  type = 'text',
  placeholder,
  isTextArea = false,
  rows = 4,
  inputClassName = 'text-[#6600ff]',
  fieldClassName = 'bg-[#6600ff]',
}) => {
  const baseClasses = `w-full rounded-t-none rounded-b-lg ${inputClassName} ${fieldClassName}  px-4 py-2 text-2xl md:text-3xl border-0 outline-0 md:rounded-l-none md:rounded-tr-lg bg-white h-full`

  if (isTextArea) {
    return (
      <textarea
        {...registration}
        rows={rows}
        className={`${baseClasses} resize-none`}
        placeholder={placeholder}
      />
    )
  }

  return (
    <input
      {...registration}
      type={type}
      className={baseClasses}
      placeholder={placeholder}
    />
  )
}
