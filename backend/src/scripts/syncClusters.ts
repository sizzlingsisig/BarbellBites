import 'dotenv/config'
import { backupConnection, closeDbConnections, connectDB, primaryConnection } from '../config/db.js'
import { pathToFileURL } from 'node:url'

export type ClusterName = 'primary' | 'secondary'
export type SyncMode = 'replace' | 'upsert'

export type SyncOptions = {
  from?: ClusterName
  to?: ClusterName
  mode?: SyncMode
}

const EXCLUDED_COLLECTIONS = new Set(['system.profile', 'system.js', '_migrations'])

function parseArg(name: string): string | undefined {
  const prefix = `--${name}=`
  const arg = process.argv.find((value) => value.startsWith(prefix))
  if (!arg) return undefined
  return arg.slice(prefix.length)
}

function getConnection(cluster: ClusterName) {
  return cluster === 'primary' ? primaryConnection : backupConnection
}

function validateCluster(value: string | undefined, fallback: ClusterName): ClusterName {
  if (!value) return fallback
  if (value === 'primary' || value === 'secondary') return value
  throw new Error(`Invalid cluster '${value}'. Use primary or secondary.`)
}

function validateMode(value: string | undefined): SyncMode {
  if (!value || value === 'replace') return 'replace'
  if (value === 'upsert') return 'upsert'
  throw new Error(`Invalid mode '${value}'. Use replace or upsert.`)
}

async function syncCollectionReplace(collectionName: string, sourceDb: NonNullable<(typeof primaryConnection.db)>, targetDb: NonNullable<(typeof primaryConnection.db)>) {
  const docs = await sourceDb.collection(collectionName).find({}).toArray()

  await targetDb.collection(collectionName).deleteMany({})
  if (docs.length > 0) {
    await targetDb.collection(collectionName).insertMany(docs, { ordered: false })
  }

  return docs.length
}

async function syncCollectionUpsert(collectionName: string, sourceDb: NonNullable<(typeof primaryConnection.db)>, targetDb: NonNullable<(typeof primaryConnection.db)>) {
  const docs = await sourceDb.collection(collectionName).find({}).toArray()

  if (docs.length === 0) {
    return 0
  }

  const operations = docs.map((doc) => ({
    replaceOne: {
      filter: { _id: doc._id },
      replacement: doc,
      upsert: true,
    },
  }))

  await targetDb.collection(collectionName).bulkWrite(operations, { ordered: false })
  return docs.length
}

function normalizeSyncOptions(options: SyncOptions = {}): Required<SyncOptions> {
  const from = validateCluster(options.from, 'primary')
  const to = validateCluster(options.to, from === 'primary' ? 'secondary' : 'primary')
  const mode = validateMode(options.mode)

  return {
    from,
    to,
    mode,
  }
}

export async function runSync(options: SyncOptions = {}) {
  const { from, to, mode } = normalizeSyncOptions(options)

  if (from === to) {
    throw new Error('Source and target clusters must be different.')
  }

  await connectDB()

  const source = getConnection(from)
  const target = getConnection(to)

  if (source.readyState !== 1 || !source.db) {
    throw new Error(`${from} cluster is offline. Cannot sync from it.`)
  }

  if (target.readyState !== 1 || !target.db) {
    throw new Error(`${to} cluster is offline. Cannot sync to it.`)
  }

  const sourceDb = source.db
  const targetDb = target.db

  if (mode === 'replace') {
    console.log(`[SYNC] replace mode: dropping target DB on ${to} before copying...`)
    await targetDb.dropDatabase()
  }

  const collections = await sourceDb.listCollections({}, { nameOnly: true }).toArray()
  const collectionNames = collections
    .map((entry) => entry.name)
    .filter((name): name is string => Boolean(name) && !EXCLUDED_COLLECTIONS.has(name))

  let totalDocuments = 0

  for (const collectionName of collectionNames) {
    const copied =
      mode === 'replace'
        ? await syncCollectionReplace(collectionName, sourceDb, targetDb)
        : await syncCollectionUpsert(collectionName, sourceDb, targetDb)

    totalDocuments += copied
    console.log(`[SYNC] ${collectionName}: ${copied} documents`) 
  }

  console.log(`[SYNC] Complete. ${from} -> ${to}. Collections: ${collectionNames.length}, documents processed: ${totalDocuments}`)
}

async function runFromCli() {
  const from = validateCluster(parseArg('from'), 'primary')
  const to = validateCluster(parseArg('to'), from === 'primary' ? 'secondary' : 'primary')
  const mode = validateMode(parseArg('mode'))

  await runSync({ from, to, mode })
}

const entryUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : ''
const isDirectRun = import.meta.url === entryUrl

if (isDirectRun) {
  runFromCli()
    .then(async () => {
      await closeDbConnections()
      process.exit(0)
    })
    .catch(async (error) => {
      console.error('[SYNC] Failed:', error)
      await closeDbConnections()
      process.exit(1)
    })
}
