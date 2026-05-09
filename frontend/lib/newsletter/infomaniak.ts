import 'server-only'

type InfomaniakSubscriberPayload = {
  email: string
  fields?: Record<string, string>
  groups?: Array<number | string>
}

type SubscribeToInfomaniakOptions = {
  email: string
  name?: string
  sourcePath?: string
}

type InfomaniakResponse = {
  result?: string
  error?: {
    code?: string
    message?: string
  }
  data?: unknown
}

function splitName(name?: string) {
  const trimmed = name?.trim()
  if (!trimmed) return null

  const parts = trimmed.split(/\s+/)
  const firstName = parts.shift()
  const lastName = parts.join(' ')

  return {
    firstName,
    lastName: lastName || undefined,
    fullName: trimmed,
  }
}

function parseGroups(value?: string) {
  if (!value) return undefined

  const groups = value
    .split(',')
    .map((group) => group.trim())
    .filter(Boolean)
    .map((group) => {
      const numericGroup = Number(group)
      return Number.isInteger(numericGroup) && numericGroup > 0 ? numericGroup : group
    })

  return groups.length > 0 ? groups : undefined
}

function buildFields({name, sourcePath}: Pick<SubscribeToInfomaniakOptions, 'name' | 'sourcePath'>) {
  const fields: Record<string, string> = {}
  const parsedName = splitName(name)

  if (parsedName) {
    const fullNameKey = process.env.INFOMANIAK_NEWSLETTER_FULL_NAME_FIELD_KEY
    const firstNameKey = process.env.INFOMANIAK_NEWSLETTER_FIRST_NAME_FIELD_KEY
    const lastNameKey = process.env.INFOMANIAK_NEWSLETTER_LAST_NAME_FIELD_KEY

    if (fullNameKey) fields[fullNameKey] = parsedName.fullName
    if (firstNameKey && parsedName.firstName) fields[firstNameKey] = parsedName.firstName
    if (lastNameKey && parsedName.lastName) fields[lastNameKey] = parsedName.lastName
  }

  const sourcePathKey = process.env.INFOMANIAK_NEWSLETTER_SOURCE_PATH_FIELD_KEY
  if (sourcePathKey && sourcePath) fields[sourcePathKey] = sourcePath

  return Object.keys(fields).length > 0 ? fields : undefined
}

function getApiConfig() {
  const token = process.env.INFOMANIAK_NEWSLETTER_API_TOKEN
  const domainId = process.env.INFOMANIAK_NEWSLETTER_DOMAIN_ID

  if (!token || !domainId) {
    return null
  }

  return {
    token,
    domainId,
    baseUrl: process.env.INFOMANIAK_API_BASE_URL ?? 'https://api.infomaniak.com',
  }
}

export async function subscribeToInfomaniakNewsletter({
  email,
  name,
  sourcePath,
}: SubscribeToInfomaniakOptions) {
  const config = getApiConfig()
  if (!config) {
    return {success: false as const, reason: 'missing-configuration' as const}
  }

  const payload: InfomaniakSubscriberPayload = {
    email,
    fields: buildFields({name, sourcePath}),
    groups: parseGroups(process.env.INFOMANIAK_NEWSLETTER_GROUPS),
  }

  const response = await fetch(
    `${config.baseUrl}/1/newsletters/${encodeURIComponent(config.domainId)}/subscribers`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  )

  const data = (await response.json().catch(() => null)) as InfomaniakResponse | null

  if (!response.ok || data?.result !== 'success') {
    const providerMessage = data?.error?.message ?? response.statusText
    throw new Error(`Infomaniak newsletter subscription failed: ${providerMessage}`)
  }

  return {success: true as const}
}
