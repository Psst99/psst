import React from 'react'
import {DeepMap, FieldError, FieldValues} from 'react-hook-form'

interface FormFieldProps {
  label: string
  error?: FieldError | DeepMap<FieldValues, FieldError> | undefined
  children: React.ReactNode
  required?: boolean
  showError?: boolean
  bgClassName?: string
  fgClassName?: string
  containerClassName?: string
  contentClassName?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  children,
  required,
  showError = false,
  bgClassName = 'section-bg',
  fgClassName = 'section-fg',
  containerClassName = '',
  contentClassName = 'bg-white',
}) => {
  return (
    <>
      <div
        className={`w-full rounded-xl mb-4 flex flex-col min-[69.375rem]:flex-row items-stretch overflow-hidden border section-border ${containerClassName}`.trim()}
      >
        <label
          className={`${bgClassName} ${fgClassName} font-mono text-center uppercase tracking-tighter text-lg min-[69.375rem]:text-[24px] leading-[1.05] min-[69.375rem]:leading-[22px] flex items-center justify-center px-6 min-[69.375rem]:px-8 py-0.5 min-[69.375rem]:py-4 flex-shrink-0 w-full min-[69.375rem]:w-[250px]`}
        >
          <span>{label}</span>
          {required && (
            <span className="text-base -mt-1 min-[69.375rem]:-mt-3 text-red-500 min-[69.375rem]:ml-2">
              *
            </span>
          )}
        </label>
        <div className={`flex-1 ${contentClassName}`.trim()}>{children}</div>
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
