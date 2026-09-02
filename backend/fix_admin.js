import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./users/user.model.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const email = "admin@moexpress.com";
    let adminUser = await User.findOne({ email });
    
    if (adminUser) {
      adminUser.password = "admin123";
      await adminUser.save();
      console.log("Admin password reset successfully.");
    } else {
      adminUser = await User.create({
        name: "Super Admin",
        email: email,
        password: "admin123",
        role: "superAdmin",
        isActive: true,
      });
      console.log("New admin created.");
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
