// ============================================================================
// FICHIER : backend 2/chat/chat.dto.js
// RÔLE : DTO de validation pour les messages de chat
// ============================================================================

import Joi from "joi";

export const sendMessageDTO = Joi.object({
  roomId: Joi.string().required(),
  text: Joi.string().min(1).required(),
  receiverId: Joi.string().optional(),
});
