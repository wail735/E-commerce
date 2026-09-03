// Configuration des sessions
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import crypto from "crypto";

/**
 * Session : Gestion des sessions utilisateur
 *
 * Stockage des sessions :
 * - MemoryStore (développement)
 * - MongoDB (production)
 * - Redis (production, haute performance)
 *
 * Cas d'utilisation :
 * 1. Authentification basée sur les sessions
 * 2. Panier d'achat temporaire
 * 3. Préférences utilisateur
 * 4. État de l'application
 */

// Générer une clé secrète aléatoire si non définie
const sessionSecret =
  process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");

// Configuration des sessions
export const sessionConfig = {
  // Clé secrète pour signer les cookies
  secret: sessionSecret,

  // Nom du cookie de session
  name: "sessionId",

  // Réserver le cookie
  resave: false,

  // Sauvegarder les sessions non modifiées
  saveUninitialized: false,

  // Configuration du cookie
  cookie: {
    // Durée de vie (1 jour par défaut)
    maxAge: process.env.SESSION_MAX_AGE ? parseInt(process.env.SESSION_MAX_AGE, 10) : 24 * 60 * 60 * 1000, // 24h

    // Sécurisé en production
    secure: process.env.NODE_ENV === "production",

    // HttpOnly (pas accessible en JS)
    httpOnly: true,

    // SameSite
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",

    // Domaine
    domain: process.env.COOKIE_DOMAIN || undefined,
  },

  // Store pour les sessions (MongoDB) - Seulement en production pour éviter les OOM en dev
  store: process.env.NODE_ENV === "production" ? MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
    ttl: 24 * 60 * 60, // 24 heures
    autoRemove: "native",
    touchAfter: 24 * 3600,
    stringify: true,
    crypto: {
      secret: sessionSecret,
    },
  }) : undefined,
};

// Configuration des sessions pour la production
export const productionSessionConfig = {
  ...sessionConfig,
  cookie: {
    ...sessionConfig.cookie,
    secure: true,
    sameSite: "strict",
    domain: process.env.COOKIE_DOMAIN,
  },
};

// Configuration des sessions pour le développement
export const developmentSessionConfig = {
  ...sessionConfig,
  cookie: {
    ...sessionConfig.cookie,
    secure: false,
    sameSite: "lax",
  },
};

// Session middleware
export const sessionMiddleware = session(
  process.env.NODE_ENV === "production"
    ? productionSessionConfig
    : developmentSessionConfig,
);

// Régénération de session
export const regenerateSession = (req, res, next) => {
  if (req.session) {
    req.session.regenerate((err) => {
      if (err) {
        return next(err);
      }
      next();
    });
  } else {
    next();
  }
};

// Destruction de session
export const destroySession = (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      // Supprimer le cookie
      res.clearCookie("sessionId");
      next();
    });
  } else {
    next();
  }
};

export default {
  sessionConfig,
  productionSessionConfig,
  developmentSessionConfig,
  sessionMiddleware,
  regenerateSession,
  destroySession,
};
