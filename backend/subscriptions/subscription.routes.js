// ============================================================================
// FICHIER : backend 2/subscriptions/subscription.routes.js
// RÔLE : Définition des routes Express d'abonnement (/api/v1/subscriptions)
// ============================================================================

import { Router } from "express";
import * as subscriptionController from "./subscription.controller.js";
import { protect } from "../auth/auth.middleware.js";

const router = Router();

// Route publique pour voir les offres
router.get("/plans", subscriptionController.getPlans);

// Route protégée pour souscrire
router.post("/subscribe", protect, subscriptionController.subscribe);

export default router;
