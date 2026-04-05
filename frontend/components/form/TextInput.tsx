import React from 'react'
import {UseFormRegisterReturn} from 'react-hook-form'

interface TextInputProps {
  registration?: UseFormRegisterReturn
  name?: string
  value?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
  type?: 'text' | 'email' | 'url' | 'tel' | 'number'
  min?: string | number
  step?: string | number
  maxLength?: number
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
  name,
  value,
  onChange,
  onBlur,
  type = 'text',
  min,
  step,
  maxLength,
  placeholder,
  isTextArea = false,
  rows = 4,
  disabled = false,
  className = '',
  inputClassName = '',
  fieldClassName = '',
}) => {
  const baseClasses =
    'w-full text-[color:var(--section-fg)] px-4 py-3 text-xl min-[83rem]:text-3xl border-0 outline-0'
  const finalClassName = className.includes('bg-') ? className : `bg-white ${className}`
  const mergedClassName = `${baseClasses} ${finalClassName} ${inputClassName}`.trim()
  const resolvedName = registration?.name ?? name
  const resolvedOnChange = registration?.onChange ?? onChange
  const resolvedOnBlur = registration?.onBlur ?? onBlur
  const resolvedRef = registration?.ref

  if (isTextArea) {
    return (
      <textarea
        name={resolvedName}
        value={value}
        onChange={resolvedOnChange}
        onBlur={resolvedOnBlur}
        ref={resolvedRef}
        rows={rows}
        maxLength={maxLength}
        className={`${mergedClassName} resize-none`.trim()}
        placeholder={placeholder}
        disabled={disabled}
        data-field-class={fieldClassName || undefined}
      />
    )
  }

  return (
    <input
      name={resolvedName}
      value={value}
      onChange={resolvedOnChange}
      onBlur={resolvedOnBlur}
      ref={resolvedRef}
      type={type}
      min={min}
      step={step}
      maxLength={maxLength}
      className={mergedClassName}
      placeholder={placeholder}
      disabled={disabled}
      data-field-class={fieldClassName || undefined}
    />
  )
}
