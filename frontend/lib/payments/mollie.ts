type MollieApiMode = 'live' | 'test'

type MollieApiConfig =
  | {ok: true; apiKey: string; mode: MollieApiMode; apiKeyKind: string; vercelEnv?: string}
  | {ok: false; error: string; mode?: MollieApiMode; apiKeyKind?: string; vercelEnv?: string}

function getApiKeyKind(apiKey?: string) {
  if (!apiKey) return undefined
  if (apiKey.startsWith('live_')) return 'live'
  if (apiKey.startsWith('test_')) return 'test'
  if (apiKey.startsWith('access_')) return 'access'
  if (apiKey.startsWith('org_')) return 'organization'
  return 'unknown'
}

export function getMollieApiConfig(): MollieApiConfig {
  const rawMode = process.env.MOLLIE_API_MODE?.trim().toLowerCase()
  const vercelEnv = process.env.VERCEL_ENV
  const isProductionDeployment = vercelEnv === 'production'
  const mode: MollieApiMode = isProductionDeployment ? 'live' : rawMode === 'test' ? 'test' : 'live'

  if (rawMode && rawMode !== 'live' && rawMode !== 'test') {
    return {ok: false, error: 'Invalid MOLLIE_API_MODE configuration', mode, vercelEnv}
  }

  const apiKey = process.env.MOLLIE_API_KEY?.trim()
  const apiKeyKind = getApiKeyKind(apiKey)
  if (!apiKey) {
    return {ok: false, error: 'Missing MOLLIE_API_KEY configuration', mode, vercelEnv}
  }

  const expectedPrefix = mode === 'live' ? 'live_' : 'test_'
  if (!apiKey.startsWith(expectedPrefix)) {
    return {
      ok: false,
      error: `MOLLIE_API_KEY must use a ${expectedPrefix} key when MOLLIE_API_MODE is ${mode}`,
      mode,
      apiKeyKind,
      vercelEnv,
    }
  }

  return {ok: true, apiKey, mode, apiKeyKind: apiKeyKind ?? 'unknown', vercelEnv}
}
