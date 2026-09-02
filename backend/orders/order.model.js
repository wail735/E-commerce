// ============================================================================
// FICHIER : backend 2/orders/order.model.js
// RÔLE : Schémas Mongoose pour les commandes, commissions et revenus vendeurs
// ============================================================================

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // Client ayant passé la commande
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Liste des articles commandés avec le vendeur associé
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // Prix unitaire au moment de l'achat
      },
    ],
    // Montant sous-total
    subtotal: { type: Number, required: true },
    // Réduction appliquée grâce à l'abonnement
    discountAmount: { type: Number, default: 0 },
    // Montant de la commission prélevée par la plateforme (ex: 5%)
    platformCommission: { type: Number, default: 0 },
    // Montant net reversé aux vendeurs
    sellerEarnings: { type: Number, default: 0 },
    // Montant total final réglé
    totalAmount: { type: Number, required: true },
    // Méthode de paiement (carte bancaire ou échange de coins)
    paymentMethod: {
      type: String,
      enum: ["card", "coins", "paypal"],
      required: true,
    },
    // Statut du paiement
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    // Statut de traitement et suivi de la livraison (Tracking)
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    // Numéro de suivi du colis (Tracking Number)
    trackingNumber: {
      type: String,
      default: "",
    },
    // Adresse de livraison
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  },
);

export const Order = mongoose.model("Order", orderSchema);
export default Order;
