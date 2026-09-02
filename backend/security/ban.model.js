// ============================================================================
// FICHIER : backend 2/security/ban.model.js
// RÔLE : Schéma Mongoose pour le blocage de sécurité par IP et par Email (SuperAdmin Blacklist)
// ============================================================================

import mongoose from "mongoose";

const banSchema = new mongoose.Schema(
  {
    // Type de blocage : 'ip' (Adresse IP) ou 'email' (Adresse email)
    type: {
      type: String,
      enum: ["ip", "email"],
      required: true,
    },
    // Valeur de l'adresse IP (ex: "192.168.1.50") ou de l'email (ex: "spammer@bad.com")
    value: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Motif du bannissement
    reason: {
      type: String,
      default: "Violation des conditions d'utilisation",
    },
    // Administrateur ayant prononcé le bannissement
    bannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export const Ban = mongoose.models.Ban || mongoose.model("Ban", banSchema);
export default Ban;
