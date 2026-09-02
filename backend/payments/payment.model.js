// ============================================================================
// FICHIER : backend 2/payments/payment.model.js
// RÔLE : Schéma Mongoose pour les Transactions Multimodes (Stripe, RIB, RIP/CCP, Visa, Preuves)
// ============================================================================

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // Client qui règle la transaction
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Type d'achat ('order', 'subscription', 'ad_campaign', 'coins_pack')
    paymentType: {
      type: String,
      enum: ["order", "subscription", "ad_campaign", "coins_pack"],
      required: true,
    },
    // Référence vers la commande, pub ou plan d'abonnement
    referenceId: {
      type: String,
      required: true,
    },
    // Montant en Euros ou Dinars
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "EUR",
    },
    // Méthode choisie ('stripe', 'algerian_rib', 'poste_algerienne_rip', 'visa_card', 'coins')
    method: {
      type: String,
      enum: ["stripe", "algerian_rib", "poste_algerienne_rip", "visa_card", "coins"],
      required: true,
    },
    // Statut de validation de la transaction ('pending', 'approved', 'rejected', 'completed')
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    // Image ou PDF du virement bancaire / récépissé CCP téléversé comme preuve
    proofImage: {
      type: String,
      default: "",
    },
    // Motif du refus par le SuperAdmin
    rejectionReason: {
      type: String,
      default: "",
    },
    // Identifiant de la session Stripe Checkout
    stripeSessionId: String,
    // Identifiant de paiement Stripe PaymentIntent
    stripePaymentIntentId: String,
    // Validation par SuperAdmin
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default Payment;
