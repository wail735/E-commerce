// ============================================================================
// FICHIER : backend 2/support/support.routes.js
// RÔLE : Définition des routes Express du support client (/api/v1/support)
// ============================================================================

import { Router } from "express";
import * as supportController from "./support.controller.js";
import { protect, authorize } from "../auth/auth.middleware.js";

const router = Router();

router.use(protect);

// Créer un ticket de support
router.post("/ticket", supportController.createTicket);

// Obtenir mes tickets
router.get("/my-tickets", supportController.getMyTickets);

// Répondre à un ticket (Admin / SuperAdmin)
router.put(
  "/ticket/:id/reply",
  authorize("admin", "superAdmin"),
  supportController.replyTicket,
);
// Obtenir tous les tickets (Admin / SuperAdmin)
router.get(
  "/admin/all",
  authorize("admin", "superAdmin"),
  supportController.getAllTickets
);

export default router;
