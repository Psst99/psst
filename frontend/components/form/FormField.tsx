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
        className={`w-full rounded-xl mb-4 flex flex-col min-[83rem]:flex-row items-stretch overflow-hidden border section-border ${containerClassName}`.trim()}
      >
        <label
          className={`${bgClassName} ${fgClassName} font-mono text-center uppercase tracking-tighter text-lg min-[83rem]:text-[24px] leading-[1.05] min-[83rem]:leading-[22px] flex items-center justify-center px-6 min-[83rem]:px-8 py-0.5 min-[83rem]:py-4 flex-shrink-0 w-full min-[83rem]:w-[250px]`}
        >
          <span>{label}</span>
          {required && (
            <span className="text-base -mt-1 min-[83rem]:-mt-3 text-red-500 min-[83rem]:ml-2">
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
