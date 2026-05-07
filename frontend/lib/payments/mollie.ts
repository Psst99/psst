type MollieApiMode = 'live' | 'test'

type MollieApiConfig =
  | {ok: true; apiKey: string; mode: MollieApiMode}
  | {ok: false; error: string}

export function getMollieApiConfig(): MollieApiConfig {
  const rawMode = process.env.MOLLIE_API_MODE?.trim().toLowerCase()
  const isProductionDeployment = process.env.VERCEL_ENV === 'production'
  const mode: MollieApiMode = isProductionDeployment ? 'live' : rawMode === 'test' ? 'test' : 'live'

  if (rawMode && rawMode !== 'live' && rawMode !== 'test') {
    return {ok: false, error: 'Invalid MOLLIE_API_MODE configuration'}
  }

  const apiKey = process.env.MOLLIE_API_KEY?.trim()
  if (!apiKey) {
    return {ok: false, error: 'Missing MOLLIE_API_KEY configuration'}
  }

  const expectedPrefix = mode === 'live' ? 'live_' : 'test_'
  if (!apiKey.startsWith(expectedPrefix)) {
    return {
      ok: false,
      error: `MOLLIE_API_KEY must use a ${expectedPrefix} key when MOLLIE_API_MODE is ${mode}`,
    }
  }

  return {ok: true, apiKey, mode}
}
