import 'dotenv/config'
import { closeDbConnections, connectDB, getActiveConnection } from '../config/db.js'
import type { Migration } from '../migrations/types.js'
import { recipeTaxonomyV2Migration } from '../migrations/001_recipe_taxonomy_v2.js'

const migrations: Migration[] = [recipeTaxonomyV2Migration]

async function runMigrations() {
  await connectDB()

  const activeConnection = getActiveConnection()
  const db = activeConnection?.db
  if (!activeConnection || !db) {
    throw new Error('MongoDB connection is not initialized')
  }

  const migrationCollection = db.collection('_migrations')

  for (const migration of migrations) {
    const existing = await migrationCollection.findOne({ id: migration.id })
    if (existing) {
      console.log(`Skipping migration ${migration.id} (already applied)`)
      continue
    }

    console.log(`Running migration ${migration.id}: ${migration.description}`)
    await migration.up()
    await migrationCollection.insertOne({
      id: migration.id,
      description: migration.description,
      appliedAt: new Date(),
    })
    console.log(`Finished migration ${migration.id}`)
  }
}

runMigrations()
  .then(async () => {
    console.log('All migrations completed')
    await closeDbConnections()
    process.exit(0)
  })
  .catch(async (error) => {
    console.error('Migration failed:', error)
    await closeDbConnections()
    process.exit(1)
  })
