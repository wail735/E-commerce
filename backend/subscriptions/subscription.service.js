// ============================================================================
// FICHIER : backend 2/subscriptions/subscription.service.js
// RÔLE : Logique métier des abonnements (Tarification dynamique, Sans Pubs, Boutique Pro & Coins)
// ============================================================================

import User from "../users/user.model.js";
import Settings from "../config/settings.model.js";
import { createNotification } from "../notifications/notification.service.js";

/**
 * Souscrire ou changer de plan d'abonnement avec tarification dynamique
 */
export const subscribeToPlan = async (userId, planName) => {
  const user = await User.findById(userId);
  const settings = await Settings.getSettings();

  // Recherche la configuration dynamique du plan dans les réglages système
  const planDetails = settings.subscriptionPlans.find(
    (p) => p.name.toLowerCase() === planName.toLowerCase(),
  );

  if (!planDetails) {
    throw new Error(
      `Le plan d'abonnement [${planName}] est invalide ou n'existe plus.`,
    );
  }

  // 1. Calcule la date d'expiration (30 jours à compter d'aujourd'hui)
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);

  // 2. Met à jour le profil de l'utilisateur avec son nouveau plan, son taux de réduction et l'option Sans Pub (noAds)
  user.subscription = {
    plan: planDetails.name,
    expiryDate,
    discountRate: planDetails.discountRate,
  };

  // Activer l'expérience sans pubs (noAds) pour tout abonné payant
  user.noAds = planDetails.noAds !== false;

  // Si le forfait choisi inclut l'accès Boutique Pro (ex: plans Pro et Enterprise)
  if (
    planDetails.includesProShop ||
    settings.proShopIncludedInPlans.includes(planDetails.name)
  ) {
    user.isProShop = true;
    user.role = "seller"; // Accorde immédiatement le rôle Vendeur Pro
    user.proShopDetails = {
      ...user.proShopDetails,
      status: "approved",
      approvedAt: new Date(),
      shopName: user.proShopDetails?.shopName || `Boutique de ${user.name}`,
    };
  }

  // 3. Attribue immédiatement les coins bonus mensuels inclus dans le forfait
  if (planDetails.coinsBonus > 0) {
    user.coins += planDetails.coinsBonus;
  }

  await user.save();

  // Envoi d'une notification de confirmation
  createNotification({
    recipientId: user._id,
    title: "🎉 Abonnement Activé !",
    message: `Vous êtes maintenant abonné au plan [${planDetails.name.toUpperCase()}]. Avantages activés : Sans pub${
      user.isProShop ? ", Accès Boutique Pro" : ""
    }, +${planDetails.coinsBonus} Coins.`,
    type: "system",
    link: "/user/subscription",
    sendEmailNotification: true,
  }).catch((err) => console.error("❌ Erreur notif abonnement :", err.message));

  return {
    message: `Félicitations ! Vous êtes maintenant abonné au plan [${planDetails.name.toUpperCase()}].`,
    subscription: user.subscription,
    noAds: user.noAds,
    isProShop: user.isProShop,
    coinsEarned: planDetails.coinsBonus,
    totalCoins: user.coins,
  };
};

/**
 * Récupérer tous les détails des offres d'abonnement disponibles (Tarifs dynamiques réglés par SuperAdmin)
 */
export const getAvailablePlans = async () => {
  const settings = await Settings.getSettings();
  return settings.subscriptionPlans;
};

export default {
  subscribeToPlan,
  getAvailablePlans,
};
