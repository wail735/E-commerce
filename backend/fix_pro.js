import mongoose from 'mongoose';
import User from './users/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

async function fixUserPro() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email: 'admin@moexpress.com' });
  if (user) {
    user.isProShop = true;
    user.coins = (user.coins || 0) + 1000; // Donner des coins bonus
    user.role = 'seller';
    await user.save();
    console.log("SuperAdmin mis à jour avec le statut Boutique Pro et 1000 Coins.");
  } else {
    console.log("Utilisateur non trouvé.");
  }
  mongoose.disconnect();
}
fixUserPro();
