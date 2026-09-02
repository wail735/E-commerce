import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import Product from "./products/product.model.js";

dotenv.config();

const testDb = async () => {
  try {
    await connectDB();
    const products = await Product.find({}).lean();
    console.log(JSON.stringify(products.map(p => p.images), null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

testDb();
