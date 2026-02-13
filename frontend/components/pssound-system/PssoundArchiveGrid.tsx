'use client'

import {useState} from 'react'
import Tag from '../Tag'
import PssoundArchiveModal from './PssoundArchiveModal'

interface ArchiveItem {
  _id: string
  title: string
  date?: string
  dateObj?: Date | null
  tags: any[]
  coverImage: any
  description: any
}

interface PssoundArchiveGridProps {
  items: ArchiveItem[]
}

export default function PssoundArchiveGrid({items}: PssoundArchiveGridProps) {
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null)

  const handleArchiveClick = (item: ArchiveItem) => {
    setSelectedItem(item)
  }

  const handleCloseModal = () => {
    setSelectedItem(null)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mx-auto mt-8">
        {items.map((item, idx) => (
          <div
            key={item._id || `${item.title}-${idx}`}
            onClick={() => handleArchiveClick(item)}
            className="p-4 sm:p-2 sm:px-4 rounded-lg cursor-pointer transition-all relative bg-white hover:shadow-md"
          >
            <h2 className="text-4xl md:text-3xl mb-2 text-[color:var(--section-accent)] capitalize">
              {item.title}
            </h2>

            {item.date && (
              <span className="mt-1 bg-[color:var(--section-accent)] text-white px-1 py-0 text-sm font-mono block w-fit">
                {item.date}
              </span>
            )}

            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {item.tags.map(
                  (tag: any, tagIdx: number) =>
                    tag &&
                    tag.title && (
                      <Tag
                        key={tag._id || tagIdx}
                        label={tag.title}
                        size="sm"
                        className="block w-fit"
                      />
                    ),
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedItem && <PssoundArchiveModal archive={selectedItem} onClose={handleCloseModal} />}
    </>
  )
}
