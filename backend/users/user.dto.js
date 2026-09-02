// ============================================================================
// FICHIER : backend 2/users/user.dto.js
// RÔLE : Schémas de validation Joi pour le panier et la liste de souhaits (DTOs)
// ============================================================================

import Joi from "joi";

/**
 * DTO d'ajout d'un article au panier (Cart)
 */
export const addToCartDTO = Joi.object({
  productId: Joi.string().required().messages({
    "string.empty": "L'ID du produit est obligatoire",
  }),
  quantity: Joi.number().integer().min(1).default(1),
});

/**
 * DTO de mise à jour de quantité au panier
 */
export const updateCartQuantityDTO = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});

/**
 * DTO d'action Wishlist (ajouter/retirer)
 */
export const wishlistActionDTO = Joi.object({
  productId: Joi.string().required(),
});
