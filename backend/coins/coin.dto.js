// ============================================================================
// FICHIER : backend 2/coins/coin.dto.js
// RÔLE : DTO d'achat de packs de coins
// ============================================================================

import Joi from "joi";

export const buyCoinsDTO = Joi.object({
  packageId: Joi.string().valid("pack_100", "pack_500", "pack_1000", "pack_5000").required(),
});
