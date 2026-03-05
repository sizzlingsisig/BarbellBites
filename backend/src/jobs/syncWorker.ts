import 'dotenv/config'
import { closeDbConnections } from '../config/db.js'
import { runSync, type ClusterName, type SyncMode } from '../scripts/syncClusters.js'

const DEFAULT_INTERVAL_MINUTES = 5

let isRunning = false

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value == null) return fallback
  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase())
}

function parseIntervalMinutes(value: string | undefined): number {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_INTERVAL_MINUTES
  }
  return parsed
}

function parseCluster(value: string | undefined, fallback: ClusterName): ClusterName {
  if (!value) return fallback
  if (value === 'primary' || value === 'secondary') return value
  throw new Error(`Invalid cluster '${value}' in env. Use primary or secondary.`)
}

function parseMode(value: string | undefined): SyncMode {
  if (!value) return 'upsert'
  if (value === 'replace' || value === 'upsert') return value
  throw new Error(`Invalid sync mode '${value}' in env. Use replace or upsert.`)
}

async function runSyncJob(from: ClusterName, to: ClusterName, mode: SyncMode) {
  if (isRunning) {
    console.warn('[SYNC WORKER] Previous run is still in progress. Skipping this cycle.')
    return
  }

  const startedAt = Date.now()
  isRunning = true

  try {
    console.log(`[SYNC WORKER] Starting sync (${from} -> ${to}, mode=${mode})`)
    await runSync({ from, to, mode })
    const elapsedMs = Date.now() - startedAt
    console.log(`[SYNC WORKER] Sync completed in ${elapsedMs}ms`)
  } catch (error) {
    console.error('[SYNC WORKER] Sync run failed:', error)
  } finally {
    await closeDbConnections()
    isRunning = false
  }
}

async function start() {
  const enabled = parseBoolean(process.env.SYNC_ENABLED, true)
  if (!enabled) {
    console.log('[SYNC WORKER] Disabled (SYNC_ENABLED=false). Exiting.')
    return
  }

  const from = parseCluster(process.env.SYNC_FROM, 'primary')
  const to = parseCluster(process.env.SYNC_TO, from === 'primary' ? 'secondary' : 'primary')
  const mode = parseMode(process.env.SYNC_MODE)

  if (from === to) {
    throw new Error('SYNC_FROM and SYNC_TO must be different.')
  }

  const intervalMinutes = parseIntervalMinutes(process.env.SYNC_INTERVAL_MINUTES)
  const intervalMs = intervalMinutes * 60 * 1000

  console.log(`[SYNC WORKER] Enabled. Interval=${intervalMinutes}m, direction=${from}->${to}, mode=${mode}`)

  await runSyncJob(from, to, mode)

  setInterval(() => {
    void runSyncJob(from, to, mode)
  }, intervalMs)
}

start().catch((error) => {
  console.error('[SYNC WORKER] Fatal startup error:', error)
  process.exit(1)
})
