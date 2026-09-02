// ============================================================================
// FICHIER : backend 2/chat/chat.socket.js
// RÔLE : Gestionnaire d'événements Socket.io pour le chat en temps réel
// ============================================================================

import { saveMessage } from "./chat.service.js";

/**
 * Attache les gestionnaires d'événements de chat instantané à l'instance Socket.io
 * @param {Object} io - Instance du serveur Socket.io
 */
export const registerChatSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    // 1. Un utilisateur rejoint une salle de chat (Room)
    socket.on("join_chat_room", (roomId) => {
      socket.join(roomId);
      console.log(`💬 Client WebSockets [${socket.id}] a rejoint la salle : ${roomId}`);
    });

    // 1.5 Un utilisateur rejoint sa propre salle personnelle pour les notifications
    socket.on("join_user_room", (userId) => {
      socket.join(userId);
      console.log(`🔔 Client WebSockets [${socket.id}] a rejoint sa salle perso : ${userId}`);
    });

    // 2. Envoi d'un message instantané en temps réel (Persistance BDD + Émission temps réel)
    socket.on("send_chat_message", async (data) => {
      try {
        const { roomId, senderId, receiverId, text } = data;

        // Étape 1 : Sauvegarde le message dans MongoDB via le service
        const savedMessage = await saveMessage({ roomId, senderId, receiverId, text });

        // Étape 2 : Diffuse immédiatement le message à la salle (Room) et aux salles personnelles (userId)
        io.to(roomId).to(receiverId).to(senderId).emit("new_chat_message", savedMessage);
        
        // Optionnel : on peut émettre un événement de notification pour la cloche si le receiver n'est pas dans la room
        io.to(receiverId).emit("new_notification", {
          title: "Nouveau message",
          message: `Vous avez reçu un message`,
          type: "message",
          link: `/profile/messages?room=${roomId}`,
          createdAt: new Date()
        });
      } catch (error) {
        console.error("❌ Erreur d'envoi du message WebSocket :", error.message);
        socket.emit("chat_error", { message: "Impossible d'envoyer le message" });
      }
    });

    // 3. Indicateur de saisie ("En train d'écrire...")
    socket.on("typing_start", (data) => {
      socket.to(data.roomId).emit("user_is_typing", { userId: data.userId, name: data.name });
    });

    socket.on("typing_stop", (data) => {
      socket.to(data.roomId).emit("user_stopped_typing", { userId: data.userId });
    });
  });
};

export default registerChatSocketHandlers;
