import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

const PORT = parseInt(process.env.PORT, 10) || 5000;

// Start server listening on all IPv4 addresses
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🚀 mintGig Server running on port ${PORT}`);
  console.log(`📡 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/v1/health`);
  console.log(`=======================================================`);
});

// Attempt database connection
connectDB().catch((err) => {
  console.warn(`⚠️ Running with database disconnected. Update MONGO_URI in .env to connect.`);
});

export default app;
