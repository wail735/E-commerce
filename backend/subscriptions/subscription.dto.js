// ============================================================================
// FICHIER : backend 2/subscriptions/subscription.dto.js
// RÔLE : DTO de souscription à un plan d'abonnement
// ============================================================================

import Joi from "joi";

export const subscribeDTO = Joi.object({
  planName: Joi.string()
    .valid("basic", "premium", "pro", "enterprise")
    .required(),
});
