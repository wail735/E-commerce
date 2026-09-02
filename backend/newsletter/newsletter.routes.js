// ============================================================================
// FICHIER : backend 2/newsletter/newsletter.routes.js
// RÔLE : Définition des routes Express de la newsletter (/api/v1/newsletter)
// ============================================================================

import { Router } from "express";
import * as newsletterController from "./newsletter.controller.js";
import { protect, authorize } from "../auth/auth.middleware.js";

const router = Router();

// Routes publiques : Inscription et désinscription newsletter
router.post("/subscribe", newsletterController.subscribe);
router.post("/unsubscribe", newsletterController.unsubscribe);

// Routes réservées au SuperAdmin : Consultation abonnés et diffusion de campagnes email
router.get("/admin/subscribers", protect, authorize("superAdmin"), newsletterController.getSubscribers);
router.post("/admin/send-campaign", protect, authorize("superAdmin"), newsletterController.sendCampaign);

export default router;
