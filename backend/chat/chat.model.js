// ============================================================================
// FICHIER : backend 2/chat/chat.model.js
// RÔLE : Schéma Mongoose pour les messages de chat en temps réel (WebSockets)
// ============================================================================

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    // Identifiant de la salle de discussion (ex: "room_user123_support" ou "product_456")
    roomId: {
      type: String,
      required: true,
      index: true,
    },
    // Expéditeur du message (Utilisateur, Admin, Vendeur)
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Destinataire optionnel
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Contenu texte du message
    text: {
      type: String,
      required: true,
      trim: true,
    },
    // État de lecture (lu / non lu)
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model("Message", messageSchema);
export default Message;
