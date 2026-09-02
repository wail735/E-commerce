// ============================================================================
// FICHIER : backend 2/config/settings.model.js
// RÔLE : Modèle Mongoose des Réglages Dynamiques de la Plateforme (SuperAdmin)
// ============================================================================

import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    // Taux de commission prélevé par la plateforme sur chaque vente (%)
    commissionRate: {
      type: Number,
      required: true,
      default: 5, // 5% par défaut
      min: 0,
      max: 100,
    },
    // Prix fixe unique pour souscrire directement à une Boutique Pro (€)
    proShopStandalonePrice: {
      type: Number,
      required: true,
      default: 29.99,
    },
    // Plans d'abonnement qui incluent gratuitement l'accès Boutique Pro
    proShopIncludedInPlans: {
      type: [String],
      default: ["pro", "enterprise"],
    },
    // Configuration dynamique des tarifs et avantages des abonnements
    subscriptionPlans: [
      {
        name: { type: String, required: true }, // basic, premium, pro, enterprise
        price: { type: Number, required: true },
        discountRate: { type: Number, default: 0 },
        coinsBonus: { type: Number, default: 0 },
        noAds: { type: Boolean, default: true },
        includesProShop: { type: Boolean, default: false },
        features: [String],
      },
    ],
    // Configuration dynamique des packs de coins disponibles à l'achat
    coinPackages: [
      {
        id: { type: String, required: true },
        coins: { type: Number, required: true },
        priceEuros: { type: Number, required: true },
      },
    ],
    // Nombre maximal d'articles qu'un utilisateur gratuit (non Boutique Pro) peut publier
    freeUserProductLimit: {
      type: Number,
      default: 3, // 3 annonces/produits gratuits par défaut
    },
    // Coordonnées bancaires officielles configurables par le SuperAdmin
    bankDetails: {
      algerianRib: {
        bankName: { type: String, default: "Banque Nationale d'Algérie (BNA) / BDL" },
        ownerName: { type: String, default: "AliExpress Clone SARL" },
        rib: { type: String, default: "00100 234567890123456 78" },
        agency: { type: String, default: "Alger Centre" },
      },
      algerianRip: {
        ownerName: { type: String, default: "AliExpress Clone E-Commerce" },
        ccpAccount: { type: String, default: "1234567 Clé 89" },
        rip: { type: String, default: "00799999000123456789 22" },
      },
      visaAccount: {
        bankName: { type: String, default: "Paysera / Wise International Bank" },
        ownerName: { type: String, default: "AliExpress Clone Global" },
        iban: { type: String, default: "LT12 3456 7890 1234 5678" },
        swift: { type: String, default: "PAYSLT21XXX" },
      },
    },
    // Clef d'API ou URL du serveur Ollama pour l'auto-complétion intelligente
    ollamaConfig: {
      apiUrl: { type: String, default: process.env.OLLAMA_API_URL || "http://localhost:11434" },
      apiKey: { type: String, default: process.env.OLLAMA_API_KEY || "" },
      model: { type: String, default: process.env.OLLAMA_MODEL || "llama3" },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Fonction statique pour récupérer ou initialiser les configurations système par défaut
 */
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      commissionRate: 5,
      proShopStandalonePrice: 29.99,
      proShopIncludedInPlans: ["pro", "enterprise"],
      subscriptionPlans: [
        { name: "basic", price: 4.99, discountRate: 5, coinsBonus: 50, noAds: true, includesProShop: false, features: ["Support Standard", "5% de réduction", "Sans Pubs"] },
        { name: "premium", price: 9.99, discountRate: 10, coinsBonus: 150, noAds: true, includesProShop: false, features: ["Support Prioritaire", "10% de réduction", "Sans Pubs"] },
        { name: "pro", price: 19.99, discountRate: 20, coinsBonus: 400, noAds: true, includesProShop: true, features: ["Boutique Pro Incluse", "20% de réduction", "Sans Pubs"] },
        { name: "enterprise", price: 49.99, discountRate: 30, coinsBonus: 1000, noAds: true, includesProShop: true, features: ["Boutique Pro Incluse", "Manager Dédié", "30% de réduction"] },
      ],
      coinPackages: [
        { id: "pack_100", coins: 100, priceEuros: 1.00 },
        { id: "pack_500", coins: 500, priceEuros: 4.50 },
        { id: "pack_1000", coins: 1000, priceEuros: 8.50 },
        { id: "pack_5000", coins: 5000, priceEuros: 39.00 },
      ],
      ollamaConfig: {
        apiUrl: process.env.OLLAMA_API_URL || "http://localhost:11434",
        apiKey: process.env.OLLAMA_API_KEY || "",
        model: process.env.OLLAMA_MODEL || "llama3",
      },
    });
  }
  return settings;
};

export const Settings = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);
export default Settings;
