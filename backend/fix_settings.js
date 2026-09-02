import mongoose from 'mongoose';
import Settings from './config/settings.model.js';
import dotenv from 'dotenv';
dotenv.config();

async function fixSettings() {
  await mongoose.connect(process.env.MONGO_URI);
  let settings = await Settings.findOne();
  if (settings) {
    settings.coinPackages = [
      { id: "pack_100", coins: 100, priceEuros: 1.00 },
      { id: "pack_500", coins: 500, priceEuros: 4.50 },
      { id: "pack_1000", coins: 1000, priceEuros: 8.50 },
      { id: "pack_5000", coins: 5000, priceEuros: 39.00 },
    ];
    await settings.save();
    console.log("Settings updated with coin packages.");
  } else {
    settings = new Settings({
      coinPackages: [
        { id: "pack_100", coins: 100, priceEuros: 1.00 },
        { id: "pack_500", coins: 500, priceEuros: 4.50 },
        { id: "pack_1000", coins: 1000, priceEuros: 8.50 },
        { id: "pack_5000", coins: 5000, priceEuros: 39.00 },
      ]
    });
    await settings.save();
    console.log("New settings created with coin packages.");
  }
  mongoose.disconnect();
}
fixSettings();
