// ============================================================================
// FICHIER : backend 2/orders/order.dto.js
// RÔLE : Schémas de validation Joi pour la création et mise à jour des commandes
// ============================================================================

import Joi from "joi";

/**
 * DTO de création d'une commande
 */
export const createOrderDTO = Joi.object({
  paymentMethod: Joi.string().valid("card", "coins", "paypal").required(),
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
});

/**
 * DTO de mise à jour du statut d'une commande (Admin)
 */
export const updateOrderStatusDTO = Joi.object({
  status: Joi.string()
    .valid("pending", "processing", "shipped", "delivered", "cancelled")
    .required(),
  trackingNumber: Joi.string().allow(""),
});
