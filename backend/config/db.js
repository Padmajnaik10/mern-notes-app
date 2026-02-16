import mongoose from "mongoose";
import dotenv from 'dotenv';

// Load environment variables if not already loaded
dotenv.config();

console.log("ACTUAL MONGO_URI:", process.env.MONGO_URI);


export const connectDB =async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // fail fast
      socketTimeoutMS: 45000,         // keep sockets alive
      maxPoolSize: 10,                // stable pool 
    });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}