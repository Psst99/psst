import React, {useEffect, useMemo, useRef, useState} from 'react'
import {Control, useController} from 'react-hook-form'
import {IoMdClose} from 'react-icons/io'
import {motion, AnimatePresence} from 'framer-motion'
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
  allowCustom?: boolean
}

const panelVariants = {
  closed: {opacity: 0, scaleY: 0.98, y: -4},
  open: {opacity: 1, scaleY: 1, y: 0},
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  name,
  control,
  options,
  placeholder = 'Select options',
  type = 'tag',
  allowCustom = type === 'tag',
}) => {
  const {
    field: {value = [], onChange, onBlur},
  } = useController({name, control})

  const [isOpen, setIsOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  const rootRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const filteredOptions = useMemo(() => {
    const q = searchInput.trim().toLowerCase()
    if (!q) return options
    return options.filter((opt) => opt.label.toLowerCase().includes(q))
  }, [options, searchInput])

  const close = () => {
    setIsOpen(false)
    setSearchInput('')
    onBlur() // mark touched
  }

  // Outside click + Escape close
  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (e: PointerEvent) => {
      const root = rootRef.current
      if (!root) return
      if (!root.contains(e.target as Node)) close()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Focus the trigger-input when opened
  useEffect(() => {
    if (!isOpen) return
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [isOpen])

  const generateCustomTagId = (label: string) =>
    `custom-${label.replace(/\s+/g, '-').toLowerCase()}`

  const addCustomTag = (label: string) => {
    const trimmed = label.trim()
    if (!trimmed) return

    const existingOption = options.find((opt) => opt.label.toLowerCase() === trimmed.toLowerCase())

    const isAlreadySelected = value.some((id: string) => {
      const opt = options.find((o) => o.id === id)
      if (opt) return opt.label.toLowerCase() === trimmed.toLowerCase()
      if (id.startsWith('custom-'))
        return id.replace('custom-', '').replace(/-/g, ' ').toLowerCase() === trimmed.toLowerCase()
      return false
    })

    if (existingOption && !isAlreadySelected) {
      onChange([...value, existingOption.id])
    } else if (!existingOption && !isAlreadySelected) {
      onChange([...value, generateCustomTagId(trimmed)])
    }

    setSearchInput('')
  }

  const renderCategoryTag = (option: Option, onRemove: () => void) => (
    <span
      key={option.id}
      className="px-1 py-0 bg-[var(--section-bg)] text-[color:var(--section-fg)] font-mono text-lg uppercase font-normal leading-tight inline-flex items-center gap-x-2"
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

  const renderStandardTag = (
    option: Option,
    onRemove: () => void,
    active = true,
    closeColor: 'bd' | 'fg' = 'bd',
  ) => {
    const colors = getTagColors(option.label.toLowerCase())

    return (
      <div className="relative inline-flex items-center justify-center" key={option.id}>
        <Tag label={option.label} size="md" isActive={active} className="pr-6" />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onRemove()
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center"
          aria-label={`Remove ${option.label}`}
          style={{color: closeColor === 'fg' ? colors.fg : colors.bd}}
        >
          <IoMdClose className="h-3 w-3" aria-hidden="true" />
        </button>
      </div>
    )
  }

  const selectedTagOptions = useMemo(() => {
    // Preserve selection order as stored in `value`
    return value
      .map((selectedId: string) => {
        const option = options.find((opt) => opt.id === selectedId)
        const isCustom = !option && selectedId.startsWith('custom-')
        if (!option && !isCustom) return null

        const customLabel = isCustom ? selectedId.replace('custom-', '').replace(/-/g, ' ') : ''
        const displayOption = option || {id: selectedId, label: customLabel, type: 'tag' as const}
        return displayOption
      })
      .filter(Boolean) as Option[]
  }, [value, options])

  return (
    <div ref={rootRef} className="bg-white p-4">
      {/* Header: collapsed preview OR open search */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          {!isOpen ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                setIsOpen(true)
                requestAnimationFrame(() => inputRef.current?.focus())
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setIsOpen(true)
                  requestAnimationFrame(() => inputRef.current?.focus())
                }
              }}
              className={['w-full text-left bg-transparent', 'py-2', 'cursor-pointer'].join(' ')}
            >
              {value.length === 0 ? (
                <span className="font-normal text-2xl md:text-3xl text-[color:var(--section-bg)] opacity-60">
                  {placeholder}
                </span>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {value.map((selectedId: string) => {
                    const option = options.find((opt) => opt.id === selectedId)
                    const isCustom = !option && selectedId.startsWith('custom-')
                    if (!option && !isCustom) return null

                    const customLabel = isCustom
                      ? selectedId.replace('custom-', '').replace(/-/g, ' ')
                      : ''

                    const displayOption = option || {id: selectedId, label: customLabel, type}

                    const handleRemove = (e: React.MouseEvent) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onChange(value.filter((id: string) => id !== selectedId))
                    }

                    // NOTE: for categories you want category-style chips
                    if (type === 'category') {
                      return (
                        <span
                          key={displayOption.id}
                          className="px-1 py-0 bg-[var(--section-bg)] text-[color:var(--section-fg)] font-mono text-2xl md:text-3xl uppercase font-light leading-tight inline-flex items-center gap-x-2"
                        >
                          {displayOption.label}
                          <button type="button" onClick={handleRemove} className="text-current">
                            <IoMdClose className="h-3 w-3" aria-hidden="true" />
                          </button>
                        </span>
                      )
                    }

                    // tags mode (keep your Tag component)
                    return renderStandardTag(
                      displayOption,
                      () => onChange(value.filter((id: string) => id !== selectedId)),
                      false, // inactive => original colors
                      'fg', // close icon uses tag text color
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            // ✅ OPEN: show search input
            <input
              ref={inputRef}
              type="text"
              value={searchInput}
              placeholder={placeholder}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault()
                  close()
                  return
                }

                if (e.key === 'ArrowDown') {
                  setIsOpen(true)
                  return
                }

                if (e.key !== 'Enter') return

                const q = searchInput.trim()
                if (!q) return

                e.preventDefault()

                // ✅ Enter selects first match
                const first = filteredOptions[0]
                if (first) {
                  const isSelected = value.includes(first.id)
                  const nextValue = isSelected
                    ? value.filter((id: string) => id !== first.id)
                    : [...value, first.id]

                  onChange(nextValue)
                  setSearchInput('')
                  requestAnimationFrame(() => inputRef.current?.focus())
                  return
                }

                // ✅ Otherwise create custom (tags only)
                if (allowCustom) {
                  addCustomTag(q)
                  requestAnimationFrame(() => inputRef.current?.focus())
                }
              }}
              className={[
                'w-full bg-transparent outline-none',
                'text-[color:var(--section-bg)] font-mono text-lg',
                'border-0 border-b border-b-current',
                'py-2',
              ].join(' ')}
              aria-expanded={isOpen}
              aria-haspopup="listbox"
            />
          )}
        </div>

        <motion.button
          type="button"
          onClick={() => {
            setIsOpen((v) => {
              const next = !v
              if (v === true && next === false) close()
              if (v === false && next === true)
                requestAnimationFrame(() => inputRef.current?.focus())
              return next
            })
          }}
          className="text-[color:var(--section-bg)] text-lg select-none"
          animate={{rotate: isOpen ? 180 : 0}}
          transition={{duration: 0.22, ease: [0.22, 1, 0.36, 1]}}
          aria-label={isOpen ? 'Close' : 'Open'}
        >
          ▼
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="panel"
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{duration: 0.18, ease: [0.22, 1, 0.36, 1]}}
            style={{transformOrigin: 'top'}}
            className="mt-3 will-change-transform will-change-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Options */}
            <div className="max-h-48 overflow-y-auto">
              {/* ✅ Selected row (tags only) */}
              {type === 'tag' && selectedTagOptions.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {selectedTagOptions.map((opt) => {
                      const selectedId = opt.id
                      const handleRemove = () =>
                        onChange(value.filter((id: string) => id !== selectedId))
                      return renderStandardTag(opt, handleRemove, false, 'fg')
                    })}
                  </div>

                  <div className="mt-3 border-b border-gray-200" />
                </div>
              )}

              {/* Create custom row */}
              {searchInput.trim() && allowCustom && filteredOptions.length === 0 && (
                <div className="p-2 border-b border-gray-200">
                  <button
                    type="button"
                    onClick={() => addCustomTag(searchInput.trim())}
                    className="w-full text-left section-fg font-medium flex items-center"
                  >
                    <span className="mr-2">+</span> Create tag &quot;{searchInput.trim()}&quot;
                  </button>
                </div>
              )}

              {/* Main list */}
              <div className="flex flex-wrap gap-2" role="listbox">
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
                          requestAnimationFrame(() => inputRef.current?.focus())
                        }}
                        className={[
                          'px-1 py-0 font-mono text-2xl md:text-3xl uppercase font-light leading-tight inline-flex items-center gap-2',
                          isSelected
                            ? 'bg-[var(--section-bg)] text-[color:var(--section-fg)]'
                            : 'bg-[var(--section-fg)] text-[color:var(--section-bg)]',
                        ].join(' ')}
                        role="option"
                        aria-selected={isSelected}
                      >
                        {option.label}
                        {isSelected && <IoMdClose className="h-3 w-3" aria-hidden="true" />}
                      </button>
                    )
                  }

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
                        requestAnimationFrame(() => inputRef.current?.focus())
                      }}
                      interactive={true}
                      showCloseIcon={isSelected}
                      size="md"
                    />
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
