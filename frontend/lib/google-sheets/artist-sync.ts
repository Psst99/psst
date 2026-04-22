import {createClient, SanityClient} from '@sanity/client'
import {existsSync, readFileSync} from 'fs'
import {google, sheets_v4} from 'googleapis'
import path from 'path'

export type ArtistSheetSyncMode = 'approval' | 'imported'

type SheetFieldKey =
  | 'name'
  | 'pronouns'
  | 'categories'
  | 'tags'
  | 'bio'
  | 'link1'
  | 'link2'
  | 'link3'
  | 'socials'
  | 'email'

type ArtistSheetCategory = {
  title?: string
  slug?: {current?: string}
}

type ArtistSheetTag = {
  title?: string
}

type ArtistSheetLink = {
  platform?: string
  url?: string
}

type ArtistSheetDocument = {
  _id: string
  _createdAt?: string
  approved?: boolean
  artistName?: string
  pronouns?: string
  customPronouns?: string
  email?: string
  description?: string
  googleSheetsSyncedAt?: string
  googleSheetsSheetName?: string
  googleSheetsRowNumber?: number
  categories?: ArtistSheetCategory[]
  tags?: ArtistSheetTag[]
  links?: ArtistSheetLink[]
}

export type ArtistSheetSyncResult = {
  mode: ArtistSheetSyncMode
  synced: boolean
  updated: boolean
  sheetName?: string
  rowNumber?: number
  reason?: string
}

export type ImportedArtistSheetSyncOptions = {
  dryRun?: boolean
  force?: boolean
  limit?: number
}

export type ImportedArtistSheetSyncSummary = {
  total: number
  synced: number
  skipped: number
  failed: number
  results: Array<{
    id: string
    artistName: string
    status: 'synced' | 'skipped' | 'failed'
    sheetName?: string
    rowNumber?: number
    reason?: string
  }>
}

type GoogleServiceAccount = {
  client_email?: string
  private_key?: string
}

const IMPORTED_SHEET_TITLE = 'IMPORTED'
const IMPORTED_SHEET_HEADERS = [
  'NAME',
  'PRONOUNS',
  'CATEGORY',
  'TAGS',
  'MINI BIO',
  'LINK 1',
  'LINK 2',
  'LINK 3',
  'SOCIALS',
  'E-MAIL',
]

const MUSIC_CATEGORY_KEYS = new Set(['dj', 'producer', 'liveartist'])
const CATEGORY_PRIORITY: Array<{keys: string[]; sheetName: string}> = [
  {keys: ['collective'], sheetName: 'Collective'},
  {keys: ['visualartist'], sheetName: 'Visual artist'},
  {keys: ['technician'], sheetName: 'Technician'},
  {keys: ['safety'], sheetName: 'Safety'},
  {keys: ['globalplatform'], sheetName: 'PLATFORMS'},
  {keys: ['label'], sheetName: 'LABELS'},
  {keys: ['productionmanager'], sheetName: 'PRODUCTION'},
  {keys: ['manager'], sheetName: 'MANAGER'},
  {keys: ['bookingagent'], sheetName: 'BOOKER'},
]
const SOCIAL_PLATFORM_KEYS = new Set([
  'instagram',
  'tiktok',
  'twitter',
  'twitterx',
  'x',
  'facebook',
])
const SOCIAL_HOST_SUFFIXES = ['instagram.com', 'tiktok.com', 'twitter.com', 'x.com', 'facebook.com']

const artistSheetQuery = `*[_type == "artist" && _id == $id][0]{
  _id,
  _createdAt,
  approved,
  artistName,
  pronouns,
  customPronouns,
  email,
  description,
  googleSheetsSyncedAt,
  googleSheetsSheetName,
  googleSheetsRowNumber,
  categories[]->{title, slug},
  tags[]->{title},
  links
}`

let sheetsApiPromise: Promise<sheets_v4.Sheets> | undefined
let spreadsheetPromise: Promise<sheets_v4.Schema$Spreadsheet> | undefined
let sanityWriteClient: SanityClient | undefined
const headerMapCache = new Map<string, Map<SheetFieldKey, number>>()

function getEnvValue(key: string) {
  const value = process.env[key]?.trim()
  if (!value) {
    throw new Error(`Missing ${key}`)
  }
  return value
}

function readEnvFileValue(key: string) {
  const envFiles = ['.env.local', '.env']

  for (const fileName of envFiles) {
    const filePath = path.join(process.cwd(), fileName)
    if (!existsSync(filePath)) continue

    const lines = readFileSync(filePath, 'utf8').split(/\r?\n/)
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index]
      if (!line.startsWith(`${key}=`)) continue

      const rawValue = line.slice(key.length + 1)
      if (!rawValue.startsWith('"') && !rawValue.startsWith("'")) {
        return rawValue.replace(/^['"]|['"]$/g, '').trim()
      }

      const quote = rawValue[0]
      const inlineValue = rawValue.slice(1)
      if (inlineValue.endsWith(quote)) {
        return inlineValue.slice(0, -1)
      }

      const valueLines = [inlineValue]
      for (let nextIndex = index + 1; nextIndex < lines.length; nextIndex += 1) {
        const currentLine = lines[nextIndex]
        const nextLine = lines[nextIndex + 1] || ''
        if (
          currentLine.endsWith(quote) &&
          (nextLine.trim() === '' || /^[A-Z0-9_]+=/.test(nextLine.trim()))
        ) {
          valueLines.push(currentLine.slice(0, -1))
          return valueLines.join('\n')
        }

        valueLines.push(currentLine)
      }
    }
  }

  return ''
}

function parseGoogleServiceAccount() {
  const candidateValues = [
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim(),
    readEnvFileValue('GOOGLE_SERVICE_ACCOUNT_JSON'),
  ].filter((value): value is string => Boolean(value))

  let lastError: unknown
  for (const candidate of candidateValues) {
    try {
      const normalizedValue =
        (candidate.startsWith('"') && candidate.endsWith('"')) ||
        (candidate.startsWith("'") && candidate.endsWith("'"))
          ? candidate.slice(1, -1)
          : candidate

      const parsed = JSON.parse(normalizedValue) as GoogleServiceAccount
      if (!parsed.client_email || !parsed.private_key) {
        throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is missing client_email or private_key')
      }

      return {
        ...parsed,
        private_key: parsed.private_key.replace(/\\n/g, '\n'),
      }
    } catch (error) {
      lastError = error
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Unable to parse GOOGLE_SERVICE_ACCOUNT_JSON')
}

function getSpreadsheetId() {
  return getEnvValue('GOOGLE_SHEET_ID')
}

function getSanityWriteClient() {
  if (!sanityWriteClient) {
    sanityWriteClient = createClient({
      projectId: getEnvValue('NEXT_PUBLIC_SANITY_PROJECT_ID'),
      dataset: getEnvValue('NEXT_PUBLIC_SANITY_DATASET'),
      token: getEnvValue('SANITY_API_WRITE_TOKEN'),
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-06',
      useCdn: false,
    })
  }

  return sanityWriteClient
}

function publishedId(id: string) {
  return id.replace(/^drafts\./, '')
}

function normalizeText(value?: string | null) {
  return value?.trim() || ''
}

function normalizeKey(value?: string | null) {
  return normalizeText(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '')
}

function formatHashtags(values: Array<string | undefined>) {
  const hashtags = values.map((value) => normalizeKey(value)).filter(Boolean)

  return Array.from(new Set(hashtags))
    .map((value) => `#${value}`)
    .join(' ')
}

function formatPronouns(pronouns?: string, customPronouns?: string) {
  if (!pronouns) return ''
  if (pronouns === 'other') return normalizeText(customPronouns) || 'other'
  if (pronouns === 'prefer_not_to_say') return 'prefer not to say'
  return pronouns
}

function isSocialLink(link: ArtistSheetLink) {
  const platformKey = normalizeKey(link.platform)
  if (SOCIAL_PLATFORM_KEYS.has(platformKey)) {
    return true
  }

  const url = normalizeText(link.url)
  if (!url) return false

  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, '')
    return SOCIAL_HOST_SUFFIXES.some((suffix) => host === suffix || host.endsWith(`.${suffix}`))
  } catch {
    return false
  }
}

function dedupeUrls(links?: ArtistSheetLink[]) {
  const seen = new Set<string>()
  const values: Array<{isSocial: boolean; url: string}> = []

  for (const link of links ?? []) {
    const url = normalizeText(link.url)
    if (!url || seen.has(url)) continue
    seen.add(url)
    values.push({isSocial: isSocialLink(link), url})
  }

  return values
}

function buildArtistRowData(artist: ArtistSheetDocument) {
  const linkEntries = dedupeUrls(artist.links)
  const socialLinks = linkEntries.filter((link) => link.isSocial).map((link) => link.url)
  const regularLinks = linkEntries.filter((link) => !link.isSocial).map((link) => link.url)
  const categoryValues = (artist.categories ?? []).map(
    (category) => category.slug?.current || category.title,
  )

  return {
    name: normalizeText(artist.artistName),
    pronouns: formatPronouns(artist.pronouns, artist.customPronouns),
    categories: formatHashtags(categoryValues),
    tags: formatHashtags((artist.tags ?? []).map((tag) => tag.title)),
    bio: normalizeText(artist.description),
    link1: regularLinks[0] || '',
    link2: regularLinks[1] || '',
    link3: regularLinks.length > 2 ? regularLinks.slice(2).join('\n') : '',
    socials: socialLinks.join('\n'),
    email: normalizeText(artist.email),
  }
}

function normalizeHeaderLabel(value: string) {
  return normalizeKey(value)
}

function resolveHeaderKey(label: string): SheetFieldKey | undefined {
  const normalized = normalizeHeaderLabel(label)

  switch (normalized) {
    case 'name':
    case 'collective':
      return 'name'
    case 'pronouns':
    case 'pronom':
      return 'pronouns'
    case 'category':
    case 'categorie':
      return 'categories'
    case 'tag':
    case 'tags':
      return 'tags'
    case 'minibio':
      return 'bio'
    case 'socials':
      return 'socials'
    case 'email':
      return 'email'
    default:
      break
  }

  if (normalized === 'link1') return 'link1'
  if (normalized === 'link2') return 'link2'
  if (normalized === 'link3') return 'link3'
  return undefined
}

function getArtistCategoryKeys(artist: ArtistSheetDocument) {
  return Array.from(
    new Set(
      (artist.categories ?? [])
        .map((category) => category.slug?.current || category.title)
        .map((value) => normalizeKey(value))
        .filter(Boolean),
    ),
  )
}

function resolvePreferredSheetName(artist: ArtistSheetDocument, mode: ArtistSheetSyncMode) {
  if (mode === 'imported') return IMPORTED_SHEET_TITLE

  const categoryKeys = getArtistCategoryKeys(artist)
  if (categoryKeys.some((key) => MUSIC_CATEGORY_KEYS.has(key))) {
    return 'MUSIC'
  }

  for (const candidate of CATEGORY_PRIORITY) {
    if (candidate.keys.some((key) => categoryKeys.includes(key))) {
      return candidate.sheetName
    }
  }

  return IMPORTED_SHEET_TITLE
}

function quoteSheetTitle(title: string) {
  return `'${title.replace(/'/g, "''")}'`
}

function columnLabel(index: number) {
  let current = index + 1
  let result = ''

  while (current > 0) {
    const remainder = (current - 1) % 26
    result = String.fromCharCode(65 + remainder) + result
    current = Math.floor((current - 1) / 26)
  }

  return result
}

function extractRowNumber(updatedRange?: string | null) {
  const match = updatedRange?.match(/![A-Z]+(\d+):/)
  return match ? Number.parseInt(match[1], 10) : undefined
}

async function getSheetsApi() {
  if (!sheetsApiPromise) {
    const credentials = parseGoogleServiceAccount()
    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    sheetsApiPromise = Promise.resolve(google.sheets({version: 'v4', auth}))
  }

  return sheetsApiPromise
}

async function getSpreadsheet(forceRefresh = false) {
  if (!spreadsheetPromise || forceRefresh) {
    const sheetsApi = await getSheetsApi()
    spreadsheetPromise = sheetsApi.spreadsheets
      .get({
        spreadsheetId: getSpreadsheetId(),
        includeGridData: false,
      })
      .then((response) => response.data)
  }

  return spreadsheetPromise
}

async function ensureImportedSheetExists() {
  const spreadsheet = await getSpreadsheet()
  const existingSheet = spreadsheet.sheets?.find(
    (sheet) => sheet.properties?.title === IMPORTED_SHEET_TITLE,
  )
  if (existingSheet) return

  const sheetsApi = await getSheetsApi()
  await sheetsApi.spreadsheets.batchUpdate({
    spreadsheetId: getSpreadsheetId(),
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title: IMPORTED_SHEET_TITLE,
              gridProperties: {
                frozenRowCount: 2,
              },
            },
          },
        },
      ],
    },
  })

  await sheetsApi.spreadsheets.values.update({
    spreadsheetId: getSpreadsheetId(),
    range: `${quoteSheetTitle(IMPORTED_SHEET_TITLE)}!A1:J2`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[IMPORTED_SHEET_TITLE], IMPORTED_SHEET_HEADERS],
    },
  })

  spreadsheetPromise = undefined
  headerMapCache.delete(IMPORTED_SHEET_TITLE)
}

async function resolveSheetName(
  artist: ArtistSheetDocument,
  mode: ArtistSheetSyncMode,
  options: {allowSheetCreation?: boolean} = {},
) {
  const allowSheetCreation = options.allowSheetCreation ?? true
  const preferredSheetName = resolvePreferredSheetName(artist, mode)

  if (preferredSheetName === IMPORTED_SHEET_TITLE) {
    if (allowSheetCreation) {
      await ensureImportedSheetExists()
    }
    return IMPORTED_SHEET_TITLE
  }

  const spreadsheet = await getSpreadsheet()
  const sheetExists = spreadsheet.sheets?.some(
    (sheet) => sheet.properties?.title === preferredSheetName,
  )
  if (sheetExists) return preferredSheetName

  if (allowSheetCreation) {
    await ensureImportedSheetExists()
  }
  return IMPORTED_SHEET_TITLE
}

async function getHeaderMap(sheetName: string) {
  const cached = headerMapCache.get(sheetName)
  if (cached) return cached

  const sheetsApi = await getSheetsApi()
  const response = await sheetsApi.spreadsheets.values.get({
    spreadsheetId: getSpreadsheetId(),
    range: `${quoteSheetTitle(sheetName)}!A2:AZ2`,
    majorDimension: 'ROWS',
  })

  const headers = response.data.values?.[0] ?? []
  const headerMap = new Map<SheetFieldKey, number>()

  headers.forEach((header, index) => {
    const key = resolveHeaderKey(header)
    if (key && !headerMap.has(key)) {
      headerMap.set(key, index)
    }
  })

  if (!headerMap.size) {
    throw new Error(`Sheet ${sheetName} does not have a recognizable header row`)
  }

  headerMapCache.set(sheetName, headerMap)
  return headerMap
}

function buildSheetRow(artist: ArtistSheetDocument, headerMap: Map<SheetFieldKey, number>) {
  const rowData = buildArtistRowData(artist)
  const lastIndex = Math.max(...headerMap.values(), 9)
  const row = Array.from({length: lastIndex + 1}, () => '')

  for (const [key, index] of headerMap.entries()) {
    row[index] = rowData[key]
  }

  return row
}

async function appendSheetRow(sheetName: string, row: string[]) {
  const sheetsApi = await getSheetsApi()
  const response = await sheetsApi.spreadsheets.values.append({
    spreadsheetId: getSpreadsheetId(),
    range: `${quoteSheetTitle(sheetName)}!A3`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [row],
    },
  })

  const rowNumber = extractRowNumber(response.data.updates?.updatedRange)
  return {sheetName, rowNumber, updated: false}
}

async function updateSheetRow(sheetName: string, rowNumber: number, row: string[]) {
  const sheetsApi = await getSheetsApi()
  const lastColumn = columnLabel(row.length - 1)

  await sheetsApi.spreadsheets.values.update({
    spreadsheetId: getSpreadsheetId(),
    range: `${quoteSheetTitle(sheetName)}!A${rowNumber}:${lastColumn}${rowNumber}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [row],
    },
  })

  return {sheetName, rowNumber, updated: true}
}

async function patchArtistSyncSuccess(
  documentId: string,
  result: {sheetName: string; rowNumber?: number},
) {
  const patch = getSanityWriteClient()
    .patch(documentId)
    .set({
      googleSheetsSyncedAt: new Date().toISOString(),
      googleSheetsSheetName: result.sheetName,
    })
    .unset(['googleSheetsSyncError'])

  if (typeof result.rowNumber === 'number') {
    patch.set({googleSheetsRowNumber: result.rowNumber})
  }

  await patch.commit()
}

async function patchArtistSyncError(documentId: string, error: unknown) {
  await getSanityWriteClient()
    .patch(documentId)
    .set({
      googleSheetsSyncError:
        error instanceof Error ? error.message : 'Unknown Google Sheets sync error',
    })
    .commit()
    .catch(() => undefined)
}

async function fetchArtistSheetDocument(documentId: string) {
  return getSanityWriteClient().fetch<ArtistSheetDocument | null>(artistSheetQuery, {
    id: publishedId(documentId),
  })
}

export async function syncArtistDocumentToGoogleSheet(
  documentId: string,
  options: {mode?: ArtistSheetSyncMode; force?: boolean; dryRun?: boolean} = {},
): Promise<ArtistSheetSyncResult> {
  const artist = await fetchArtistSheetDocument(documentId)
  if (!artist) {
    return {
      mode: options.mode ?? 'approval',
      synced: false,
      updated: false,
      reason: 'artist not found',
    }
  }

  if (!artist.approved) {
    return {
      mode: options.mode ?? 'approval',
      synced: false,
      updated: false,
      reason: 'artist is not approved',
    }
  }

  if (!normalizeText(artist.artistName)) {
    return {
      mode: options.mode ?? 'approval',
      synced: false,
      updated: false,
      reason: 'artist name missing',
    }
  }

  const mode = options.mode ?? 'approval'
  if (!options.force && artist.googleSheetsSyncedAt && artist.googleSheetsSheetName) {
    return {
      mode,
      synced: false,
      updated: false,
      sheetName: artist.googleSheetsSheetName,
      rowNumber: artist.googleSheetsRowNumber,
      reason: 'already synced',
    }
  }

  const sheetName = await resolveSheetName(artist, mode, {
    allowSheetCreation: !options.dryRun,
  })

  if (options.dryRun) {
    return {
      mode,
      synced: false,
      updated: false,
      sheetName,
      rowNumber: artist.googleSheetsRowNumber,
      reason: 'dry run',
    }
  }

  const headerMap = await getHeaderMap(sheetName)
  const row = buildSheetRow(artist, headerMap)

  try {
    const result =
      typeof artist.googleSheetsRowNumber === 'number' && artist.googleSheetsSheetName === sheetName
        ? await updateSheetRow(sheetName, artist.googleSheetsRowNumber, row)
        : await appendSheetRow(sheetName, row)

    await patchArtistSyncSuccess(artist._id, result)

    return {
      mode,
      synced: true,
      updated: result.updated,
      sheetName: result.sheetName,
      rowNumber: result.rowNumber,
    }
  } catch (error) {
    await patchArtistSyncError(artist._id, error)
    throw error
  }
}

export async function syncImportedApprovedArtistsToGoogleSheet(
  options: ImportedArtistSheetSyncOptions = {},
): Promise<ImportedArtistSheetSyncSummary> {
  const limit = options.limit ?? 500
  const query = `*[_type == "artist" && approved == true && !defined(submissionSource)${
    options.force ? '' : ' && !defined(googleSheetsSyncedAt)'
  }] | order(artistName asc)[0...$limit]{_id, artistName}`

  const artists = await getSanityWriteClient().fetch<Array<{_id: string; artistName?: string}>>(
    query,
    {limit},
  )
  const summary: ImportedArtistSheetSyncSummary = {
    total: artists.length,
    synced: 0,
    skipped: 0,
    failed: 0,
    results: [],
  }

  for (const artist of artists) {
    try {
      const result = await syncArtistDocumentToGoogleSheet(artist._id, {
        mode: 'imported',
        force: options.force,
        dryRun: options.dryRun,
      })

      if (result.reason === 'already synced' || result.reason === 'artist is not approved') {
        summary.skipped += 1
        summary.results.push({
          id: artist._id,
          artistName: normalizeText(artist.artistName) || artist._id,
          status: 'skipped',
          sheetName: result.sheetName,
          rowNumber: result.rowNumber,
          reason: result.reason,
        })
        continue
      }

      if (result.reason === 'dry run') {
        summary.skipped += 1
        summary.results.push({
          id: artist._id,
          artistName: normalizeText(artist.artistName) || artist._id,
          status: 'skipped',
          sheetName: result.sheetName,
          rowNumber: result.rowNumber,
          reason: result.reason,
        })
        continue
      }

      summary.synced += 1
      summary.results.push({
        id: artist._id,
        artistName: normalizeText(artist.artistName) || artist._id,
        status: 'synced',
        sheetName: result.sheetName,
        rowNumber: result.rowNumber,
      })
    } catch (error) {
      summary.failed += 1
      summary.results.push({
        id: artist._id,
        artistName: normalizeText(artist.artistName) || artist._id,
        status: 'failed',
        reason: error instanceof Error ? error.message : 'Unknown sync error',
      })
    }
  }

  return summary
}
