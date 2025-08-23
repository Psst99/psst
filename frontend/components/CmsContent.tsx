import { PortableText, PortableTextComponents } from '@portabletext/react'

interface CmsContentProps {
  value: any
  className?: string
  color?: string
}

const getBlockComponents = (color: string): PortableTextComponents => ({
  block: {
    normal: ({ children }) => (
      <p
        className='text-base leading-tight md:text-xl mb-10 w-full md:max-w-[65vw] mx-auto md:mt-16'
        style={{ color }}
      >
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2
        className='text-3xl sm:text-5xl md:text-4xl mb-6 text-center tracking-tight'
        style={{ color }}
      >
        {children}
      </h2>
    ),
  },
  marks: {
    textColor: ({ children, value }) => (
      <span style={{ color: value?.value }}>{children}</span>
    ),
    highlightColor: ({ children, value }) => (
      <span
        style={{
          backgroundColor: value?.value,
          color: value?.text || undefined,
          padding: '0.1em 0.3em',
          borderRadius: '0.2em',
        }}
      >
        {children}
      </span>
    ),
  },
  types: {
    highlightedBox: ({ value }) => (
      <div className='bg-[#A20018] text-[#dfff3d] p-4 rounded-3xl mb-8'>
        <PortableText
          value={value.content}
          components={getHighlightedBlockComponents()}
        />
      </div>
    ),
  },
})

const getHighlightedBlockComponents = (): PortableTextComponents => ({
  block: {
    normal: ({ children }) => (
      <p className='mb-4 text-base leading-relaxed text-[#dfff3d]'>
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className='text-3xl sm:text-5xl md:text-4xl mb-6 text-center tracking-tight text-[#dfff3d]'>
        {children}
      </h2>
    ),
  },
})

export default function CmsContent({
  value,
  className,
  color = '#A20018',
}: CmsContentProps) {
  return (
    <div className={className}>
      <PortableText value={value} components={getBlockComponents(color)} />
    </div>
  )
}
