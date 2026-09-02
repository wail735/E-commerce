// ============================================================================
// FICHIER : backend 2/disputes/dispute.service.js
// RÔLE : Logique métier du Centre de Conflits (Ouverture, Réponse Vendeur & Arbitrage Admin)
// ============================================================================

import Dispute from "./dispute.model.js";
import Order from "../orders/order.model.js";
import User from "../users/user.model.js";
import { createNotification } from "../notifications/notification.service.js";

/**
 * Ouvrir un conflit/litige sur une commande
 */
export const openDispute = async (buyerId, { orderId, reason, description, evidenceImages = [] }) => {
  const order = await Order.findOne({ _id: orderId, user: buyerId });
  if (!order) {
    throw new Error("Commande non trouvée ou vous n'êtes pas l'acheteur de cette commande.");
  }

  const existingDispute = await Dispute.findOne({ order: orderId, status: { $ne: "closed" } });
  if (existingDispute) {
    throw new Error("Un litige est déjà ouvert pour cette commande.");
  }

  // Trouve le premier vendeur associé aux articles de la commande
  const sellerId = order.items && order.items.length > 0 ? order.items[0].seller : null;

  const dispute = await Dispute.create({
    order: orderId,
    buyer: buyerId,
    seller: sellerId,
    reason,
    description,
    evidenceImages,
    status: "open",
  });

  // Notifier les SuperAdmins et le Vendeur
  if (sellerId) {
    createNotification({
      recipientId: sellerId,
      senderId: buyerId,
      title: "⚠️ Litige ouvert sur une commande",
      message: `Un litige a été ouvert pour la commande #${orderId}. Raison : ${reason}. Merci d'apporter votre réponse.`,
      type: "system",
      link: `/seller/disputes`,
      sendEmailNotification: true,
    }).catch((err) => console.error("❌ Erreur notif litige vendeur :", err.message));
  }

  const superAdmins = await User.find({ role: "superAdmin" });
  for (const admin of superAdmins) {
    createNotification({
      recipientId: admin._id,
      senderId: buyerId,
      title: "⚖️ Nouveau litige client à arbitrer",
      message: `Litige ouvert sur la commande #${orderId} (${reason}).`,
      type: "system",
      link: "/admin/disputes",
      sendEmailNotification: true,
    }).catch((err) => console.error("❌ Erreur notif litige admin :", err.message));
  }

  return dispute;
};

/**
 * Le vendeur apporte sa réponse et ses preuves au dossier de litige
 */
export const sellerRespondDispute = async (sellerId, disputeId, responseText) => {
  const dispute = await Dispute.findById(disputeId);
  if (!dispute) throw new Error("Litige non trouvé.");

  if (dispute.seller && dispute.seller.toString() !== sellerId.toString()) {
    throw new Error("Vous n'êtes pas le vendeur concerné par ce litige.");
  }

  dispute.sellerResponse = responseText;
  dispute.status = "under_review";
  await dispute.save();

  return dispute;
};

/**
 * Arbitrage par l'Administration (SuperAdmin rend son verdict)
 */
export const arbitrateDispute = async (adminId, disputeId, { decision, status }) => {
  const dispute = await Dispute.findById(disputeId).populate("order buyer seller");
  if (!dispute) throw new Error("Litige non trouvé.");

  if (!["resolved_refund", "resolved_seller_paid", "closed"].includes(status)) {
    throw new Error("Statut d'arbitrage invalide.");
  }

  dispute.status = status;
  dispute.adminDecision = decision;
  dispute.arbitratedBy = adminId;
  await dispute.save();

  const isRefund = status === "resolved_refund";

  // Si remboursement accordé, rembourser le montant au solde de l'acheteur
  if (isRefund && dispute.buyer) {
    const buyerUser = await User.findById(dispute.buyer._id);
    if (buyerUser && dispute.order) {
      buyerUser.coins += dispute.order.totalAmount; // Remboursement sous forme de coins crédités
      await buyerUser.save();
    }
  }

  // Notifier l'acheteur et le vendeur de la décision finale
  createNotification({
    recipientId: dispute.buyer._id,
    title: isRefund ? "✅ Litige Résolu : Remboursement Accordé" : "⚖️ Litige Clôturé",
    message: `Décision de l'administration : "${decision}". ${isRefund ? "Le montant a été remboursé sur votre compte." : ""}`,
    type: "system",
    link: `/disputes/${dispute._id}`,
    sendEmailNotification: true,
  }).catch((err) => console.error("❌ Erreur notif arbitrage acheteur :", err.message));

  if (dispute.seller) {
    createNotification({
      recipientId: dispute.seller._id,
      title: "⚖️ Verdict du Litige rendu par l'Administration",
      message: `Décision finale : "${decision}". Statut dossier : [${status}]`,
      type: "system",
      link: `/disputes/${dispute._id}`,
      sendEmailNotification: true,
    }).catch((err) => console.error("❌ Erreur notif arbitrage vendeur :", err.message));
  }

  return dispute;
};

/**
 * Consulter tous les litiges d'un utilisateur (Acheteur ou Vendeur)
 */
export const getDisputesForUser = async (userId) => {
  return await Dispute.find({
    $or: [{ buyer: userId }, { seller: userId }],
  })
    .populate("order buyer seller")
    .sort({ createdAt: -1 });
};

/**
 * Obtenir tous les litiges pour le panneau d'administration
 */
export const getAllDisputesForAdmin = async (page = 1, limit = 20) => {
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Dispute.countDocuments();
  const disputes = await Dispute.find()
    .populate("order buyer seller")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return { disputes, total, page: Number(page), pages: Math.ceil(total / Number(limit)) };
};

export default {
  openDispute,
  sellerRespondDispute,
  arbitrateDispute,
  getDisputesForUser,
  getAllDisputesForAdmin,
};
