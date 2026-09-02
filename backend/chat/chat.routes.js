// ============================================================================
// FICHIER : backend 2/chat/chat.routes.js
// RÔLE : Définition des routes Express pour la messagerie instantanée (/api/v1/chat)
// ============================================================================

import { Router } from "express";
import * as chatController from "./chat.controller.js";
import { protect } from "../auth/auth.middleware.js";

const router = Router();

router.use(protect);

// Initialiser une discussion live avec le proprietaire/vendeur d'un produit
router.post("/initiate-product-chat", chatController.startProductChat);

// Récupération de l'historique de chat d'une salle
router.get("/history/:roomId", chatController.getRoomHistory);

// Récupérer la liste des conversations de l'utilisateur (Boîte de réception)
router.get("/conversations", chatController.getUserConversations);

export default router;
