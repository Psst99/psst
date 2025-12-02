import {sectionThemes} from '@/lib/theme'
import {PortableText, PortableTextComponents} from '@portabletext/react'
import Link from 'next/link'

interface CmsContentProps {
  value: any
  className?: string
  section: keyof typeof sectionThemes // Make section required
}

const getBlockComponents = (section: keyof typeof sectionThemes): PortableTextComponents => {
  // Get section theme colors
  const theme = sectionThemes[section]

  // Text uses accent color, highlighted boxes invert these colors
  const textColor = theme.accent
  const boxBgColor = theme.accent
  const boxTextColor = theme.bg

  return {
    block: {
      normal: ({children}) => (
        <p
          className="text-base leading-tight min-[83rem]:text-xl w-full min-[83rem]:max-w-[65vw] mx-auto mb-4"
          style={{color: textColor, breakInside: 'avoid'}}
        >
          {children}
        </p>
      ),
      h2: ({children}) => (
        <h2
          className="text-3xl min-[83rem]:text-3xl mb-6 text-center tracking-tight"
          style={{
            color: textColor,
            breakAfter: 'avoid',
            breakInside: 'avoid',
          }}
        >
          {children}
        </h2>
      ),
      largeParagraph: ({children}) => (
        <p
          className="text-2xl min-[83rem]:text-3xl mb-16 text-left tracking-tight leading-[1.75rem] xl:leading-[2.25rem]"
          style={{color: textColor, breakInside: 'avoid'}}
        >
          {children}
        </p>
      ),
      largeQuestion: ({children}) => (
        <p
          className="text-2xl min-[83rem]:text-3xl mb-4 text-left tracking-tight mt-16"
          style={{color: textColor, breakInside: 'avoid'}}
        >
          {children}
        </p>
      ),
    },
    list: ({children}) => <ul className="list-none p-0 space-y-2 mb-4">{children}</ul>,
    listItem: ({children}) => (
      <li
        className="text-base leading-tight mb-2 before:content-['—'] before:mr-1 text-base leading-tight min-[83rem]:text-xl"
        style={{color: textColor}}
      >
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

        // Internal link - use Next.js Link
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

        // External link - use regular anchor
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

        // Fallback if no valid link
        return <span>{children}</span>
      },
    },
    types: {
      highlightedBox: ({value}) => {
        // Start with the inverted section colors
        let bgColor = boxBgColor
        let textColor = boxTextColor

        // Only override with custom colors if specified
        if (value.useCustomBgColor && value.customBgColor) {
          bgColor = value.customBgColor
        }

        if (value.useCustomTextColor && value.customTextColor) {
          textColor = value.customTextColor
        }

        return (
          <div
            className="mt-8 min-[83rem]:mt-0  p-4 rounded-3xl mb-8 min-[83rem]:text-xl"
            style={{
              backgroundColor: bgColor,
              color: textColor,
              breakInside: 'avoid',
            }}
          >
            <PortableText
              value={value.content}
              components={getHighlightedBlockComponents(textColor)}
            />
          </div>
        )
      },
      unknown: ({value}) => (
        <div className="text-red-500">⚠️ Unknown block type: {value?._type || 'undefined'}</div>
      ),
    },
  }
}

const getHighlightedBlockComponents = (textColor: string): PortableTextComponents => ({
  block: {
    normal: ({children}) => (
      <p
        className="mb-4 last:mb-0 text-base min-[83rem]:text-xl leading-snug"
        style={{color: textColor}}
      >
        {children}
      </p>
    ),
    h2: ({children}) => (
      <h2
        className="text-3xl min-[83rem]:text-3xl mb-6 text-center tracking-tight"
        style={{color: textColor}}
      >
        {children}
      </h2>
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

export default function CmsContent({value, className, section}: CmsContentProps) {
  return (
    <div className={className}>
      <PortableText value={value} components={getBlockComponents(section)} />
    </div>
  )
}
