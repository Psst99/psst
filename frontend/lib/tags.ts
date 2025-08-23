export function slugifyTag(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// letters-only length (what design cares about)
export function letterCount(label: string) {
  const letters = label.toLowerCase().replace(/[^a-z0-9]/g, '')
  return Math.max(letters.length, 1)
}

// Simple golden-angle palette generator → (bg, fg)
// Feel free to later replace with a fixed palette if design gives one.
export function colorPairFromLength(len: number) {
  const hue = (len * 137.508) % 360
  // bright bg, deeper-ish fg (complement)
  const bg = `hsl(${hue} 90% 60%)`
  const fg = `hsl(${(hue + 180) % 360} 90% 30%)`
  return { bg, fg }
}

export function getTagColors(label: string) {
  const len = letterCount(label)
  const { bg, fg } = colorPairFromLength(len)
  return { bg, fg }
}
