// ============================================================================
// FICHIER : backend 2/social/social.controller.js
// RÔLE : Contrôleur HTTP pour les fonctionnalités sociales et le réseau d'amis
// ============================================================================

import * as socialService from "./social.service.js";

/**
 * Envoyer une demande d'ami
 */
export const requestFriend = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const request = await socialService.sendFriendRequest(req.user._id, recipientId);
    return res.status(201).json({ success: true, message: "Demande d'ami envoyée avec succès !", data: request });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Répondre à une demande d'ami (Accepter / Refuser)
 */
export const respondFriend = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    const request = await socialService.respondFriendRequest(requestId, req.user._id, status);
    return res.status(200).json({ success: true, message: `Demande d'ami mise à jour : [${status}]`, data: request });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Obtenir sa liste d'amis
 */
export const getFriends = async (req, res) => {
  try {
    const friends = await socialService.getUserFriends(req.user._id);
    return res.status(200).json({ success: true, data: friends });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Publier un avis/commentaire sur un produit
 */
export const postReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const review = await socialService.addProductReview(req.user._id, productId, rating, comment);
    return res.status(201).json({ success: true, message: "Avis publié avec succès !", data: review });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Liker/Unliker un avis
 */
export const likeReview = async (req, res) => {
  try {
    const result = await socialService.likeReview(req.user._id, req.params.reviewId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Partager un produit
 */
export const shareProduct = async (req, res) => {
  try {
    const result = await socialService.shareProduct(req.params.productId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Obtenir les avis d'un produit (Public)
 */
export const getReviews = async (req, res) => {
  try {
    const reviews = await socialService.getProductReviews(req.params.productId);
    return res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
