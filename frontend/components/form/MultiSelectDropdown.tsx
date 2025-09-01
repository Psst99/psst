import React, { useState } from 'react'
import { Control, Controller } from 'react-hook-form'
import { IoMdClose } from 'react-icons/io'
import { getTagColors } from '@/lib/tags'
import Tag from '@/components/Tag' // Import the Tag component

interface Option {
  id: string
  label: string
  color?: string
  type?: 'category' | 'tag'
}

interface MultiSelectDropdownProps {
  name: string
  control: Control<any>
  options: Option[]
  placeholder?: string
  type?: 'category' | 'tag'
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  name,
  control,
  options,
  placeholder = 'Select options',
  type = 'tag',
}) => {
  const [isOpen, setIsOpen] = useState(false)

  // Category styling - keep your current implementation
  const renderCategoryTag = (option: Option, onRemove: () => void) => (
    <span
      key={option.id}
      className='px-1 py-0 bg-[#d3cd7f] text-[#6600ff] font-mono text-lg uppercase font-normal leading-tight flex items-center justify-center gap-x-2'
    >
      {option.label}
      <button
        type='button'
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className='text-current'
      >
        <IoMdClose className='h-3 w-3' aria-hidden='true' />
      </button>
    </span>
  )

  const renderStandardTag = (option: Option, onRemove: () => void) => {
    // Get the same colors that the Tag component uses
    const colors = getTagColors(option.label.toLowerCase())

    return (
      <div
        className='relative inline-flex items-center justify-center'
        key={option.id}
      >
        <Tag
          label={option.label}
          size='md'
          isActive={true}
          className='pr-6' // Make space for the close button
        />
        <button
          type='button'
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className='absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center'
          aria-label={`Remove ${option.label}`}
          style={{ color: colors.bd }} // Set the same text color as the tag
        >
          <IoMdClose className='h-3 w-3' aria-hidden='true' />
        </button>
      </div>
    )
  }

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

              return type === 'category'
                ? renderCategoryTag(option, handleRemove)
                : renderStandardTag(option, handleRemove)
            })}
          </div>

          {/* Dropdown */}
          {isOpen && (
            <div className='border border-gray-200 rounded-lg p-2 bg-gray-50 max-h-48 overflow-y-auto flex flex-wrap gap-2'>
              {options.map((option) => {
                const isSelected = value?.includes(option.id)

                if (type === 'category') {
                  // Category buttons
                  return (
                    <button
                      key={option.id}
                      type='button'
                      onClick={() => {
                        const newValue = isSelected
                          ? value.filter((id: string) => id !== option.id)
                          : [...(value || []), option.id]
                        onChange(newValue)
                      }}
                      className={`px-1 py-0 font-mono text-lg uppercase font-normal leading-tight flex items-center gap-2 ${
                        isSelected
                          ? 'bg-[#d3cd7f] text-[#6600ff]'
                          : 'bg-[#6600ff] text-white'
                      }`}
                    >
                      {option.label}
                      {isSelected && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation()
                            // Remove when clicked on X
                            onChange(
                              value.filter((id: string) => id !== option.id)
                            )
                          }}
                          className='text-current'
                        >
                          <IoMdClose className='h-3 w-3' aria-hidden='true' />
                        </span>
                      )}
                    </button>
                  )
                } else {
                  // Tag buttons - use Tag component for consistent styling
                  return (
                    <Tag
                      key={option.id}
                      label={option.label}
                      isActive={isSelected}
                      onClick={() => {
                        const newValue = isSelected
                          ? value.filter((id: string) => id !== option.id)
                          : [...(value || []), option.id]
                        onChange(newValue)
                      }}
                      interactive={true}
                      showCloseIcon={isSelected}
                      size='md'
                    />
                  )
                }
              })}
            </div>
          )}
        </div>
      )}
    />
  )
}
