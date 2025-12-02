// import React from 'react'

interface SectionListItem {
  title: string
  date?: string
  tag?: string
}

interface SectionListProps {
  heading: string
  description: string
  items: SectionListItem[]
  accentColor: string
  tagColor: string
}

export default function SectionList({
  heading,
  description,
  items,
  accentColor,
  tagColor,
}: SectionListProps) {
  return (
    <div className={`p-6 text-[${accentColor}] md:mx-16`}>
      <h1 className={`text-3xl md:text-4xl mb-6 text-center mt-16 md:mt-0`}>
        {heading}
      </h1>
      <p className='text-base leading-tight md:text-xl mb-10 w-full md:max-w-[65vw] mx-auto md:mt-16'>
        {description}
      </p>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full mx-auto mt-20'>
        {items.map((item, idx) => (
          <div key={idx} className='bg-white p-4 sm:p-2 sm:px-4 rounded-lg'>
            <h2 className={`text-4xl md:text-3xl mb-2 text-[${accentColor}]`}>
              {item.title}
            </h2>
            {item.date && (
              <span
                className={`mt-1 bg-[${accentColor}] text-white px-1 py-0 text-sm font-mono block w-fit`}
              >
                {item.date}
              </span>
            )}
            {item.tag && (
              <span
                className={`mt-3 bg-[${tagColor}] text-white px-2 py-0.5 rounded-full text-xs block w-fit`}
              >
                {item.tag}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
