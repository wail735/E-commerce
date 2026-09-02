// ============================================================================
// FICHIER : backend 2/ads/ad.service.js
// RÔLE : Logique métier des Publicités (SuperAdmin Manual Ads & Paid Boutique Homepage Promotions)
// ============================================================================

import Ad from "./ad.model.js";
import User from "../users/user.model.js";
import CoinTransaction from "../coins/coin.model.js";
import { createNotification } from "../notifications/notification.service.js";

/**
 * Récupérer les publicités actives pour la page d'accueil (en filtrant si l'utilisateur est abonnée Sans Pubs)
 */
export const getHomepageAds = async (userId = null) => {
  // Vérifie si l'utilisateur connecté bénéficie d'un abonnement Sans Pub (noAds === true)
  if (userId) {
    const user = await User.findById(userId);
    if (user && user.noAds) {
      return {
        noAds: true,
        message: "Expérience Sans Publicité activée grâce à votre abonnement !",
        ads: [],
      };
    }
  }

  const now = new Date();
  // Récupère les publicités actives dont la date de fin n'est pas dépassée
  const ads = await Ad.find({
    isActive: true,
    status: "active",
    $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: now } }],
  })
    .populate("advertiser", "name email proShopDetails")
    .populate("product", "name price images")
    .sort({ createdAt: -1 });

  return {
    noAds: false,
    ads,
  };
};

/**
 * Récupérer les publicités demandées par un vendeur
 */
export const getSellerAds = async (sellerId) => {
  return Ad.find({ advertiser: sellerId }).sort({ createdAt: -1 });
};

/**
 * SuperAdmin crée manuellement une publicité photo ou vidéo sur la plateforme
 */
export const createSuperAdminAd = async ({ title, mediaType, mediaUrl, targetUrl, placement, startDate, endDate }) => {
  const ad = await Ad.create({
    title,
    mediaType,
    mediaUrl,
    targetUrl,
    placement: placement || "homepage_banner",
    type: "super_admin",
    status: "active",
    isActive: true,
    startDate: startDate || new Date(),
    endDate: endDate || null,
  });

  return ad;
};

/**
 * Vendeur Pro soumet une demande payante pour afficher sa Boutique / Produit en pub sur la Homepage
 */
export const requestBoutiqueHomepageAd = async (
  sellerId,
  { title, mediaType, mediaUrl, targetUrl, placement = "homepage_banner", productId = null }
) => {
  const seller = await User.findById(sellerId);
  if (!seller) {
    throw new Error("Vendeur introuvable.");
  }
  
  const AD_COST_COINS = 500;

  if (seller.coins < AD_COST_COINS) {
    throw new Error(`Fonds insuffisants. Vous avez besoin de ${AD_COST_COINS} MoCoins, mais vous n'en avez que ${seller.coins}.`);
  }

  // Déduire les coins
  seller.coins -= AD_COST_COINS;
  await seller.save();

  // Enregistrer la transaction
  await CoinTransaction.create({
    user: sellerId,
    amount: -AD_COST_COINS,
    type: "spend",
    description: `Achat de publicité Homepage (${title || "Boutique"})`
  });

  const ad = await Ad.create({
    title: title || `Publicité Boutique ${seller.proShopDetails?.shopName || seller.name}`,
    mediaType,
    mediaUrl,
    targetUrl: targetUrl || `/shop/${seller._id}`,
    placement,
    type: "boutique_promotion",
    advertiser: sellerId,
    product: productId,
    pricePaid: AD_COST_COINS, // On stocke le coût en Coins
    status: "pending_approval",
    isActive: false,
  });

  // Notifier le SuperAdmin du dépôt de la demande publicitaire
  const superAdmins = await User.find({ role: "superAdmin" });
  for (const admin of superAdmins) {
    createNotification({
      recipientId: admin._id,
      senderId: sellerId,
      title: "📢 Nouvelle demande de publicité Boutique Pro",
      message: `La boutique "${seller.proShopDetails?.shopName || seller.name}" a soumis une publicité payée (${AD_COST_COINS} Coins) en attente de modération.`,
      type: "ad_status",
      link: "/admin/ads",
      sendEmailNotification: true,
    }).catch((err) => console.error("❌ Erreur notif ad superAdmin :", err.message));
  }

  return ad;
};

/**
 * SuperAdmin modère et valide/refuse une publicité de Boutique Pro
 */
export const reviewBoutiqueAd = async (adId, { status, rejectionReason = "", durationDays = 30 }) => {
  const ad = await Ad.findById(adId);
  if (!ad) throw new Error("Publicité non trouvée.");

  if (!["active", "rejected"].includes(status)) {
    throw new Error("Statut de modération invalide ('active' ou 'rejected').");
  }

  ad.status = status;
  ad.rejectionReason = rejectionReason;

  if (status === "active") {
    ad.isActive = true;
    ad.startDate = new Date();
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + Number(durationDays));
    ad.endDate = expiry;
  } else {
    ad.isActive = false;
  }

  await ad.save();

  // Notifier le vendeur par in-app et par email du résultat de la modération
  if (ad.advertiser) {
    const isApproved = status === "active";
    createNotification({
      recipientId: ad.advertiser,
      title: isApproved ? "🎉 Publicité Boutique Approuvée !" : "❌ Publicité Boutique Refusée",
      message: isApproved
        ? `Votre publicité pour la boutique est désormais en ligne sur la page d'accueil pour ${durationDays} jours.`
        : `Votre publicité a été refusée par l'administration. Motif : ${rejectionReason || "Non conforme aux règles."}`,
      type: "ad_status",
      link: "/my-ads",
      sendEmailNotification: true,
    }).catch((err) => console.error("❌ Erreur notif ad vendeur :", err.message));
  }

  return ad;
};

/**
 * Obtenir toutes les pubs (pour le tableau de bord SuperAdmin)
 */
export const getAllAdsForAdmin = async (page = 1, limit = 20) => {
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Ad.countDocuments();
  const ads = await Ad.find()
    .populate("advertiser", "name email proShopDetails")
    .populate("product", "name price")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return { ads, total, page: Number(page), pages: Math.ceil(total / Number(limit)) };
};

/**
 * Supprimer une publicité
 */
export const deleteAd = async (adId) => {
  const ad = await Ad.findByIdAndDelete(adId);
  if (!ad) throw new Error("Publicité non trouvée.");
  return { message: "Publicité supprimée avec succès." };
};

export default {
  getHomepageAds,
  createSuperAdminAd,
  requestBoutiqueHomepageAd,
  reviewBoutiqueAd,
  getAllAdsForAdmin,
  deleteAd,
};
