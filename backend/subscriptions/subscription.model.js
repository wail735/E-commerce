// ============================================================================
// FICHIER : backend 2/subscriptions/subscription.model.js
// RÔLE : Schéma Mongoose pour la définition des plans d'abonnement
// ============================================================================

import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema(
  {
    // Nom du plan (basic, premium, pro, enterprise)
    name: {
      type: String,
      required: true,
      enum: ["basic", "premium", "pro", "enterprise"],
      unique: true,
    },
    // Prix du forfait mensuel en Euros
    monthlyPrice: {
      type: Number,
      required: true,
    },
    // Pourcentage de réduction offert sur tous les achats (ex: 10 pour 10%, 20 pour 20%)
    discountPercentage: {
      type: Number,
      required: true,
      default: 0,
    },
    // Nombre de coins offerts chaque mois avec l'abonnement
    monthlyCoinsBonus: {
      type: Number,
      required: true,
      default: 0,
    },
    // Liste des avantages décrits
    features: [String],
  },
  {
    timestamps: true,
  },
);

export const SubscriptionPlan = mongoose.model(
  "SubscriptionPlan",
  subscriptionPlanSchema,
);
export default SubscriptionPlan;
