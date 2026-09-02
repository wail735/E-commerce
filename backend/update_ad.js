import mongoose from 'mongoose';
import Ad from './ads/ad.model.js';
import dotenv from 'dotenv';
dotenv.config();

async function updateAdUrl() {
  await mongoose.connect(process.env.MONGO_URI);
  const ad = await Ad.findOneAndUpdate(
    { status: 'active' }, 
    { targetUrl: 'http://localhost:5173/product/6a8b50fc532a284c8fa4e386' }, 
    { new: true }
  );
  if (ad) {
    console.log("Lien mis à jour :", ad.targetUrl);
  } else {
    console.log("Aucune publicité active trouvée.");
  }
  mongoose.disconnect();
}
updateAdUrl();
