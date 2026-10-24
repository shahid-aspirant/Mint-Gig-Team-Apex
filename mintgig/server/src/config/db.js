import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (process.env.SUPABASE_URL) {
    console.log(`📡 Supabase PostgreSQL configured: ${process.env.SUPABASE_URL}`);
  }

  if (!uri) {
    console.log(`ℹ️  No MONGO_URI specified. Operating with Supabase backend.`);
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    if (process.env.SUPABASE_URL) {
      console.log(`ℹ️  Local MongoDB not running. Using Supabase database at ${process.env.SUPABASE_URL}`);
      return null;
    }
    console.error(`❌ Database Connection Error: ${error.message}`);
    throw error;
  }
};

export default connectDB;
