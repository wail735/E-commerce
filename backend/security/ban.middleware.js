// ============================================================================
// FICHIER : backend 2/security/ban.middleware.js
// RÔLE : Middleware Express interceptant et bloquant les adresses IP ou Email bannies
// ============================================================================

import Ban from "./ban.model.js";

/**
 * Middleware de sécurité vérifiant si l'adresse IP cliente ou l'email connecté est banni
 */
export const checkBannedMiddleware = async (req, res, next) => {
  try {
    // Récupère l'IP du client
    const clientIp = (
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      ""
    )
      .split(",")[0]
      .trim();
    const userEmail = req.user?.email ? req.user.email.toLowerCase() : null;

    // Construit les critères de vérification
    const query = [{ type: "ip", value: clientIp }];
    if (userEmail) {
      query.push({ type: "email", value: userEmail });
    }

    const isBanned = await Ban.findOne({ $or: query });

    if (isBanned) {
      return res.status(403).json({
        success: false,
        message: `🚫 Accès bloqué par l'administration. Motif : ${isBanned.reason}`,
        bannedType: isBanned.type,
      });
    }

    next();
  } catch (error) {
    // Ne bloque pas la requête en cas d'erreur de base de données
    console.error(
      "⚠️ Erreur vérification bannissement IP/Email :",
      error.message,
    );
    next();
  }
};

export default checkBannedMiddleware;
