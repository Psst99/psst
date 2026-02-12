import {PortableText, type PortableTextComponents} from '@portabletext/react'
import Link from 'next/link'
import Reveal from './Reveal'
import RevealStack from './RevealStack'
import {isValidElement, type CSSProperties, type ReactNode} from 'react'
import {LINK_PILL_CLASS} from '@/lib/linkStyles'

interface CmsContentProps {
  value: any
  className?: string
  bulletTone?: 'panel' | 'sectionBg' | 'sectionFg' | 'muted'
}

type PortableTextLinkValue = {
  linkType?: 'internal' | 'external' | 'href' | 'page' | 'post'
  internalLink?: string
  href?: string
  page?: string
  post?: string
  openInNewTab?: boolean
}

const bulletToneColor = {
  panel: 'var(--panel-fg)',
  sectionBg: 'var(--section-bg)',
  sectionFg: 'var(--section-fg)',
  muted: 'color-mix(in oklab, var(--panel-fg) 55%, transparent)',
} as const

function GlyphBulletIcon() {
  return (
    <svg
      viewBox="0 0 177 176"
      className="h-[0.68em] w-[0.68em]"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M57.4804 58.2399C55.0804 48.9399 52.9804 40.7399 50.9804 32.6399C49.5804 26.9399 48.1804 21.3399 46.8804 15.6399C46.4804 14.0399 46.3804 12.3399 46.1804 10.7399C45.8804 6.43991 46.6804 2.73991 50.9804 0.739906C55.3804 -1.26009 58.5804 1.13991 60.9804 4.13991C66.5804 11.3399 71.9804 18.7399 76.9804 26.3399C80.7804 32.3399 83.7804 38.8399 87.5804 45.9399C93.2804 36.4399 98.3804 27.7399 103.68 19.2399C106.58 14.5399 109.38 9.83991 112.88 5.53991C114.78 3.23991 117.58 1.03991 120.38 0.239906C126.08 -1.16009 130.68 3.73991 129.58 10.4399C127.98 19.9399 125.58 29.3399 123.28 38.6399C121.78 44.8399 119.68 50.9399 117.88 57.4399C127.08 55.0399 136.08 52.6399 145.08 50.4399C151.08 48.9399 157.08 47.5399 163.08 46.3399C164.98 45.9399 167.08 45.9399 168.98 46.3399C176.08 47.7399 178.68 54.3399 173.38 59.1399C166.68 65.2399 159.18 70.5399 151.58 75.5399C145.08 79.8399 137.98 83.1399 130.18 87.3399C132.48 88.8399 133.98 89.9399 135.48 90.9399C145.88 97.2399 156.38 103.44 166.68 109.74C169.18 111.34 172.08 113.04 173.38 115.54C174.78 118.14 175.58 122.14 174.58 124.74C173.68 127.04 169.98 129.44 167.38 129.64C162.88 129.94 158.18 128.94 153.68 127.84C142.18 125.04 130.88 121.94 118.28 118.64C119.68 123.74 120.68 128.14 122.18 132.44C125.98 143.34 129.18 154.34 129.28 166.04C129.28 169.74 128.98 173.04 125.18 174.84C120.98 176.74 117.78 175.14 114.88 172.24C104.98 162.24 98.6804 149.94 92.5804 137.54C91.4804 135.34 90.2804 133.14 88.6804 130.14C84.5804 136.64 80.8804 142.54 77.1804 148.34C72.7804 155.24 68.3804 162.04 63.7804 168.84C62.5804 170.64 61.2804 172.84 59.4804 173.54C56.7804 174.64 53.0804 175.64 50.8804 174.64C48.5804 173.64 46.0804 169.74 46.2804 167.44C47.1804 159.24 49.0804 151.04 50.8804 142.94C52.5804 135.34 54.7804 127.84 56.9804 119.14C53.3804 119.94 50.4804 120.44 47.4804 121.14C36.7804 123.74 26.1804 126.54 15.4804 129.04C13.2804 129.54 10.8804 129.74 8.58041 129.74C4.68041 129.74 1.28041 127.74 0.68041 124.14C0.28041 121.54 1.18041 117.34 3.18041 115.84C11.7804 109.14 20.8804 102.94 29.9804 96.9399C34.9804 93.7399 40.4804 91.3399 46.7804 88.0399C39.6804 84.2399 33.5804 81.3399 27.8804 77.7399C19.7804 72.5399 11.8804 67.0399 4.18041 61.3399C0.88041 58.8399 -1.21959 55.2399 0.780413 50.8399C2.68041 46.6399 6.58041 46.4399 10.5804 46.4399C23.6804 46.6399 35.6804 51.0399 47.8804 55.1399C50.8804 56.1399 53.5804 56.9399 57.4804 58.2399Z" />
    </svg>
  )
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

function hasRenderableText(node: ReactNode): boolean {
  if (node === null || node === undefined || typeof node === 'boolean') return false
  if (typeof node === 'string' || typeof node === 'number') return String(node).trim().length > 0
  if (Array.isArray(node)) return node.some((child) => hasRenderableText(child))
  if (isValidElement(node)) {
    return hasRenderableText((node.props as {children?: ReactNode})?.children)
  }
  return true
}

function resolvePortableTextLink(value: PortableTextLinkValue | null | undefined): {
  href: string
  openInNewTab: boolean
} | null {
  if (!value) return null

  const linkType = value.linkType ?? (value.href ? 'href' : undefined)

  if (linkType === 'internal' && value.internalLink) {
    return {href: value.internalLink, openInNewTab: Boolean(value.openInNewTab)}
  }

  if ((linkType === 'external' || linkType === 'href') && value.href) {
    return {href: value.href, openInNewTab: Boolean(value.openInNewTab)}
  }

  if (linkType === 'page' && value.page) {
    return {href: `/${value.page}`, openInNewTab: Boolean(value.openInNewTab)}
  }

  if (linkType === 'post' && value.post) {
    return {href: `/posts/${value.post}`, openInNewTab: Boolean(value.openInNewTab)}
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
      const resolvedLink = resolvePortableTextLink(value)
      if (!resolvedLink) return <span>{children}</span>

      const {href, openInNewTab} = resolvedLink
      const isInternal = href.startsWith('/')

      if (isInternal) {
        return (
            <Link
              href={href}
              className={LINK_PILL_CLASS}
              target={openInNewTab ? '_blank' : undefined}
              rel={openInNewTab ? 'noopener noreferrer' : undefined}
            >
            {children}
          </Link>
        )
      }

      return (
        <a
          href={href}
          className={LINK_PILL_CLASS}
          target={openInNewTab ? '_blank' : '_self'}
          rel={openInNewTab ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    },
  },
})

const getComponents = (
  bulletTone: CmsContentProps['bulletTone'] = 'panel',
): PortableTextComponents => ({
  block: {
    normal: ({children}) => (
      <Reveal y={12} durationMs={480}>
        {hasRenderableText(children) ? (
          <p className="panel-fg text-base leading-tight min-[83rem]:text-2xl w-full min-[83rem]:max-w-[65vw] mx-auto break-inside-avoid">
            {children}
          </p>
        ) : null}
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
      <ul className="list-none p-0 my-0 -mt-2 min-[83rem]:-mt-3 space-y-0.5">{children}</ul>
    </Reveal>
  ),

  listItem: ({children}) => (
    <li className="panel-fg text-base leading-tight mb-0 min-[83rem]:text-2xl">
      <span className="inline-flex items-start gap-1.5">
        <span
          className="inline-flex shrink-0 translate-y-[0.32em] mr-1"
          style={{
            color: `var(--cms-bullet-color, ${bulletToneColor[bulletTone ?? 'panel']})`,
          }}
        >
          <GlyphBulletIcon />
        </span>
        <span>{children}</span>
      </span>
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
      const resolvedLink = resolvePortableTextLink(value)
      if (!resolvedLink) return <span>{children}</span>

      const {href, openInNewTab} = resolvedLink
      const isInternal = href.startsWith('/')

      if (isInternal) {
        return (
            <Link
              href={href}
              className={LINK_PILL_CLASS}
              target={openInNewTab ? '_blank' : undefined}
              rel={openInNewTab ? 'noopener noreferrer' : undefined}
            >
            {children}
          </Link>
        )
      }

      return (
        <a
          href={href}
          className={LINK_PILL_CLASS}
          target={openInNewTab ? '_blank' : '_self'}
          rel={openInNewTab ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
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
})

export default function CmsContent({value, className, bulletTone = 'panel'}: CmsContentProps) {
  const style = {
    '--cms-bullet-color': bulletToneColor[bulletTone],
  } as CSSProperties

  return (
    <div className={className} style={style}>
      <RevealStack className="space-y-6 min-[83rem]:space-y-10" staggerMs={120}>
        <PortableText value={value} components={getComponents(bulletTone)} />
      </RevealStack>
    </div>
  )
}
