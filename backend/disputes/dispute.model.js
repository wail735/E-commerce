// ============================================================================
// FICHIER : backend 2/disputes/dispute.model.js
// RÔLE : Schéma Mongoose pour le Centre de Résolution de Conflits et Litiges
// ============================================================================

import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema(
  {
    // Commande faisant l'objet du litige
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    // Acheteur ayant ouvert le conflit
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Vendeur mis en cause
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Motif du conflit ('fraud', 'non_delivery', 'damaged', 'wrong_item', 'defective')
    reason: {
      type: String,
      enum: ["fraud", "non_delivery", "damaged", "wrong_item", "defective"],
      required: true,
    },
    // Description détaillée du problème rencontré
    description: {
      type: String,
      required: [true, "La description du problème est obligatoire"],
    },
    // Fichiers/photos de preuve téléversés par l'acheteur ou le vendeur
    evidenceImages: [String],
    // Réponse ou défense argumentée apportée par le vendeur
    sellerResponse: {
      type: String,
      default: "",
    },
    // Statut du litige ('open', 'under_review', 'resolved_refund', 'resolved_seller_paid', 'closed')
    status: {
      type: String,
      enum: ["open", "under_review", "resolved_refund", "resolved_seller_paid", "closed"],
      default: "open",
    },
    // Décision prise par l'administration lors de l'arbitrage
    adminDecision: {
      type: String,
      default: "",
    },
    // Administrateur ayant statué sur le litige
    arbitratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Dispute = mongoose.models.Dispute || mongoose.model("Dispute", disputeSchema);
export default Dispute;
