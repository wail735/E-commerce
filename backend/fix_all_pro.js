import mongoose from 'mongoose';
import User from './users/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

async function fixAllPro() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.updateMany({}, { 
    $set: { 
      isProShop: true,
      role: 'seller'
    },
    $inc: {
      coins: 1000
    }
  });
  console.log("Tous les utilisateurs ont été mis à jour avec le statut Boutique Pro et 1000 Coins bonus.");
  mongoose.disconnect();
}
fixAllPro();
