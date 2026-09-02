import mongoose from 'mongoose';
import User from './users/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

async function restoreAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const admin = await User.findOne({ email: 'admin@moexpress.com' });
  if (admin) {
    admin.role = 'superAdmin';
    await admin.save();
    console.log("Le compte admin@moexpress.com a retrouvé son rôle de superAdmin !");
  } else {
    console.log("Compte introuvable.");
  }
  mongoose.disconnect();
}
restoreAdmin();
