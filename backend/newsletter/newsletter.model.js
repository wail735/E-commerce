// ============================================================================
// FICHIER : backend 2/newsletter/newsletter.model.js
// RÔLE : Schéma Mongoose pour les abonnés à la lettre d'information (Newsletter)
// ============================================================================

import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    // Adresse email unique de l'abonné
    email: {
      type: String,
      required: [true, "L'adresse email est obligatoire"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Statut d'activation de l'abonnement
    isActive: {
      type: Boolean,
      default: true,
    },
    // Horodatage de souscription
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    // Horodatage de désinscription (si l'utilisateur s'est désabonné)
    unsubscribedAt: Date,
  },
  {
    timestamps: true,
  }
);

export const Newsletter = mongoose.models.Newsletter || mongoose.model("Newsletter", newsletterSchema);
export default Newsletter;
