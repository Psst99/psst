import {PortableText, type PortableTextComponents} from '@portabletext/react'
import Link from 'next/link'
import Reveal from './Reveal'
import RevealStack from './RevealStack'

interface CmsContentProps {
  value: any
  className?: string
}

function extractFirstHeading(blocks: any): {text: string; key?: string} | null {
  if (!Array.isArray(blocks)) return null

  for (const b of blocks) {
    if (b?._type !== 'block') continue
    if (b?.style !== 'h2') continue

    const text =
      (b?.children || [])
        .filter((c: any) => c?._type === 'span')
        .map((c: any) => c?.text || '')
        .join('')
        .trim() || ''

    if (text) return {text, key: b?._key}
  }

  return null
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
      <Reveal y={12} durationMs={480}>
        <p className="panel-fg text-base leading-tight min-[83rem]:text-2xl w-full min-[83rem]:max-w-[65vw] mx-auto break-inside-avoid">
          {children}
        </p>
      </Reveal>
    ),
    h2: ({children}) => (
      <Reveal y={12} durationMs={480}>
        <h2 className="panel-fg text-3xl min-[83rem]:text-3xl mb-6 text-center tracking-tight break-after-avoid break-inside-avoid">
          {children}
        </h2>
      </Reveal>
    ),
    largeParagraph: ({children}) => (
      <Reveal y={14} durationMs={500}>
        <p className="panel-fg text-2xl min-[83rem]:text-3xl mb-16 text-left tracking-tight leading-[1.75rem] xl:leading-[2.25rem] break-inside-avoid">
          {children}
        </p>
      </Reveal>
    ),
    largeQuestion: ({children}) => (
      <Reveal y={14} durationMs={500}>
        <p className="panel-fg text-2xl min-[83rem]:text-3xl text-left tracking-tight mt-16 break-inside-avoid">
          {children}
        </p>
      </Reveal>
    ),
  },

  list: ({children}) => (
    <Reveal y={12} durationMs={480}>
      <ul className="list-none p-0 space-y-2 mb-4">{children}</ul>
    </Reveal>
  ),

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

      // Only extract heading if showHeadingAsTab is enabled
      const showTab = Boolean(value?.showHeadingAsTab)
      const heading = showTab ? extractFirstHeading(value?.content) : null

      const contentWithoutHeading =
        showTab && heading?.key
          ? (value?.content || []).filter((b: any) => b?._key !== heading.key)
          : value?.content

      // Determine tab position
      const tabPos = value?.tabPosition === 'right' ? 'right' : 'left'
      const tabPosClass =
        tabPos === 'right'
          ? 'absolute right-16 -top-[31px]'
          : 'absolute left-6 first:min-[83rem]:left-32 min-[83rem]:left-16 -top-[31px]'

      return (
        <Reveal className="my-12 min-[83rem]:my-16 break-inside-avoid" y={18} durationMs={560}>
          <div
            className="relative p-6 min-[83rem]:p-8 rounded-3xl min-[83rem]:text-xl"
            style={{backgroundColor: bgColor, color: textColor}}
          >
            {showTab && heading?.text ? (
              <div className={tabPosClass}>
                <div
                  className={[
                    'relative inline-flex items-center justify-center',
                    'px-8 py-1',
                    'border border-b-0 rounded-t-xl',
                    'uppercase tracking-tight',
                    // underline (same idea as nav)
                    'after:content-[""] after:absolute after:left-0 after:right-0 after:bottom-[-1px] after:h-[1px]',
                  ].join(' ')}
                  style={
                    {
                      backgroundColor: bgColor,
                      color: textColor,
                      borderColor: textColor,
                      // underline should match the box bg, like your nav active underline
                      '--underline-color': bgColor,
                    } as React.CSSProperties
                  }
                >
                  <span className="font-normal text-[24px] leading-[22px]">{heading.text}</span>

                  <span
                    className="pointer-events-none absolute left-0 right-0 bottom-[-1px] h-[1px]"
                    style={{backgroundColor: bgColor}}
                  />
                </div>
              </div>
            ) : null}

            <PortableText
              value={contentWithoutHeading}
              components={getHighlightedBlockComponents()}
            />
          </div>
        </Reveal>
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
      <RevealStack className="space-y-6 min-[83rem]:space-y-10" staggerMs={120}>
        <PortableText value={value} components={components} />
      </RevealStack>
    </div>
  )
}
