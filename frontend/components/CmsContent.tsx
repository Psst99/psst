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
        className='text-base leading-tight min-[83rem]:text-xl w-full min-[83rem]:max-w-[65vw] mx-auto mb-4'
        style={{ color, breakInside: 'avoid' }}
      >
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2
        className='text-3xl min-[83rem]:text-3xl mb-6 text-center tracking-tight'
        style={{ color, breakAfter: 'avoid', breakInside: 'avoid' }}
      >
        {children}
      </h2>
    ),
    largeParagraph: ({ children }) => (
      <p
        className='text-2xl min-[83rem]:text-3xl mb-16 text-left tracking-tight leading-[1.75rem] xl:leading-[2.25rem] '
        style={{ color, breakInside: 'avoid' }}
      >
        {children}
      </p>
    ),
    largeQuestion: ({ children }) => (
      <p
        className='text-2xl min-[83rem]:text-3xl mb-4 text-left tracking-tight mt-16'
        style={{ color, breakInside: 'avoid' }}
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
      <div
        className='bg-[#A20018] text-[#dfff3d] p-4 rounded-3xl mb-8 min-[83rem]:text-xl'
        style={{
          breakInside: 'avoid',
        }}
      >
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
      <h2 className='text-3xl min-[83rem]:text-3xl mb-6 text-center tracking-tight text-[#dfff3d]'>
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
