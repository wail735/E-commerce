// ============================================================================
// FICHIER : backend 2/orders/order.controller.js
// RÔLE : Contrôleur gérant les requêtes HTTP des commandes et du suivi (Tracking)
// ============================================================================

import * as orderService from "./order.service.js";
import { createOrderDTO, updateOrderStatusDTO } from "./order.dto.js";

/**
 * Créer une commande à partir du panier (Checkout)
 */
export const createOrder = async (req, res) => {
  try {
    const { error, value } = createOrderDTO.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const order = await orderService.createOrder(req.user._id, value);
    return res.status(201).json({
      success: true,
      message: "Commande créée avec succès !",
      data: order,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Obtenir toutes les commandes de l'utilisateur (Historique)
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await orderService.getUserOrders(req.user._id);
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Obtenir toutes les commandes d'un vendeur
 */
export const getSellerOrders = async (req, res) => {
  try {
    const orders = await orderService.getSellerOrders(req.user._id);
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Vendeur: Mettre à jour le statut d'une commande
 */
export const updateSellerOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.user._id,
      status,
      trackingNumber
    );
    return res
      .status(200)
      .json({ success: true, message: "Commande mise à jour", data: order });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Vendeur: Obtenir les statistiques du tableau de bord
 */
export const getSellerStats = async (req, res) => {
  try {
    const stats = await orderService.getSellerStats(req.user._id);
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Mettre à jour le statut d'une commande (Admin/SuperAdmin)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await orderService.updateOrderStatus(
      req.params.id,
      null, // No specific seller restriction for Admin
      status,
      trackingNumber
    );
    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Suivre une commande
 */
export const trackOrder = async (req, res) => {
  try {
    // Basic tracking impl
    return res.status(200).json({ success: true, message: "Tracking info not fully implemented yet" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * SuperAdmin: Voir toutes les commandes
 */
export const getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
