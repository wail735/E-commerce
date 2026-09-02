// ============================================================================
// FICHIER : backend 2/notifications/notification.routes.js
// RÔLE : Définition des routes Express de gestion des notifications (/api/v1/notifications)
// ============================================================================

import { Router } from "express";
import * as notificationController from "./notification.controller.js";
import { protect } from "../auth/auth.middleware.js";

const router = Router();

// Toutes les routes de notifications nécessitent une authentification
router.use(protect);

router.get("/", notificationController.getMyNotifications);
router.put("/:id/read", notificationController.markNotificationRead);
router.put("/read-all", notificationController.markAllNotificationsRead);

export default router;
