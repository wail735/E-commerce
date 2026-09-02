// Configuration du Rate Limiting pour la sécurité
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
/**
 * Rate Limiting : Technique de contrôle du trafic réseau
 * Limite le nombre de requêtes qu'un client peut effectuer
 *
 * Pourquoi c'est important :
 * - Protection contre les attaques DDoS
 * - Prévention des abus
 * - Gestion de la charge serveur
 * - Équité entre les utilisateurs
 *
 * Cas d'utilisation :
 * 1. API publique (limiter les requêtes par IP)
 * 2. Authentification (limiter les tentatives)
 * 3. Upload de fichiers (limiter la taille/fréquence)
 * 4. Endpoints sensibles (paiements, données sensibles)
 */

// Rate Limiting général pour l'API
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par fenêtre
  message: {
    success: false,
    message: "Trop de requêtes, veuillez réessayer dans 15 minutes",
  },
  standardHeaders: true, // Retourner les headers RateLimit-*
  legacyHeaders: false, // Désactiver les headers X-RateLimit-*
  handler: (req, res) => {
    console.warn(`⚠️ Rate limit exceeded pour ${req.ip}`);
    res.status(429).json({
      success: false,
      message: "Trop de requêtes, veuillez réessayer plus tard",
    });
  },
  // Exclure certains endpoints
  skip: (req) => {
    // Exclure les webhooks et endpoints internes
    return req.path.startsWith("/webhooks") || req.path.includes("internal");
  },
});

// Rate Limiting strict pour l'authentification
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // 15 tentatives max
  message: {
    success: false,
    message:
      "Trop de tentatives de connexion, veuillez réessayer dans 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate Limiting très strict pour les opérations sensibles
export const sensitiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 10, // 10 requêtes par heure
  message: {
    success: false,
    message: "Trop de requêtes sensibles, veuillez réessayer dans 1 heure",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate Limiting pour l'upload de fichiers
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 50, // 50 uploads par heure
  message: {
    success: false,
    message: "Trop d'uploads, veuillez réessayer dans 1 heure",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate Limiting pour les emails
export const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 5, // 5 emails par heure
  message: {
    success: false,
    message: "Trop d'emails envoyés, veuillez réessayer dans 1 heure",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate Limiting par utilisateur (nécessite l'authentification)
export const userLimiter = (maxRequests = 60, windowMs = 60 * 1000) => {
  return rateLimit({
    windowMs: windowMs,
    max: maxRequests,
    message: {
      success: false,
      message: `Trop de requêtes, limite de ${maxRequests} par ${windowMs / 1000} secondes`,
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      // Utiliser l'ID utilisateur si disponible
      return req.user ? req.user.id : req.ip;
    },
  });
};

// Configuration des limites par endpoint
export const rateLimitConfig = {
  // API générale
  api: generalLimiter,

  // Authentification
  auth: authLimiter,

  // Endpoints sensibles
  sensitive: sensitiveLimiter,

  // Uploads
  upload: uploadLimiter,

  // Emails
  email: emailLimiter,

  // Personnalisé
  user: userLimiter,

  // Middleware de taux de requêtes
  createLimiter: (options = {}) => {
    return rateLimit({
      windowMs: options.windowMs || 60 * 1000,
      max: options.max || 60,
      message: options.message || {
        success: false,
        message: "Trop de requêtes",
      },
      ...options,
    });
  },
};

// Fonction pour le monitoring du rate limiting
export const rateLimitMonitor = (req, res, next) => {
  // Enregistrer les informations de rate limit
  const rateLimitInfo = {
    ip: req.ip,
    path: req.path,
    method: req.method,
    user: req.user ? req.user.id : "anonymous",
    timestamp: new Date().toISOString(),
  };

  // Écrire dans un fichier de log

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const logPath = path.join(__dirname, "../logs/rate-limit.log");

  fs.appendFileSync(logPath, JSON.stringify(rateLimitInfo) + "\n");

  next();
};

export default {
  generalLimiter,
  authLimiter,
  sensitiveLimiter,
  uploadLimiter,
  emailLimiter,
  userLimiter,
  rateLimitConfig,
  rateLimitMonitor,
};
