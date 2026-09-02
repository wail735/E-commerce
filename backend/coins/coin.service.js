// ============================================================================
// FICHIER : backend 2/coins/coin.service.js
// RÔLE : Logique métier de gestion des coins avec packs dynamiques
// ============================================================================

import User from "../users/user.model.js";
import CoinTransaction from "./coin.model.js";
import Settings from "../config/settings.model.js";

/**
 * Acheter des coins contre de l'argent réel (Tarification dynamique)
 */
export const buyCoins = async (userId, packageId) => {
  const settings = await Settings.getSettings();
  const selectedPackage = settings.coinPackages.find(
    (pkg) => pkg.id === packageId,
  );

  if (!selectedPackage) {
    throw new Error("Pack de coins invalide ou non disponible.");
  }

  const user = await User.findById(userId);

  // Crédite le solde de coins de l'utilisateur
  user.coins += selectedPackage.coins;
  await user.save();

  // Enregistre l'historique de la transaction
  const transaction = await CoinTransaction.create({
    user: userId,
    amount: selectedPackage.coins,
    type: "buy",
    priceEuros: selectedPackage.priceEuros,
    description: `Achat de ${selectedPackage.coins} coins pour ${selectedPackage.priceEuros} €`,
  });

  return {
    message: `Achat réussi ! ${selectedPackage.coins} coins ajoutés à votre compte.`,
    newBalance: user.coins,
    transaction,
  };
};

/**
 * Récupérer l'historique des transactions de coins de l'utilisateur
 */
export const getCoinHistory = async (userId) => {
  return await CoinTransaction.find({ user: userId }).sort({ createdAt: -1 });
};

/**
 * Liste des packs de coins disponibles à l'achat (Configurés par SuperAdmin)
 */
export const getAvailableCoinPackages = async () => {
  const settings = await Settings.getSettings();
  return settings.coinPackages;
};

export default {
  buyCoins,
  getCoinHistory,
  getAvailableCoinPackages,
};
