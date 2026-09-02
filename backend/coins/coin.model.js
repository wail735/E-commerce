// ============================================================================
// FICHIER : backend 2/coins/coin.model.js
// RÔLE : Schéma Mongoose pour les transactions de coins (Monnaie virtuelle)
// ============================================================================

import mongoose from "mongoose";

const coinTransactionSchema = new mongoose.Schema(
  {
    // Utilisateur effectuant la transaction
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Nombre de coins ajoutés ou dépensés
    amount: {
      type: Number,
      required: true,
    },
    // Type de mouvement ('buy' = achat par argent réel, 'spend' = achat produit, 'bonus' = allocation abonnement)
    type: {
      type: String,
      enum: ["buy", "spend", "bonus"],
      required: true,
    },
    // Montant équivalent en Euros réglé (si type === 'buy')
    priceEuros: {
      type: Number,
      default: 0,
    },
    // Description ou motif de la transaction
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const CoinTransaction = mongoose.model("CoinTransaction", coinTransactionSchema);
export default CoinTransaction;
