// ============================================================================
// FICHIER : backend 2/coins/coin.controller.js
// RÔLE : Contrôleur des endpoints de gestion des coins
// ============================================================================

import * as coinService from "./coin.service.js";
import { buyCoinsDTO } from "./coin.dto.js";

/**
 * Obtenir les packs de coins disponibles
 */
export const getPackages = async (req, res) => {
  try {
    const packages = await coinService.getAvailableCoinPackages();
    return res.status(200).json({ success: true, data: packages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Acheter des coins
 */
export const buyCoins = async (req, res) => {
  try {
    const { error, value } = buyCoinsDTO.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const result = await coinService.buyCoins(req.user._id, value.packageId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Historique des transactions
 */
export const getHistory = async (req, res) => {
  try {
    const history = await coinService.getCoinHistory(req.user._id);
    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
