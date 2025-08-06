import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    // The fix is to remove the outdated options.
    // The modern Mongoose library handles these settings automatically.
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;