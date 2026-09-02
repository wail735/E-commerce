// ============================================================================
// FICHIER : backend 2/config/socket.js
// RÔLE : Configuration et gestionnaire d'événements du serveur WebSocket (Socket.io)
// ============================================================================

// 1. Importation de la classe Server du module Socket.io pour créer le serveur WebSocket
import { Server } from "socket.io";

/**
 * ============================================================================
 * 💡 GRAND CONCEPT EXPLIQUÉ : LES WEBSOCKETS ET SOCKET.IO
 * ============================================================================
 *
 * 1. QU'EST-CE QU'UN WEBSOCKET ?
 * Le protocole WebSocket (RFC 6455) est un protocole de communication informatique
 * bidirectionnel, full-duplex et persistant au-dessus d'une unique connexion TCP.
 *
 * 2. DIFFÉRENCE MAJEURE ENTRE HTTP ET WEBSOCKET :
 * - Protocol HTTP (Requête/Réponse Unidirectionnel) :
 *   Le client (navigateur) doit faire une requête au serveur pour obtenir une donnée.
 *   Le serveur NE PEUT PAS envoyer de données de lui-même au client sans que le client ne le demande.
 *
 * - Protocol WebSocket (Communication Bidirectionnelle Temps Réel) :
 *   Une fois la connexion "handshake" (poignée de main) établie via HTTP/HTTPS, la connexion
 *   reste OUVERTE indéfiniment. Le serveur peut envoyer instantanément des données au client
 *   dès qu'un événement se produit, et inversement, avec un surcoût réseau minime.
 *
 * 3. POURQUOI UTILISER SOCKET.IO ?
 * Socket.io est une bibliothèque au-dessus du protocole WebSocket qui ajoute :
 * - Un système de fallback (polling HTTP si les WebSockets sont bloqués par un pare-feu).
 * - La gestion automatique de la réconnexion.
 * - Le concept de "Salles" (Rooms) et d'Espaces de Noms (Namespaces).
 * - La diffusion d'événements ciblés (`io.to(roomId).emit(...)`).
 *
 * 4. CAS D'USAGE RÉELS DANS LES APPLICATIONS MODERNES :
 * - Messagerie instantanée en temps réel (WhatsApp, Slack, Discord).
 * - Notifications push instantanées (Ex: "Votre commande est expédiée").
 * - Suivi du livreur en direct sur une carte (Uber, Deliveroo).
 * - Enchères en temps réel et cours de la bourse (Trading, eBay).
 * - Jeux vidéo multijoueurs en ligne.
 */

// Variable globale pour stocker l'instance du serveur Socket.io
let io = null;

/**
 * Initialise le serveur Socket.io en l'attachant au serveur HTTP Node.js principal.
 * @param {Object} httpServer - L'instance du serveur HTTP natif de Node.js
 */
export const initSocket = (httpServer) => {
  // 2. Instanciation du serveur Socket.io avec options de configuration CORS
  io = new Server(httpServer, {
    cors: {
      // Origines autorisées à se connecter en WebSocket (ex: Frontend React)
      origin: "*",
      // Méthodes HTTP autorisées lors du handshake
      methods: ["GET", "POST"],
    },
    // Délai d'inactivité avant de considérer le client déconnecté (20 secondes)
    pingTimeout: 60000,
    // Fréquence d'envoi du paquet de contrôle "ping" (25 secondes)
    pingInterval: 25000,
  });

  console.log("⚡ Serveur WebSocket (Socket.io) initialisé et prêt pour le temps réel");

  // 3. Écoute globale de l'événement "connection" (lorsqu'un client Web ou mobile se connecte)
  io.on("connection", (socket) => {
    // Affiche l'ID unique attribué à cette socket client
    console.log(`🔌 Nouveau client connecté via WebSocket [ID Socket : ${socket.id}]`);

    // 4. Événement personnalisé : Un utilisateur rejoint sa salle personnelle ou une salle de support
    socket.on("join_room", (roomId) => {
      // La méthode socket.join() abonne le client à un canal spécifique (Room)
      socket.join(roomId);
      console.log(`👤 Client [${socket.id}] a rejoint la salle de discussion : ${roomId}`);
    });

    // 5. Événement : Réception d'un message instantané envoyé par un utilisateur ou un administrateur
    socket.on("send_message", (messageData) => {
      console.log(`💬 Message reçu dans la salle [${messageData.roomId}] :`, messageData.text);

      // Transmet instantanément le message à TOUS les clients présents dans la salle spécifique
      // io.to(roomId).emit(...) envoie l'événement à tous les membres de la salle
      io.to(messageData.roomId).emit("receive_message", messageData);
    });

    // 6. Événement : L'utilisateur est en train d'écrire ("typing...")
    socket.on("typing", (data) => {
      // Diffuse l'événement aux autres membres de la salle sauf l'expéditeur (broadcast)
      socket.to(data.roomId).emit("user_typing", data);
    });

    // 7. Événement de déconnexion du client (fermeture de la fenêtre du navigateur ou perte réseau)
    socket.on("disconnect", (reason) => {
      console.log(`❌ Client déconnecté [ID Socket : ${socket.id}] - Raison : ${reason}`);
    });
  });

  return io;
};

/**
 * Permet de récupérer l'instance du serveur Socket.io n'importe où dans l'application Express
 * (par exemple dans des contrôleurs d'API REST pour envoyer des notifications push).
 */
export const getIO = () => {
  if (!io) {
    throw new Error("❌ Le serveur Socket.io n'a pas encore été initialisé !");
  }
  return io;
};

export default {
  initSocket,
  getIO,
};
