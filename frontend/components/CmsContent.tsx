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
        className='text-base leading-tight min-[83rem]:text-xl mb-10 w-full min-[83rem]:max-w-[65vw] mx-auto min-[83rem]:mt-16'
        style={{ color }}
      >
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2
        className='text-3xl min-[83rem]:text-4xl mb-6 text-center tracking-tight'
        style={{ color }}
      >
        {children}
      </h2>
    ),
    largeParagraph: ({ children }) => (
      <p
        className='text-3xl min-[83rem]:text-4xl mb-6 text-left tracking-tight'
        style={{ color }}
      >
        {children}
      </p>
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
      <div className='bg-[#A20018] text-[#dfff3d] p-4 rounded-3xl mb-8 min-[83rem]:text-xl'>
        <PortableText
          value={value.content}
          components={getHighlightedBlockComponents()}
        />
      </div>
    ),
    unknown: ({ value }) => (
      <div className='text-red-500'>
        ⚠️ Unknown block type: {value?._type || 'undefined'}
      </div>
    ),
  },
})

const getHighlightedBlockComponents = (): PortableTextComponents => ({
  block: {
    normal: ({ children }) => (
      <p className='mb-4 text-base min-[83rem]:text-xl leading-relaxed text-[#dfff3d]'>
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className='text-3xl min-[83rem]:text-4xl mb-6 text-center tracking-tight text-[#dfff3d]'>
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
