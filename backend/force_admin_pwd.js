import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./users/user.model.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const email = "admin@moexpress.com";
    
    // Hash it here directly
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);
    
    // Use updateOne to completely bypass the Mongoose pre('save') hook
    await User.updateOne(
      { email: email },
      { $set: { password: hashedPassword, role: "superAdmin", isActive: true } }
    );
    
    console.log("Password manually hashed and forced via updateOne!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
