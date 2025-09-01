// components/form/FormField.tsx
import React from 'react'
import { DeepMap, FieldError, FieldValues } from 'react-hook-form'

interface FormFieldProps {
  label: string
  error?: FieldError | DeepMap<FieldValues, FieldError> | undefined
  children: React.ReactNode
  required?: boolean
  bgClassName?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  children,
  required,
  bgClassName = '',
}) => {
  const extractColor = (className: string) => {
    const match = className.match(/bg-\[([^\]]+)\]/)
    return match ? match[1] : '#ff0000' // Default to red if no match
  }

  const errorColor = extractColor(bgClassName)

  return (
    <>
      <div className={`w-full h-full rounded-xl mb-4 md:flex ${bgClassName}`}>
        <label className='block text-white font-medium text-center uppercase font-mono md:w-[30%] px-6 py-0 xl:py-4 flex-shrink-0'>
          <span>{label}</span>
          {required && <span className='text-red-300 ml-1'>*</span>}
        </label>
        <div className='md:w-full md:rounded-l-none md:rounded-tr-lg md:h-auto'>
          {children}
        </div>
      </div>
      {error && (
        <p style={{ color: errorColor }} className={` text-xs -mt-2 italic`}>
          <span className='mr-0.5'>*</span>
          {error.message}
        </p>
      )}
    </>
  )
}
