// ============================================================================
// FICHIER : backend 2/notifications/notification.controller.js
// RÔLE : Contrôleur HTTP pour la consultation et la mise à jour des notifications
// ============================================================================

import * as notificationService from "./notification.service.js";

/**
 * Obtenir les notifications de l'utilisateur connecté
 */
export const getMyNotifications = async (req, res) => {
  try {
    const data = await notificationService.getUserNotifications(req.user._id, req.query.page, req.query.limit);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Marquer une notification comme lue
 */
export const markNotificationRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user._id);
    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Marquer toutes les notifications comme lues
 */
export const markAllNotificationsRead = async (req, res) => {
  try {
    const result = await notificationService.markAllAsRead(req.user._id);
    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
