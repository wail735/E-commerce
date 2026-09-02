// ============================================================================
// FICHIER : backend 2/chat/chat.controller.js
// RÔLE : Contrôleur HTTP pour le chat et l'initialisation de discussion vendeur
// ============================================================================

import * as chatService from "./chat.service.js";

/**
 * Obtenir l'historique des messages d'une salle (Room)
 */
export const getRoomHistory = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await chatService.getRoomMessages(roomId, req.query.limit || 50);
    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Initialiser une discussion live instantanée avec le vendeur d'un produit
 */
export const startProductChat = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: "L'identifiant du produit est obligatoire." });
    }

    const chatSession = await chatService.initiateProductChat(req.user._id, productId);
    return res.status(200).json({ success: true, data: chatSession });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Récupérer toutes les conversations actives d'un utilisateur
 */
export const getUserConversations = async (req, res) => {
  try {
    const conversations = await chatService.getConversations(req.user._id);
    return res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
