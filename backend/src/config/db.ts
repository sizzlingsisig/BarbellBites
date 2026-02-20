import mongoose from 'mongoose';

async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    const dbName = process.env.MONGO_DB_NAME || process.env.MONGO_DB || 'barbellbites';

    if (!uri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const connection = await mongoose.connect(uri, { dbName });
    await connection.connection.db?.admin().command({ ping: 1 });
    console.log(`MongoDB connected: ${connection.connection.host}/${connection.connection.name}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to connect to MongoDB: ${message}`);
    process.exit(1);
  }
}

export { connectDB };