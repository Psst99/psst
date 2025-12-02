import React, { useState } from 'react'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  options: { id: string; label: string }[]
  placeholder?: string
}

export const TagInput: React.FC<TagInputProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Type or select tags...',
}) => {
  const [input, setInput] = useState('')

  // Filter options based on input and exclude already selected
  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(input.toLowerCase()) &&
      !value.includes(opt.label)
  )

  const handleAddTag = (tag: string) => {
    if (!tag.trim() || value.includes(tag)) return
    onChange([...value, tag])
    setInput('')
  }

  const handleRemoveTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag))
  }

  return (
    <div>
      <div className='flex flex-wrap gap-2 mb-2'>
        {value.map((tag) => (
          <span
            key={tag}
            className='inline-flex items-center rounded-full border px-3 py-1 text-xs bg-[#A20018] text-[#00FFDD]'
          >
            {tag}
            <button
              type='button'
              className='ml-2 text-[#00FFDD]'
              onClick={() => handleRemoveTag(tag)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type='text'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && input.trim()) {
            handleAddTag(input.trim())
            e.preventDefault()
          }
        }}
        placeholder={placeholder}
        className='w-full border rounded px-3 py-2 mb-2'
      />
      {input && (
        <div className='flex flex-wrap gap-2'>
          {filteredOptions.map((opt) => (
            <button
              key={opt.id}
              type='button'
              className='bg-[#6600ff] text-white px-2 py-1 rounded'
              onClick={() => handleAddTag(opt.label)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
