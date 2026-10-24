import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/mintgig';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`👉 Ensure MongoDB is running locally (e.g. 'mongod' or 'docker run -d -p 27017:27017 mongo')`);
    console.error(`👉 Or set MONGO_URI in 'mintgig/server/.env' to a MongoDB Atlas cluster URI`);
    throw error;
  }
};

export default connectDB;
