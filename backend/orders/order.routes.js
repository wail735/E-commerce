// ============================================================================
// FICHIER : backend 2/orders/order.routes.js
// RÔLE : Définition des routes Express des commandes et du suivi (/api/v1/orders)
// ============================================================================

import { Router } from "express";
import * as orderController from "./order.controller.js";
import { protect, authorize } from "../auth/auth.middleware.js";

const router = Router();

// Toutes les routes nécessitent un token d'authentification JWT (protect)
router.use(protect);

// Créer une commande (Checkout)
router.post("/", orderController.createOrder);

// Obtenir mes commandes (Client)
router.get("/my-orders", orderController.getMyOrders);

// Obtenir mes commandes reçues (Vendeur)
router.get(
  "/seller-orders",
  authorize("seller", "admin", "superAdmin"),
  orderController.getSellerOrders
);

// Obtenir les stats du vendeur
router.get(
  "/seller/stats",
  authorize("seller", "admin", "superAdmin"),
  orderController.getSellerStats
);

// Mettre à jour le statut d'une commande (Vendeur)
router.put(
  "/:id/seller-status",
  authorize("seller", "admin", "superAdmin"),
  orderController.updateSellerOrderStatus
);

// Suivre une commande (Order Tracking)
router.get("/track/:id", orderController.trackOrder);

// Mettre à jour le statut d'une commande (Admin / SuperAdmin)
router.put(
  "/:id/status",
  authorize("admin", "superAdmin"),
  orderController.updateOrderStatus,
);

export default router;
