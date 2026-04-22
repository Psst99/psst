import {loadEnvConfig} from '@next/env'

type ImportedArtistSheetSyncOptions = {
  dryRun?: boolean
  force?: boolean
  limit?: number
}

loadEnvConfig(process.cwd())

function readNumberArg(args: string[], name: string) {
  const equalsArg = args.find((arg) => arg.startsWith(`${name}=`))
  if (equalsArg) {
    const value = Number.parseInt(equalsArg.slice(name.length + 1), 10)
    return Number.isFinite(value) ? value : undefined
  }

  const index = args.findIndex((arg) => arg === name)
  if (index === -1) return undefined

  const value = Number.parseInt(args[index + 1] || '', 10)
  return Number.isFinite(value) ? value : undefined
}

async function main() {
  const args = process.argv.slice(2)
  const options: ImportedArtistSheetSyncOptions = {
    dryRun: args.includes('--dry-run'),
    force: args.includes('--force'),
    limit: readNumberArg(args, '--limit'),
  }

  const {syncImportedApprovedArtistsToGoogleSheet} = await import(
    '../lib/google-sheets/artist-sync'
  )
  const summary = await syncImportedApprovedArtistsToGoogleSheet(options)
  const preview = summary.results.slice(0, 20)
  const failures = summary.results.filter((result) => result.status === 'failed')

  console.log(
    JSON.stringify(
      {
        options,
        summary: {
          total: summary.total,
          synced: summary.synced,
          skipped: summary.skipped,
          failed: summary.failed,
        },
        preview,
        failures,
      },
      null,
      2,
    ),
  )

  if (failures.length > 0) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Unknown imported artist sync error')
  process.exit(1)
})
