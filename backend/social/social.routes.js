// ============================================================================
// FICHIER : backend 2/social/social.routes.js
// RÔLE : Définition des routes Express du réseau d'amis, avis et likes (/api/v1/social)
// ============================================================================

import { Router } from "express";
import * as socialController from "./social.controller.js";
import { protect } from "../auth/auth.middleware.js";

const router = Router();

// Routes publiques (Avis et partages)
router.get("/reviews/:productId", socialController.getReviews);
router.get("/share/:productId", socialController.shareProduct);

// Routes protégées par authentification
router.post("/friends/request", protect, socialController.requestFriend);
router.put("/friends/respond", protect, socialController.respondFriend);
router.get("/friends/my-list", protect, socialController.getFriends);

router.post("/reviews", protect, socialController.postReview);
router.put("/reviews/:reviewId/like", protect, socialController.likeReview);

export default router;
