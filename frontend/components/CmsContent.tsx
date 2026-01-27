import {PortableText, type PortableTextComponents} from '@portabletext/react'
import Link from 'next/link'

interface CmsContentProps {
  value: any
  className?: string
}

const getHighlightedBlockComponents = (): PortableTextComponents => ({
  block: {
    normal: ({children}) => (
      <p className="last:mb-0 text-base min-[83rem]:text-2xl leading-snug">{children}</p>
    ),
    h2: ({children}) => (
      <h2 className="text-3xl min-[83rem]:text-3xl mb-6 text-center tracking-tight">{children}</h2>
    ),
  },
  marks: {
    link: ({children, value}) => {
      const {linkType, internalLink, href, openInNewTab} = value || {}

      if (linkType === 'internal' && internalLink) {
        return (
          <Link
            href={internalLink}
            className="underline hover:opacity-70 transition-opacity"
            target={openInNewTab ? '_blank' : undefined}
            rel={openInNewTab ? 'noopener noreferrer' : undefined}
          >
            {children}
          </Link>
        )
      }

      if (linkType === 'external' && href) {
        return (
          <a
            href={href}
            className="underline hover:opacity-70 transition-opacity"
            target={openInNewTab ? '_blank' : '_self'}
            rel={openInNewTab ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        )
      }

      return <span>{children}</span>
    },
  },
})

const components: PortableTextComponents = {
  block: {
    normal: ({children}) => (
      <p className="panel-fg text-base leading-tight min-[83rem]:text-2xl w-full min-[83rem]:max-w-[65vw] mx-auto break-inside-avoid">
        {children}
      </p>
    ),
    h2: ({children}) => (
      <h2 className="panel-fg text-3xl min-[83rem]:text-3xl mb-6 text-center tracking-tight break-after-avoid break-inside-avoid">
        {children}
      </h2>
    ),
    largeParagraph: ({children}) => (
      <p className="panel-fg text-2xl min-[83rem]:text-3xl mb-16 text-left tracking-tight leading-[1.75rem] xl:leading-[2.25rem] break-inside-avoid">
        {children}
      </p>
    ),
    largeQuestion: ({children}) => (
      <p className="panel-fg text-2xl min-[83rem]:text-3xl text-left tracking-tight mt-16 break-inside-avoid">
        {children}
      </p>
    ),
  },

  list: ({children}) => <ul className="list-none p-0 space-y-2 mb-4">{children}</ul>,

  listItem: ({children}) => (
    <li className="panel-fg text-base leading-tight mb-2 before:content-['—'] before:mr-1 min-[83rem]:text-xl">
      {children}
    </li>
  ),

  marks: {
    textColor: ({children, value}) => <span style={{color: value?.value}}>{children}</span>,

    highlightColor: ({children, value}) => (
      <span
        style={{
          backgroundColor: value?.value,
          color: value?.text || undefined,
          padding: '0.05em 0.15em',
        }}
      >
        {children}
      </span>
    ),

    link: ({children, value}) => {
      const {linkType, internalLink, href, openInNewTab} = value || {}

      if (linkType === 'internal' && internalLink) {
        return (
          <Link
            href={internalLink}
            className="underline hover:opacity-70 transition-opacity"
            target={openInNewTab ? '_blank' : undefined}
            rel={openInNewTab ? 'noopener noreferrer' : undefined}
          >
            {children}
          </Link>
        )
      }

      if (linkType === 'external' && href) {
        return (
          <a
            href={href}
            className="underline hover:opacity-70 transition-opacity"
            target={openInNewTab ? '_blank' : '_self'}
            rel={openInNewTab ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        )
      }

      return <span>{children}</span>
    },
  },

  types: {
    highlightedBox: ({value}) => {
      let bgColor: string | undefined = 'var(--panel-fg)'
      let textColor: string | undefined = 'var(--panel-bg)'

      if (value?.useCustomBgColor && value?.customBgColor) bgColor = value.customBgColor
      if (value?.useCustomTextColor && value?.customTextColor) textColor = value.customTextColor

      return (
        <div
          className="my-12 min-[83rem]:my-16 p-6 min-[83rem]:p-8 rounded-3xl min-[83rem]:text-xl break-inside-avoid"
          style={{backgroundColor: bgColor, color: textColor}}
        >
          <PortableText value={value?.content} components={getHighlightedBlockComponents()} />
        </div>
      )
    },

    unknown: ({value}) => (
      <div className="text-red-500">⚠️ Unknown block type: {value?._type || 'undefined'}</div>
    ),
  },
}

export default function CmsContent({value, className}: CmsContentProps) {
  return (
    <div className={className}>
      <div className="space-y-6 min-[83rem]:space-y-10">
        <PortableText value={value} components={components} />
      </div>
    </div>
  )
}
