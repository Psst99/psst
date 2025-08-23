import React, { useState } from 'react'
import { Control, Controller } from 'react-hook-form'

interface Option {
  id: string
  label: string
  color: string
}

interface MultiSelectDropdownProps {
  name: string
  control: Control<any>
  options: Option[]
  placeholder?: string
  renderTag?: (option: Option, onRemove: () => void) => React.ReactNode
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  name,
  control,
  options,
  placeholder = 'Select options',
  renderTag,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const defaultRenderTag = (option: Option, onRemove: () => void) => (
    <span
      key={option.id}
      className={`${option.color} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2`}
    >
      {option.label}
      <button
        type='button'
        onClick={onRemove}
        className='text-current hover:opacity-70'
      >
        ×
      </button>
    </span>
  )

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <div className='bg-white rounded-b-lg p-4 md:w-full md:rounded-l-none md:rounded-tr-lg'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-gray-600'>{placeholder}</span>
            <button
              type='button'
              onClick={() => setIsOpen(!isOpen)}
              className='text-[#6600ff] text-lg'
            >
              {isOpen ? '▲' : '▼'}
            </button>
          </div>

          {/* Selected Items */}
          <div className='flex flex-wrap gap-2 mb-3'>
            {value?.map((selectedId: string) => {
              const option = options.find((opt) => opt.id === selectedId)
              if (!option) return null

              const handleRemove = () => {
                onChange(value.filter((id: string) => id !== selectedId))
              }

              return (renderTag || defaultRenderTag)(option, handleRemove)
            })}
          </div>

          {/* Dropdown */}
          {isOpen && (
            <div className='border border-gray-200 rounded-lg p-2 bg-gray-50 max-h-48 overflow-y-auto'>
              {options.map((option) => (
                <button
                  key={option.id}
                  type='button'
                  onClick={() => {
                    const newValue = value?.includes(option.id)
                      ? value.filter((id: string) => id !== option.id)
                      : [...(value || []), option.id]
                    onChange(newValue)
                  }}
                  className={`w-full text-left p-2 rounded hover:bg-gray-100 ${
                    value?.includes(option.id) ? 'bg-gray-200 font-medium' : ''
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    />
  )
}
