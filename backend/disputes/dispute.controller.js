// ============================================================================
// FICHIER : backend 2/disputes/dispute.controller.js
// RÔLE : Contrôleur HTTP du Centre de Résolution de Conflits
// ============================================================================

import * as disputeService from "./dispute.service.js";

/**
 * Ouvrir un conflit (Acheteur)
 */
export const createDispute = async (req, res) => {
  try {
    const dispute = await disputeService.openDispute(req.user._id, req.body);
    return res.status(201).json({ success: true, message: "Dossier de litige ouvert avec succès.", data: dispute });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Répondre à un litige (Vendeur)
 */
export const respondDispute = async (req, res) => {
  try {
    const { responseText } = req.body;
    const dispute = await disputeService.sellerRespondDispute(req.user._id, req.params.id, responseText);
    return res.status(200).json({ success: true, message: "Réponse enregistrée.", data: dispute });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Trancher/Arbitrer un litige (SuperAdmin)
 */
export const arbitrate = async (req, res) => {
  try {
    const dispute = await disputeService.arbitrateDispute(req.user._id, req.params.id, req.body);
    return res.status(200).json({ success: true, message: "Verdict d'arbitrage rendu avec succès.", data: dispute });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Obtenir ses litiges (Acheteur / Vendeur)
 */
export const getMyDisputes = async (req, res) => {
  try {
    const disputes = await disputeService.getDisputesForUser(req.user._id);
    return res.status(200).json({ success: true, data: disputes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Obtenir tous les litiges (SuperAdmin)
 */
export const getAllDisputes = async (req, res) => {
  try {
    const data = await disputeService.getAllDisputesForAdmin(req.query.page, req.query.limit);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
