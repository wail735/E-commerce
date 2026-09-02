// ============================================================================
// FICHIER : backend 2/notifications/notification.service.js
// RÔLE : Service de gestion des notifications (BDD, WebSockets et Email)
// ============================================================================

import Notification from "./notification.model.js";
import User from "../users/user.model.js";
import { sendEmail } from "../config/email.js";
import { getIO } from "../config/socket.js";

/**
 * Créer une notification enregistrée en BDD, diffusée en temps réel via WebSockets et envoyée par email
 */
export const createNotification = async ({
  recipientId,
  senderId = null,
  title,
  message,
  type = "system",
  link = "",
  sendEmailNotification = true,
}) => {
  // 1. Enregistre la notification dans MongoDB
  const notification = await Notification.create({
    recipient: recipientId,
    sender: senderId,
    title,
    message,
    type,
    link,
  });

  // 2. Émission en temps réel via WebSockets vers la socket du destinataire
  try {
    const io = getIO();
    if (io) {
      io.to(recipientId.toString()).emit("new_notification", notification);
    }
  } catch (socketError) {
    // Ne bloque pas si le serveur websocket n'est pas prêt
    console.warn("⚠️ Emission notification WebSocket ignorée :", socketError.message);
  }

  // 3. Envoi d'un email de notification si demandé et si l'utilisateur possède un email valide
  if (sendEmailNotification) {
    try {
      const recipientUser = await User.findById(recipientId);
      if (recipientUser && recipientUser.email) {
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; max-width: 600px;">
            <h2 style="color: #e62e04;">🔔 ${title}</h2>
            <p style="font-size: 15px; color: #333;">Bonjour <strong>${recipientUser.name}</strong>,</p>
            <p style="font-size: 14px; color: #555;">${message}</p>
            ${
              link
                ? `<a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #e62e04; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 15px;">Consulter sur le site</a>`
                : ""
            }
            <hr style="margin-top: 25px; border: 0; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #999;">Notification automatique envoyée par votre plateforme e-commerce.</p>
          </div>
        `;

        // Envoi asynchrone non bloquant de l'email
        sendEmail({
          to: recipientUser.email,
          subject: `🔔 ${title}`,
          html: htmlContent,
        }).catch((err) => console.error("❌ Erreur d'envoi email notification :", err.message));
      }
    } catch (emailError) {
      console.error("❌ Erreur recherche utilisateur pour notification email :", emailError.message);
    }
  }

  return notification;
};

/**
 * Obtenir toutes les notifications d'un utilisateur avec pagination
 */
export const getUserNotifications = async (userId, page = 1, limit = 20) => {
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Notification.countDocuments({ recipient: userId });
  const unreadCount = await Notification.countDocuments({ recipient: userId, isRead: false });

  const notifications = await Notification.find({ recipient: userId })
    .populate("sender", "name email role")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    notifications,
    total,
    unreadCount,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  };
};

/**
 * Marquer une notification spécifique comme lue
 */
export const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({ _id: notificationId, recipient: userId });
  if (!notification) {
    throw new Error("Notification non trouvée");
  }

  notification.isRead = true;
  await notification.save();
  return notification;
};

/**
 * Marquer toutes les notifications d'un utilisateur comme lues
 */
export const markAllAsRead = async (userId) => {
  await Notification.updateMany({ recipient: userId, isRead: false }, { $set: { isRead: true } });
  return { message: "Toutes les notifications ont été marquées comme lues." };
};

export default {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
