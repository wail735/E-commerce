// Configuration CORS (Cross-Origin Resource Sharing)
import cors from "cors";

/**
 * CORS : Mécanisme de sécurité qui permet à une application web
 * d'effectuer des requêtes vers un domaine différent de son origine.
 *
 * Pourquoi CORS est important :
 * - Sécurité : Empêche les attaques CSRF
 * - Contrôle : Détermine qui peut accéder à l'API
 * - Flexibilité : Permet les architectures distribuées
 *
 * Cas d'utilisation :
 * 1. API publique accessible par plusieurs frontends
 * 2. Microservices communiquant entre eux
 * 3. Applications mobile (React Native, Flutter)
 * 4. Intégration avec des services tiers
 */

// Liste des origines autorisées
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173", // Vite
  "http://localhost:8080",
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
].filter(Boolean); // Filtrer les valeurs null/undefined

// Configuration CORS
export const corsOptions = {
  // Origine autorisée
  origin: function (origin, callback) {
    // Permettre les requêtes sans origine (Postman, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Vérifier si l'origine est autorisée
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // En développement, autoriser toutes les origines
      if (process.env.NODE_ENV === "development") {
        console.warn(`⚠️ Origine non autorisée: ${origin}`);
        callback(null, true);
      } else {
        callback(new Error("Accès non autorisé par CORS"));
      }
    }
  },

  // Méthodes HTTP autorisées
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  // Headers autorisés
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Allow-Headers",
    "X-Access-Token",
    "X-Key",
    "X-API-Key",
  ],

  // Headers exposés au client
  exposedHeaders: ["X-Total-Count", "X-Page", "X-Total-Pages", "X-API-Version"],

  // Autoriser les credentials (cookies, headers d'authentification)
  credentials: true,

  // Durée de cache des pré-vols (OPTIONS)
  maxAge: 86400, // 24 heures en secondes

  // Options de pré-vol
  preflightContinue: false,

  // Options de succès
  optionsSuccessStatus: 204,
};

// Fonction de logging CORS
export const corsLogger = (req, res, next) => {
  const origin = req.headers.origin;
  console.log(
    `🌐 Requête CORS de: ${origin || "Inconnue"} vers: ${req.method} ${req.url}`,
  );
  next();
};

// Middleware CORS configuré
export const corsMiddleware = cors(corsOptions);

export default {
  corsOptions,
  corsLogger,
  corsMiddleware,
  allowedOrigins,
};
