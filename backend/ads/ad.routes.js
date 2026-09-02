// ============================================================================
// FICHIER : backend 2/ads/ad.routes.js
// RÔLE : Définition des routes Express des publicités (/api/v1/ads)
// ============================================================================

import { Router } from "express";
import * as adController from "./ad.controller.js";
import { protect, authorize } from "../auth/auth.middleware.js";

const router = Router();

// Route publique d'obtention des publicités de la Homepage (avec middleware optionnel pour vérifier si noAds)
router.get("/homepage", adController.getHomepageAds);

// Route réservée aux Vendeurs / Boutiques Pro pour commander un emplacement pub Homepage
router.post("/request-boutique-ad", protect, authorize("seller", "admin", "superAdmin"), adController.requestBoutiqueAd);

// Route pour le vendeur pour récupérer ses propres demandes publicitaires
router.get("/my-ads", protect, authorize("seller", "admin", "superAdmin"), adController.getMyAds);

// Routes réservées au SuperAdmin pour la modération et la gestion globale des pubs
router.get("/admin/all", protect, authorize("superAdmin"), adController.getAllAds);
router.post("/admin/create", protect, authorize("superAdmin"), adController.createAdminAd);
router.put("/admin/:id/review", protect, authorize("superAdmin"), adController.reviewAd);
router.delete("/admin/:id", protect, authorize("superAdmin"), adController.removeAd);

export default router;
