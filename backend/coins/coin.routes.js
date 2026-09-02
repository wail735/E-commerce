// ============================================================================
// FICHIER : backend 2/coins/coin.routes.js
// RÔLE : Définition des routes Express de gestion des coins (/api/v1/coins)
// ============================================================================

import { Router } from "express";
import * as coinController from "./coin.controller.js";
import { protect } from "../auth/auth.middleware.js";

const router = Router();

// Endpoint d'affichage des packs
router.get("/packages", coinController.getPackages);

// Endpoints protégés d'achat et d'historique
router.post("/buy", protect, coinController.buyCoins);
router.get("/history", protect, coinController.getHistory);

export default router;
