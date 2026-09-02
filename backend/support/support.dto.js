// ============================================================================
// FICHIER : backend 2/support/support.dto.js
// RÔLE : DTO pour la création et réponse aux tickets de support
// ============================================================================

import Joi from "joi";

export const createSupportTicketDTO = Joi.object({
  subject: Joi.string().min(5).max(200).required(),
  message: Joi.string().min(10).required(),
  priority: Joi.string().valid("low", "medium", "high", "urgent").optional(),
});

export const replySupportTicketDTO = Joi.object({
  response: Joi.string().min(2).required(),
  status: Joi.string().valid("in_progress", "resolved", "closed").optional(),
});
