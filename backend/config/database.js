import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  try {
    const MongoUri = process.env.MONGO_URI;
    const conn = await mongoose.connect(MongoUri);
    console.log("mongodb Successfully connected 👌");
  } catch (err) {
    console.error("erreur ", err.message);
    process.exit(1);
  }
};

// removed default export
