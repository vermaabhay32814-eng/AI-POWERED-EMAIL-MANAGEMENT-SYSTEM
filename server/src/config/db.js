import mongoose from 'mongoose';

let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/email_assistant';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout so local dev without MongoDB doesn't hang
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    isMongoConnected = false;
    console.warn(`[MongoDB] Notice: Could not connect to MongoDB (${error.message}).`);
    console.log(`[Database] Automatically running in Resilient In-Memory Mode with preloaded realistic inbox data.`);
  }
};

export const getDBStatus = () => ({
  connected: isMongoConnected,
  mode: isMongoConnected ? 'MongoDB' : 'In-Memory Store (Resilient Mode)'
});
