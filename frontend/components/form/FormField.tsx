// components/form/FormField.tsx
import React from 'react'
import { FieldError } from 'react-hook-form'

interface FormFieldProps {
  label: string
  error?: FieldError
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
}) => (
  <>
    <div className={`w-full h-full rounded-lg mb-4 md:flex ${bgClassName}`}>
      <label className='block text-white font-medium text-center uppercase font-mono md:w-[30%] px-6 py-4 flex-shrink-0'>
        <span>{label}</span>
        {required && <span className='text-red-300 ml-1'>*</span>}
      </label>
      <div className='md:w-full md:rounded-l-none md:rounded-tr-lg md:h-auto'>
        {children}
      </div>
    </div>
    {error && <p className='text-red-300 text-sm mt-1 px-4'>{error.message}</p>}
  </>
)
