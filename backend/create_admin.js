import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Import your user model (adjust path if needed)
import User from "./users/user.model.js";

mongoose.connect("mongodb://127.0.0.1:27017/moexpress")
  .then(async () => {
    const email = "admin@moexpress.com";
    let adminUser = await User.findOne({ email });
    
    if (adminUser) {
      adminUser.role = "superAdmin";
      await adminUser.save();
      console.log("Existing admin updated to superAdmin.");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      
      adminUser = await User.create({
        name: "Super Admin",
        email: email,
        password: hashedPassword,
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
