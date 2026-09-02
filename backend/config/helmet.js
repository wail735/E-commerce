// Configuration de Helmet pour la sécurité des headers HTTP
import helmet from "helmet";

/**
 * Helmet : Middleware de sécurité qui protège l'application
 * en définissant des headers HTTP appropriés
 *
 * Protection contre :
 * - XSS (Cross-Site Scripting)
 * - Clickjacking
 * - Sniffing MIME
 * - Injection de code
 * - Attaques par force brute
 *
 * Cas d'utilisation :
 * 1. API REST sécurisées
 * 2. Applications web sensibles
 * 3. Sites e-commerce
 * 4. Applications bancaires/financières
 */

// Configuration Helmet personnalisée
export const helmetConfig = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"],
    },
  },

  // X-DNS-Prefetch-Control
  dnsPrefetchControl: {
    allow: false,
  },

  // Frameguard (protection contre le clickjacking)
  frameguard: {
    action: "deny",
  },

  // Hide Powered-By
  hidePoweredBy: {
    setTo: "Express",
  },

  // HSTS (HTTP Strict Transport Security)
  hsts: {
    maxAge: 31536000, // 1 an en secondes
    includeSubDomains: true,
    preload: true,
  },

  // IE No Open
  ieNoOpen: true,

  // No Sniff
  noSniff: true,

  // XSS Filter
  xssFilter: true,

  // Referrer Policy
  referrerPolicy: {
    policy: "strict-origin-when-cross-origin",
  },
});

// Middleware Helmet configuré
export const helmetMiddleware = helmetConfig;

// Configuration Helmet pour les API (moins restrictive)
export const helmetApiConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  frameguard: {
    action: "deny",
  },
  hidePoweredBy: {
    setTo: "Express",
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: {
    policy: "same-origin",
  },
});

export default {
  helmetConfig,
  helmetMiddleware,
  helmetApiConfig,
};
