// ============================================================================
// FICHIER : backend 2/social/social.service.js
// RÔLE : Logique métier des fonctionnalités sociales (Amis, Avis Produits, Likes & Partages)
// ============================================================================

import { FriendRequest, Review } from "./social.model.js";
import User from "../users/user.model.js";
import Product from "../products/product.model.js";
import { createNotification } from "../notifications/notification.service.js";

/**
 * Envoyer une demande d'ami à un autre utilisateur
 */
export const sendFriendRequest = async (requesterId, recipientId) => {
  if (requesterId.toString() === recipientId.toString()) {
    throw new Error("Vous ne pouvez pas vous ajouter vous-même en ami.");
  }

  const recipient = await User.findById(recipientId);
  if (!recipient) throw new Error("Utilisateur destinataire non trouvé.");

  const existingRequest = await FriendRequest.findOne({
    $or: [
      { requester: requesterId, recipient: recipientId },
      { requester: recipientId, recipient: requesterId },
    ],
  });

  if (existingRequest) {
    throw new Error(`Une demande d'ami existe déjà entre vous avec le statut : [${existingRequest.status}]`);
  }

  const request = await FriendRequest.create({
    requester: requesterId,
    recipient: recipientId,
    status: "pending",
  });

  const requesterUser = await User.findById(requesterId);

  // Notification in-app et email au destinataire
  createNotification({
    recipientId,
    senderId: requesterId,
    title: "👥 Demande d'ami reçue",
    message: `${requesterUser.name} souhaite vous ajouter à sa liste d'amis !`,
    type: "system",
    link: "/social/friend-requests",
    sendEmailNotification: true,
  }).catch((err) => console.error("❌ Erreur notif demande ami :", err.message));

  return request;
};

/**
 * Accepter ou refuser une demande d'ami
 */
export const respondFriendRequest = async (requestId, recipientId, status) => {
  if (!["accepted", "rejected"].includes(status)) {
    throw new Error("Statut invalide ('accepted' ou 'rejected').");
  }

  const request = await FriendRequest.findOne({ _id: requestId, recipient: recipientId });
  if (!request) {
    throw new Error("Demande d'ami non trouvée ou vous n'êtes pas le destinataire.");
  }

  request.status = status;
  await request.save();

  if (status === "accepted") {
    const recipientUser = await User.findById(recipientId);
    createNotification({
      recipientId: request.requester,
      senderId: recipientId,
      title: "🎉 Demande d'ami acceptée !",
      message: `${recipientUser.name} a accepté votre demande d'ami. Vous pouvez désormais échanger en privé.`,
      type: "system",
      link: `/profile/messages?room=friends_${request.requester}_${recipientId}`,
      sendEmailNotification: true,
    }).catch((err) => console.error("❌ Erreur notif acceptation ami :", err.message));
  }

  return request;
};

/**
 * Obtenir la liste de tous les amis confirmés d'un utilisateur
 */
export const getUserFriends = async (userId) => {
  const requests = await FriendRequest.find({
    status: "accepted",
    $or: [{ requester: userId }, { recipient: userId }],
  })
    .populate("requester", "name email role isProShop proShopDetails")
    .populate("recipient", "name email role isProShop proShopDetails");

  return requests.map((req) => {
    return req.requester._id.toString() === userId.toString() ? req.recipient : req.requester;
  });
};

/**
 * Ajouter un avis/commentaire/note sur un produit
 */
export const addProductReview = async (userId, productId, rating, comment) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Produit non trouvé.");

  const review = await Review.create({
    product: productId,
    user: userId,
    rating: Number(rating),
    comment,
  });

  // Met à jour la note moyenne du produit
  const reviews = await Review.find({ product: productId });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  product.rating = Number(avgRating.toFixed(1));
  product.numReviews = reviews.length;
  await product.save();

  return review;
};

/**
 * Liker ou Unliker un avis de produit
 */
export const likeReview = async (userId, reviewId) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new Error("Avis non trouvé.");

  const index = review.likes.indexOf(userId);
  if (index > -1) {
    review.likes.splice(index, 1);
  } else {
    review.likes.push(userId);
  }

  await review.save();
  return { likesCount: review.likes.length, isLiked: index === -1 };
};

/**
 * Incrémenter le compteur de partages d'un produit
 */
export const shareProduct = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Produit non trouvé.");

  return {
    productId,
    shareUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/products/${productId}?utm_source=social_share`,
  };
};

/**
 * Récupérer les avis d'un produit
 */
export const getProductReviews = async (productId) => {
  return await Review.find({ product: productId })
    .populate("user", "name email")
    .sort({ createdAt: -1 });
};

export default {
  sendFriendRequest,
  respondFriendRequest,
  getUserFriends,
  addProductReview,
  likeReview,
  shareProduct,
  getProductReviews,
};
