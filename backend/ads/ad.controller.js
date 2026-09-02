// ============================================================================
// FICHIER : backend 2/ads/ad.controller.js
// RÔLE : Contrôleur HTTP pour l'affichage et la gestion des publicités
// ============================================================================

import * as adService from "./ad.service.js";

/**
 * Obtenir les publicités actives sur la page d'accueil (Publique)
 */
export const getHomepageAds = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const data = await adService.getHomepageAds(userId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Obtenir les publicités du vendeur (Historique et en attente)
 */
export const getMyAds = async (req, res) => {
  try {
    const data = await adService.getSellerAds(req.user._id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Vendeur Pro souscrit/soumet une publicité payante pour sa Boutique Pro
 */
export const requestBoutiqueAd = async (req, res) => {
  try {
    const ad = await adService.requestBoutiqueHomepageAd(req.user._id, req.body);
    return res.status(201).json({
      success: true,
      message: "Demande de publicité soumise avec succès ! Elle est en attente de modération par l'administration.",
      data: ad,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * SuperAdmin crée manuellement une publicité photo ou vidéo
 */
export const createAdminAd = async (req, res) => {
  try {
    const ad = await adService.createSuperAdminAd(req.body);
    return res.status(201).json({ success: true, message: "Publicité créée et publiée avec succès !", data: ad });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * SuperAdmin valide ou rejette une demande de pub Boutique Pro
 */
export const reviewAd = async (req, res) => {
  try {
    const ad = await adService.reviewBoutiqueAd(req.params.id, req.body);
    return res.status(200).json({ success: true, message: `Publicité mise à jour : [${ad.status}]`, data: ad });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * SuperAdmin consulte toutes les publicités
 */
export const getAllAds = async (req, res) => {
  try {
    const data = await adService.getAllAdsForAdmin(req.query.page, req.query.limit);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * SuperAdmin supprime une publicité
 */
export const removeAd = async (req, res) => {
  try {
    const result = await adService.deleteAd(req.params.id);
    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
