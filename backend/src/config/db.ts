import mongoose from 'mongoose';
import { setServers } from 'node:dns';

// Apply DNS resolvers for every process that connects to MongoDB (API, migrate, seed).
setServers(['1.1.1.1', '8.8.8.8']);

// Instantiate connections at the module level so your models can import them
const primaryConnection = mongoose.createConnection();
const backupConnection = mongoose.createConnection();

function getActiveConnection() {
  if (primaryConnection.readyState === 1) {
    return primaryConnection;
  }

  if (backupConnection.readyState === 1) {
    return backupConnection;
  }

  return null;
}

async function closeDbConnections() {
  await Promise.allSettled([primaryConnection.close(), backupConnection.close()]);
}

async function connectDB() {
  const primaryUri = process.env.MONGO_URI;
  const secondaryUri = process.env.MONGO_URI_SECONDARY;
  const dbName = process.env.MONGO_DB_NAME || 'barbellbites';

  if (!primaryUri || !secondaryUri) {
    console.error('CRITICAL: Both MONGO_URI and MONGO_URI_SECONDARY must be defined in environment variables');
    process.exit(1);
  }

  // 1. Attempt to connect to the Primary Database
  try {
    await primaryConnection.openUri(primaryUri, { 
      dbName,
      serverSelectionTimeoutMS: 3000 
    });
    await primaryConnection.db?.admin().command({ ping: 1 });
    console.log(`🟢 Primary MongoDB connected: ${primaryConnection.host}/${primaryConnection.name}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`🔴 Primary MongoDB is currently offline (${message}).`);
  }

  // 2. Attempt to connect to the Backup Database
  try {
    await backupConnection.openUri(secondaryUri, { 
      dbName,
      serverSelectionTimeoutMS: 3000 
    });
    await backupConnection.db?.admin().command({ ping: 1 });
    console.log(`🟢 Backup MongoDB connected: ${backupConnection.host}/${backupConnection.name}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`🔴 Backup MongoDB is currently offline (${message}).`);
  }
}

export { connectDB, primaryConnection, backupConnection, getActiveConnection, closeDbConnections };