import { sectionThemes } from './theme'

const themeColors = {
  // Background colors (lighter ones work best)
  backgrounds: [
    '#dfff3d', // psst - yellow
    '#d3cd7f', // database - light gold
    '#00ffdd', // events - teal
    '#D2D2D2', // workshops - light gray
    '#FFCC00', // archive - gold
    '#1D53FF', // resources - blue
    '#07f25b', // pssound - green
    '#FE93E7', // resources accent - pink
  ],

  // Text colors (darker ones for contrast)
  text: [
    '#A20018', // psst - dark red
    '#6600ff', // database - purple
    '#4E4E4E', // events - dark gray
    '#F50806', // workshops - red
    '#81520A', // archive - brown
    '#000000', // home - black
  ],
}

// Predefined color pairs with good contrast
const colorPairs = [
  { bg: '#F50806', fg: '#dfff3d' }, // yellow bg, red text
  { bg: '#07f25b', fg: '#1D53FF' }, // green bg, brown text
  { bg: '#00ffdd', fg: '#4E4E4E' }, // teal bg, gray text
  { bg: '#6600ff', fg: '#00ffdd' }, // pink bg, gray text
  { bg: '#4E4E4E', fg: '#00ffdd' }, // blue bg, white text
  { bg: '#D2D2D2', fg: '#1D53FF' }, // light gray bg, red text
  { bg: '#FFCC00', fg: '#A20018' }, // gold bg, brown text
  { bg: '#d3cd7f', fg: '#A20018' }, // light gold bg, purple text
]

// Map specific tag lengths to specific color pairs (more predictable)
const lengthToColorMap: Record<number, { bg: string; fg: string }> = {
  1: { bg: '#dfff3d', fg: '#A20018' }, // Very short tags
  2: { bg: '#07f25b', fg: '#81520A' },
  3: { bg: '#A20018', fg: '#00ffdd' },
  4: { bg: '#FFCC00', fg: '#A20018' },
  5: { bg: '#81520A', fg: '#FE93E7' },
  6: { bg: '#1D53FF', fg: '#dfff3d' },
  7: { bg: '#07f25b', fg: '#1D53FF' },
  8: { bg: '#F50806', fg: '#dfff3d' },
  9: { bg: '#FE93E7', fg: '#F50806' },
  10: { bg: '#6600ff', fg: '#00ffdd' },
  11: { bg: '#4E4E4E', fg: '#00ffdd' },
  12: { bg: '#d3cd7f', fg: '#A20018' },
  13: { bg: '#D2D2D2', fg: '#1D53FF' },
  14: { bg: '#D2D2D2', fg: '#81520A' },
  15: { bg: '#FFCC00', fg: '#4E4E4E' },
  // For 16+ letters, we'll use the remainder when divided by 8
}

// Special tags that should always have specific colors
// const specialTags: Record<string, { bg: string; fg: string }> = {
//   sound: { bg: '#07f25b', fg: '#81520A' },
//   dj: { bg: '#FE93E7', fg: '#4E4E4E' },
//   performance: { bg: '#00ffdd', fg: '#4E4E4E' },
//   workshop: { bg: '#D2D2D2', fg: '#F50806' },
//   collective: { bg: '#dfff3d', fg: '#A20018' },
//   exhibition: { bg: '#FFCC00', fg: '#81520A' },
// }

/**
 * Get consistent colors for tags based on tag text
 */
export function getTagColors(tag: string) {
  // Check for special tags first
  const normalizedTag = tag.toLowerCase().trim()
  // if (specialTags[normalizedTag]) {
  //   return {
  //     bg: specialTags[normalizedTag].bg,
  //     fg: specialTags[normalizedTag].fg,
  //     border: specialTags[normalizedTag].bg,
  //   }
  // }

  // Get word length without spaces and special characters
  const cleanLength = tag.replace(/[^a-zA-Z0-9]/g, '').length

  // Get color pair based on word length
  let colorPair

  if (cleanLength <= 15 && lengthToColorMap[cleanLength]) {
    colorPair = lengthToColorMap[cleanLength]
  } else {
    // For very long tags, use modulo to map to one of our 8 color pairs
    const index = cleanLength % 8
    colorPair = colorPairs[index]
  }

  return {
    bg: colorPair.bg,
    fg: colorPair.fg,
    bd: colorPair.bg,
  }
}

/**
 * Get colors for active/selected tags
 */
export function getActiveTagColors(tag: string) {
  const colors = getTagColors(tag)

  return {
    bg: 'white',
    fg: colors.bg,
    bd: colors.bg,
  }
}

export function slugifyTag(tag: string): string {
  return tag.toLowerCase().replace(/[^a-z0-9]/g, '-')
}
