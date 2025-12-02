import React, {useState} from 'react'
import {Control, Controller} from 'react-hook-form'
import {IoMdClose} from 'react-icons/io'
import {getTagColors} from '@/lib/tags'
import Tag from '@/components/Tag'

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
  allowCustom?: boolean // Set to true for tags, false for categories
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  name,
  control,
  options,
  placeholder = 'Select options',
  type = 'tag',
  allowCustom = type === 'tag', // Default to true for tags, false for categories
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  // Filter options based on search input
  const filteredOptions = searchInput.trim()
    ? options.filter((opt) => opt.label.toLowerCase().includes(searchInput.toLowerCase()))
    : options

  // Category styling - keep your current implementation
  const renderCategoryTag = (option: Option, onRemove: () => void) => (
    <span
      key={option.id}
      className="px-1 py-0 bg-[#d3cd7f] text-[#6600ff] font-mono text-lg uppercase font-normal leading-tight flex items-center justify-center gap-x-2"
    >
      {option.label}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="text-current"
      >
        <IoMdClose className="h-3 w-3" aria-hidden="true" />
      </button>
    </span>
  )

  // Tag styling
  const renderStandardTag = (option: Option, onRemove: () => void) => {
    const colors = getTagColors(option.label.toLowerCase())

    return (
      <div className="relative inline-flex items-center justify-center" key={option.id}>
        <Tag
          label={option.label}
          size="md"
          isActive={true}
          className="pr-6" // Make space for the close button
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center"
          aria-label={`Remove ${option.label}`}
          style={{color: colors.bd}}
        >
          <IoMdClose className="h-3 w-3" aria-hidden="true" />
        </button>
      </div>
    )
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({field: {value = [], onChange}}) => {
        // Create a unique ID for a custom tag if needed
        const generateCustomTagId = (label: string) =>
          `custom-${label.replace(/\s+/g, '-').toLowerCase()}`

        // Add a custom tag that doesn't exist in options
        const addCustomTag = (label: string) => {
          if (!label.trim()) return

          // Check if this tag already exists in options or selected values
          const existingOption = options.find(
            (opt) => opt.label.toLowerCase() === label.toLowerCase(),
          )

          const isAlreadySelected = value.some((id: string) => {
            const opt = options.find((o) => o.id === id)
            return opt?.label.toLowerCase() === label.toLowerCase()
          })

          if (existingOption && !isAlreadySelected) {
            // Add existing option if not already selected
            onChange([...value, existingOption.id])
          } else if (!isAlreadySelected) {
            // Create and add custom tag
            const customId = generateCustomTagId(label)
            onChange([...value, customId])
          }

          setSearchInput('')
        }

        return (
          <div className="bg-white rounded-b-lg p-4 md:w-full md:rounded-l-none md:rounded-tr-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">{placeholder}</span>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="text-[#6600ff] text-lg"
              >
                {isOpen ? '▲' : '▼'}
              </button>
            </div>

            {/* Selected Items */}
            <div className="flex flex-wrap gap-2 mb-3">
              {value.map((selectedId: string) => {
                // Handle both regular and custom tags
                const option = options.find((opt) => opt.id === selectedId)
                const isCustom = !option && selectedId.startsWith('custom-')

                if (!option && !isCustom) return null

                const customLabel = isCustom
                  ? selectedId.replace('custom-', '').replace(/-/g, ' ')
                  : ''

                const displayOption = option || {
                  id: selectedId,
                  label: customLabel,
                  type,
                }

                const handleRemove = () => {
                  onChange(value.filter((id: string) => id !== selectedId))
                }

                return type === 'category'
                  ? renderCategoryTag(displayOption, handleRemove)
                  : renderStandardTag(displayOption, handleRemove)
              })}
            </div>

            {/* Search input */}
            {isOpen && (
              <div className="mb-3">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Type to search or create tag"
                  className="w-full p-2 border border-gray-300 rounded"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchInput.trim() && allowCustom) {
                      e.preventDefault()
                      addCustomTag(searchInput.trim())
                    }
                  }}
                />
              </div>
            )}

            {/* Dropdown */}
            {isOpen && (
              <div className="border border-gray-200 rounded-lg p-2 bg-gray-50 max-h-48 overflow-y-auto">
                {/* Add custom tag option */}
                {searchInput.trim() && allowCustom && filteredOptions.length === 0 && (
                  <div className="p-2 border-b border-gray-200">
                    <button
                      type="button"
                      onClick={() => addCustomTag(searchInput.trim())}
                      className="w-full text-left text-[#6600ff] font-medium flex items-center"
                    >
                      <span className="mr-2">+</span> Create tag &quot;
                      {searchInput.trim()}&quot;
                    </button>
                  </div>
                )}

                {/* Filtered options */}
                <div className="flex flex-wrap gap-2">
                  {filteredOptions.map((option) => {
                    const isSelected = value.includes(option.id)

                    if (type === 'category') {
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            const newValue = isSelected
                              ? value.filter((id: string) => id !== option.id)
                              : [...value, option.id]
                            onChange(newValue)
                            setSearchInput('')
                          }}
                          className={`px-1 py-0 font-mono text-lg uppercase font-normal leading-tight flex items-center gap-2 ${
                            isSelected ? 'bg-[#d3cd7f] text-[#6600ff]' : 'bg-[#6600ff] text-white'
                          }`}
                        >
                          {option.label}
                          {isSelected && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation()
                                onChange(value.filter((id: string) => id !== option.id))
                              }}
                              className="text-current"
                            >
                              <IoMdClose className="h-3 w-3" aria-hidden="true" />
                            </span>
                          )}
                        </button>
                      )
                    } else {
                      return (
                        <Tag
                          key={option.id}
                          label={option.label}
                          isActive={isSelected}
                          onClick={() => {
                            const newValue = isSelected
                              ? value.filter((id: string) => id !== option.id)
                              : [...value, option.id]
                            onChange(newValue)
                            setSearchInput('')
                          }}
                          interactive={true}
                          showCloseIcon={isSelected}
                          size="md"
                        />
                      )
                    }
                  })}
                </div>
              </div>
            )}
          </div>
        )
      }}
    />
  )
}
