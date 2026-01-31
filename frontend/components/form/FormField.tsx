import React from 'react'
import {DeepMap, FieldError, FieldValues} from 'react-hook-form'

interface FormFieldProps {
  label: string
  error?: FieldError | DeepMap<FieldValues, FieldError> | undefined
  children: React.ReactNode
  required?: boolean
  showError?: boolean
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  children,
  required,
  showError = false,
}) => {
  return (
    <>
      <div className="w-full rounded-xl mb-4 flex items-stretch overflow-hidden border section-border">
        <label className="section-bg section-fg font-mono text-center uppercase tracking-tighter text-[24px] leading-[22px] flex items-center justify-center px-8 py-4 flex-shrink-0 w-[250px]">
          <span>{label}</span>
          {required && <span className="text-base -mt-3 text-red-500 ml-2">*</span>}
        </label>
        <div className="flex-1 bg-white">{children}</div>
      </div>

      {showError && error && (
        <p className="panel-fg text-lg -mt-2 tracking-tight mb-8 ml-2">
          <span className="mr-0.5 text-red-500">*</span>
          {error.message}
        </p>
      )}
    </>
  )
}
