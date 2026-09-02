// ============================================================================
// FICHIER : backend 2/products/product.routes.js
// RÔLE : Définition des routes Express des produits et d'auto-complétion (/api/v1/products)
// ============================================================================

import { Router } from "express";
import * as productController from "./product.controller.js";
import { protect, authorize } from "../auth/auth.middleware.js";
import multer from "multer";

const upload = multer({ dest: "uploads/temp/" });

const router = Router();

// Route publique : GET /api/v1/products (Recherche, filtres, pagination)
router.get("/", productController.getProducts);

// Route publique d'auto-complétion intelligente mot par mot / lettre par lettre (Ollama AI + BDD)
router.get("/autocomplete", productController.autocomplete);

// Route publique : GET /api/v1/products/:id (Détails d'un produit)
router.get("/:id", productController.getProductById);

// Route publique : GET /api/v1/products/:id/reviews (Avis d'un produit)
router.get("/:id/reviews", productController.getProductReviews);

// Route client protégé : POST /api/v1/products/:id/reviews (Ajouter un avis)
router.post(
  "/:id/reviews",
  protect,
  productController.createProductReview
);

// Route réservée aux Vendeurs Pro / Admins / SuperAdmin : POST /api/v1/products (Créer un produit avec images)
router.post(
  "/",
  protect,
  authorize("seller", "admin", "superAdmin"),
  upload.array("images", 5),
  productController.createProduct,
);

// Route réservée aux Vendeurs Pro / Admins / SuperAdmin : PUT /api/v1/products/:id (Mettre à jour)
router.put(
  "/:id",
  protect,
  authorize("seller", "admin", "superAdmin"),
  upload.array("images", 5),
  productController.updateProduct,
);

// Route réservée aux Vendeurs Pro / Admins / SuperAdmin : DELETE /api/v1/products/:id (Supprimer)
router.delete(
  "/:id",
  protect,
  authorize("seller", "admin", "superAdmin"),
  productController.deleteProduct,
);

export default router;
