// ============================================================================
// FICHIER : backend 2/support/support.model.js
// RÔLE : Schéma Mongoose pour les tickets de support client
// ============================================================================

import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
  {
    // Utilisateur ayant ouvert le ticket de support
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Sujet de la demande
    subject: {
      type: String,
      required: [true, "Le sujet est obligatoire"],
      trim: true,
    },
    // Message détaillé
    message: {
      type: String,
      required: [true, "Le message est obligatoire"],
    },
    // Niveau de priorité (low, medium, high, urgent)
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    // Statut du ticket
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    // Réponse apportée par l'administrateur
    adminResponse: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const SupportTicket = mongoose.model(
  "SupportTicket",
  supportTicketSchema,
);
export default SupportTicket;
