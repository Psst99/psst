const ABSOLUTE_URL_PATTERN = /^[a-z][a-z\d+.-]*:\/\//i
const PROTOCOL_RELATIVE_PATTERN = /^\/\//
const BARE_DOMAIN_PATTERN = /^[^\s/@]+\.[^\s/]{2,}(?::\d+)?(?:[/?#].*)?$/i

export function normalizeUrlInput(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return trimmed

  if (ABSOLUTE_URL_PATTERN.test(trimmed)) return trimmed
  if (PROTOCOL_RELATIVE_PATTERN.test(trimmed)) return `https:${trimmed}`
  if (BARE_DOMAIN_PATTERN.test(trimmed)) return `https://${trimmed}`

  return trimmed
}

export function isValidUrl(value: string) {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}
