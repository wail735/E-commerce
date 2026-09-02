// ============================================================================
// FICHIER : backend 2/contact/contact.model.js
// RÔLE : Schéma Mongoose pour les messages reçus du formulaire de contact
// ============================================================================

import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    // Nom et prénom de l'expéditeur
    name: {
      type: String,
      required: [true, "Le nom est obligatoire"],
      trim: true,
    },
    // Adresse email de l'expéditeur
    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      lowercase: true,
      trim: true,
    },
    // Numéro de téléphone optionnel
    phone: {
      type: String,
      default: "",
    },
    // Sujet de la demande
    subject: {
      type: String,
      required: [true, "Le sujet est obligatoire"],
      trim: true,
    },
    // Contenu détaillé du message de contact
    message: {
      type: String,
      required: [true, "Le message est obligatoire"],
    },
    // Statut de traitement ('unread', 'read', 'replied')
    status: {
      type: String,
      enum: ["unread", "read", "replied"],
      default: "unread",
    },
    // Réponse apportée par l'administrateur
    replyMessage: {
      type: String,
      default: "",
    },
    // Horodatage de la réponse envoyée
    repliedAt: Date,
  },
  {
    timestamps: true,
  }
);

export const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);
export default Contact;
