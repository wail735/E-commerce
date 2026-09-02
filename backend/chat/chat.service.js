// ============================================================================
// FICHIER : backend 2/chat/chat.service.js
// RÔLE : Logique métier du Chat Temps Réel & Initialisation des discussions Produit / Vendeur
// ============================================================================

import Message from "./chat.model.js";
import Product from "../products/product.model.js";
import User from "../users/user.model.js";
import { createNotification } from "../notifications/notification.service.js";

/**
 * Enregistrer un nouveau message de chat dans MongoDB et déclencher la notification
 */
export const saveMessage = async ({ roomId, senderId, receiverId, text }) => {
  const message = await Message.create({
    roomId,
    sender: senderId,
    receiver: receiverId || null,
    text,
  });

  const populatedMessage = await message.populate("sender", "name email role");

  // Si un destinataire direct est spécifié et différent de l'expéditeur, créer une notification
  if (receiverId && receiverId.toString() !== senderId.toString()) {
    createNotification({
      recipientId: receiverId,
      senderId,
      title: "💬 Nouveau message de chat",
      message: `${populatedMessage.sender.name} vous a envoyé un message : "${text.substring(0, 50)}${text.length > 50 ? "..." : ""}"`,
      type: "chat_message",
      link: `/profile/messages?room=${roomId}`,
      sendEmailNotification: false, // Pas d'email à chaque message instantané pour éviter le spam, uniquement notif in-app & socket
    }).catch((err) => console.error("❌ Erreur notif message chat :", err.message));
  }

  return populatedMessage;
};

/**
 * Récupérer l'historique des messages d'une salle de discussion (Room)
 */
export const getRoomMessages = async (roomId, limit = 50) => {
  return await Message.find({ roomId })
    .populate("sender", "name email role")
    .sort({ createdAt: 1 }) // Tri chronologique
    .limit(Number(limit));
};

/**
 * Initialiser une discussion live directe avec le propriétaire/vendeur d'un produit
 */
export const initiateProductChat = async (buyerId, productId) => {
  const product = await Product.findById(productId).populate("createdBy", "name email role isProShop proShopDetails");
  if (!product) {
    throw new Error("Le produit spécifié n'existe pas.");
  }

  const seller = product.createdBy;
  if (!seller) {
    throw new Error("Aucun vendeur/propriétaire n'est associé à ce produit.");
  }

  if (seller._id.toString() === buyerId.toString()) {
    throw new Error("Vous ne pouvez pas démarrer une discussion avec vous-même.");
  }

  // Identifiant unique déterministe pour la salle de chat entre cet acheteur et ce vendeur pour ce produit
  const roomId = `product_${product._id}_buyer_${buyerId}`;

  // Récupère l'historique des messages déjà échangés dans cette salle
  const messages = await getRoomMessages(roomId, 50);

  return {
    roomId,
    product: {
      id: product._id,
      name: product.name,
      price: product.price,
      images: product.images,
    },
    seller: {
      id: seller._id,
      name: seller.name,
      email: seller.email,
      shopName: seller.proShopDetails?.shopName || seller.name,
    },
    messages,
  };
};

/**
 * Récupérer la liste des conversations (dernier message de chaque salle) pour un utilisateur
 */
export const getConversations = async (userId) => {
  const messages = await Message.find({
    $or: [{ sender: userId }, { receiver: userId }]
  })
    .sort({ createdAt: -1 })
    .populate("sender", "name email role")
    .populate("receiver", "name email role");
    
  // Group by roomId to get unique conversations (latest message first)
  const convMap = new Map();
  for (let msg of messages) {
    if (!convMap.has(msg.roomId)) {
      // Determine who the "other" person is
      const otherUser = msg.sender._id.toString() === userId.toString() ? msg.receiver : msg.sender;
      
      convMap.set(msg.roomId, {
        roomId: msg.roomId,
        lastMessage: msg.text,
        isRead: msg.isRead,
        createdAt: msg.createdAt,
        otherUser: otherUser ? {
          _id: otherUser._id,
          name: otherUser.name,
          role: otherUser.role,
        } : null
      });
    }
  }
  return Array.from(convMap.values());
};

export default {
  saveMessage,
  getRoomMessages,
  initiateProductChat,
  getConversations,
};
