// ============================================================================
// FICHIER : backend 2/disputes/dispute.routes.js
// RÔLE : Définition des routes du Centre de Conflits (/api/v1/disputes)
// ============================================================================

import { Router } from "express";
import * as disputeController from "./dispute.controller.js";
import { protect, authorize } from "../auth/auth.middleware.js";

const router = Router();

router.use(protect);

// Routes Utilisateurs (Acheteurs & Vendeurs)
router.post("/", disputeController.createDispute);
router.get("/my-disputes", disputeController.getMyDisputes);
router.put("/:id/seller-response", disputeController.respondDispute);

// Routes d'Arbitrage réservées au SuperAdmin
router.get("/admin/all", authorize("superAdmin"), disputeController.getAllDisputes);
router.put("/admin/:id/arbitrate", authorize("superAdmin"), disputeController.arbitrate);

export default router;
