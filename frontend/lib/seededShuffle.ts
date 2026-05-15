export const RANDOM_SORT_FETCH_LIMIT = 5000

function hashString(value: string) {
  let hash = 2166136261

  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

export function createRandomSeed() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function seededShuffleById<T>(
  items: T[],
  seed: string | null | undefined,
  getId: (item: T) => string = (item) => String((item as {_id?: string})._id ?? ''),
) {
  const stableSeed = seed || 'default'

  return [...items].sort((a, b) => {
    const aId = getId(a)
    const bId = getId(b)
    const aHash = hashString(`${stableSeed}:${aId}`)
    const bHash = hashString(`${stableSeed}:${bId}`)

    if (aHash !== bHash) return aHash - bHash
    return aId.localeCompare(bId)
  })
}
