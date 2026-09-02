// ============================================================================
// FICHIER : backend 2/contact/contact.routes.js
// RÔLE : Définition des routes Express du formulaire de contact (/api/v1/contact)
// ============================================================================

import { Router } from "express";
import * as contactController from "./contact.controller.js";
import { protect, authorize } from "../auth/auth.middleware.js";

const router = Router();

// Route publique : Soumission du formulaire de contact par un visiteur ou client
router.post("/", contactController.submitContact);

// Routes réservées au SuperAdmin : Lecture et réponse aux messages de contact
router.get("/admin/messages", protect, authorize("superAdmin"), contactController.getMessages);
router.put("/admin/:id/reply", protect, authorize("superAdmin"), contactController.replyMessage);

export default router;
