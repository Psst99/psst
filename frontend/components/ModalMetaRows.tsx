import Link from 'next/link'
import {LuLink, LuMapPin} from 'react-icons/lu'
import {LINK_PILL_CLASS} from '@/lib/linkStyles'

interface ModalMetaRowsProps {
  location?: string | null
  url?: string | null
  linkLabel?: string
  className?: string
}

function formatLinkLabel(url: string, explicitLabel?: string) {
  if (explicitLabel) return explicitLabel

  if (url.startsWith('/')) return url

  try {
    const parsed = new URL(url)

    if (parsed.protocol === 'mailto:' || parsed.protocol === 'tel:') {
      return parsed.pathname || url
    }

    if (parsed.host) return parsed.host.replace(/^www\./, '')
  } catch {
    const withoutProtocol = url.replace(/^[a-z]+:\/\//i, '').replace(/^www\./, '')
    const domain = withoutProtocol.split(/[/?#]/)[0]
    if (domain) return domain
  }

  return url
}

export default function ModalMetaRows({
  location,
  url,
  linkLabel,
  className = '',
}: ModalMetaRowsProps) {
  const cleanLocation = typeof location === 'string' ? location.trim() : ''
  const cleanUrl = typeof url === 'string' ? url.trim() : ''

  if (!cleanLocation && !cleanUrl) return null

  const linkText = cleanUrl ? formatLinkLabel(cleanUrl, linkLabel) : ''
  const linkClassName = `${LINK_PILL_CLASS} max-w-full text-[0.95em]`

  return (
    <div
      className={`mb-6 space-y-2 text-base leading-snug min-[69.375rem]:text-xl ${className}`.trim()}
    >
      {cleanLocation && (
        <p className="flex items-start gap-2">
          <LuMapPin className="mt-[0.16em] h-[1em] w-[1em] shrink-0" aria-hidden="true" />
          <span>{cleanLocation}</span>
        </p>
      )}

      {cleanUrl && (
        <p className="flex items-start gap-2">
          <LuLink className="mt-[0.16em] h-[1em] w-[1em] shrink-0" aria-hidden="true" />
          {cleanUrl.startsWith('/') ? (
            <Link href={cleanUrl} className={linkClassName} title={cleanUrl}>
              {linkText}
            </Link>
          ) : (
            <a
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
              title={cleanUrl}
            >
              {linkText}
            </a>
          )}
        </p>
      )}
    </div>
  )
}
