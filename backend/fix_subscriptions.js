import mongoose from 'mongoose';
import Settings from './config/settings.model.js';
import dotenv from 'dotenv';
dotenv.config();

async function fixSubscriptionPlans() {
  await mongoose.connect(process.env.MONGO_URI);
  let settings = await Settings.findOne();
  if (settings) {
    if (!settings.subscriptionPlans || settings.subscriptionPlans.length === 0) {
      settings.subscriptionPlans = [
        { name: "basic", price: 0, discountRate: 0, coinsBonus: 0, noAds: false, includesProShop: false, features: ["Accès basique gratuit", "Support standard"] },
        { name: "premium", price: 9.99, discountRate: 10, coinsBonus: 100, noAds: true, includesProShop: false, features: ["Navigation sans publicités", "10% de réduction sur tout", "+100 MoCoins offerts chaque mois", "Support prioritaire"] },
        { name: "pro", price: 29.99, discountRate: 20, coinsBonus: 500, noAds: true, includesProShop: true, features: ["Tout du Premium", "Boutique Vendeur Pro Incluse", "20% de réduction globale", "+500 MoCoins offerts chaque mois", "Badge Vendeur Certifié"] },
      ];
      await settings.save();
      console.log("Settings updated with subscription plans.");
    } else {
      console.log("Subscription plans already exist.");
    }
  } else {
    console.log("No settings found.");
  }
  mongoose.disconnect();
}
fixSubscriptionPlans();
