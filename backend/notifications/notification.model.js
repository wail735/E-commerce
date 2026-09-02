// ============================================================================
// FICHIER : backend 2/notifications/notification.model.js
// RÔLE : Schéma Mongoose pour les notifications du site et Push Temps Réel
// ============================================================================

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // Destinataire de la notification (Client, Vendeur, Admin)
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Expéditeur optionnel (ex: Vendeur, Acheteur, Système)
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Titre court de la notification
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // Contenu explicatif détaillé
    message: {
      type: String,
      required: true,
    },
    // Catégorie de notification ('order_status', 'pro_shop_status', 'ad_status', 'chat_message', 'system', 'commission')
    type: {
      type: String,
      enum: ["order_status", "pro_shop_status", "ad_status", "chat_message", "system", "commission"],
      default: "system",
    },
    // Lien de redirection optionnel au clic sur le site (ex: '/orders/123' ou '/chat/room_456')
    link: {
      type: String,
      default: "",
    },
    // Statut de lecture
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
export default Notification;
