// Configuration des constantes de l'application
/**
 * Fichier central pour toutes les constantes de l'application
 * Facilite la maintenance et la cohérence
 *
 * Pourquoi utiliser des constantes ?
 * 1. Éviter les fautes de frappe (typos)
 * 2. Centraliser les modifications
 * 3. Améliorer la lisibilité du code
 * 4. Faciliter le débogage
 * 5. Standardiser les valeurs
 */

// -------- RÔLES UTILISATEUR --------
// Définit les différents rôles dans le système
const ROLES = {
  // Utilisateur standard : Peut acheter, voir les produits, gérer son compte
  USER: "user",
  // Administrateur : Peut gérer les produits, les commandes, les utilisateurs
  ADMIN: "admin",
  // Super Administrateur : Peut tout gérer, y compris les admins et les abonnements
  SUPER_ADMIN: "superAdmin",
};

// -------- STATUTS DE COMMANDE --------
// Suivi du cycle de vie d'une commande
const ORDER_STATUS = {
  // En attente : Commande créée mais pas encore traitée
  PENDING: "pending",
  // En traitement : Commande en cours de préparation
  PROCESSING: "processing",
  // Confirmée : Commande confirmée par le vendeur
  CONFIRMED: "confirmed",
  // Expédiée : Commande envoyée au client
  SHIPPED: "shipped",
  // Livrée : Commande reçue par le client
  DELIVERED: "delivered",
  // Annulée : Commande annulée par le client ou le vendeur
  CANCELLED: "cancelled",
  // Retournée : Produit retourné par le client
  RETURNED: "returned",
  // Remboursée : Argent remboursé au client
  REFUNDED: "refunded",
};

// -------- STATUTS DE PAIEMENT --------
const PAYMENT_STATUS = {
  // En attente : Paiement initié mais pas terminé
  PENDING: "pending",
  // Complété : Paiement réussi
  COMPLETED: "completed",
  // Échoué : Paiement refusé
  FAILED: "failed",
  // Remboursé : Paiement remboursé
  REFUNDED: "refunded",
  // Annulé : Paiement annulé
  CANCELLED: "cancelled",
};

// -------- MÉTHODES DE PAIEMENT --------
const PAYMENT_METHODS = {
  // Carte bancaire (Visa, Mastercard, etc.)
  CARD: "card",
  // PayPal
  PAYPAL: "paypal",
  // Coins de la plateforme
  COINS: "coins",
  // Virement bancaire
  BANK_TRANSFER: "bank_transfer",
  // Cryptomonnaies (Bitcoin, Ethereum, etc.)
  CRYPTO: "crypto",
};

// -------- TYPES D'ABONNEMENT --------
// Plans d'abonnement avec différents niveaux de bénéfices
const SUBSCRIPTION_TYPES = {
  // Basique : Accès limité, pas de réductions
  BASIC: "basic",
  // Premium : Réductions de 10%, coins bonus
  PREMIUM: "premium",
  // Pro : Réductions de 20%, coins bonus, support prioritaire
  PRO: "pro",
  // Entreprise : Réductions personnalisées, API, support dédié
  ENTERPRISE: "enterprise",
};

// -------- STATUTS DE SUPPORT --------
const SUPPORT_STATUS = {
  // Ouvert : Ticket créé, en attente de réponse
  OPEN: "open",
  // En cours : Ticket en traitement
  IN_PROGRESS: "in_progress",
  // Résolu : Problème résolu, en attente de confirmation
  RESOLVED: "resolved",
  // Fermé : Ticket fermé
  CLOSED: "closed",
};

// -------- PRIORITÉS DE SUPPORT --------
const SUPPORT_PRIORITY = {
  // Faible : Question générale, pas urgent
  LOW: "low",
  // Moyenne : Problème nécessitant une attention
  MEDIUM: "medium",
  // Haute : Problème important
  HIGH: "high",
  // Urgent : Problème critique (paiement, compte bloqué)
  URGENT: "urgent",
};

// -------- CATÉGORIES DE SUPPORT --------
const SUPPORT_CATEGORIES = {
  // Compte utilisateur (connexion, modification)
  ACCOUNT: "account",
  // Commande (suivi, problème)
  ORDER: "order",
  // Paiement (facturation, remboursement)
  PAYMENT: "payment",
  // Produit (information, qualité)
  PRODUCT: "product",
  // Technique (bug, problème technique)
  TECHNICAL: "technical",
  // Autre
  OTHER: "other",
};

// -------- TYPES D'ÉVÉNEMENTS (NOTIFICATIONS) --------
const EVENT_TYPES = {
  // Inscription d'un nouvel utilisateur
  USER_REGISTERED: "user.registered",
  // Vérification d'email
  USER_VERIFIED: "user.verified",
  // Connexion utilisateur
  USER_LOGIN: "user.login",
  // Création de commande
  ORDER_CREATED: "order.created",
  // Mise à jour de commande
  ORDER_UPDATED: "order.updated",
  // Paiement complété
  PAYMENT_COMPLETED: "payment.completed",
  // Abonnement activé
  SUBSCRIPTION_ACTIVATED: "subscription.activated",
  // Abonnement renouvelé
  SUBSCRIPTION_RENEWED: "subscription.renewed",
  // Abonnement expiré
  SUBSCRIPTION_EXPIRED: "subscription.expired",
  // Nouveau message de support
  SUPPORT_NEW_TICKET: "support.new_ticket",
  // Réponse à un ticket
  SUPPORT_RESPONSE: "support.response",
  // Produit ajouté
  PRODUCT_CREATED: "product.created",
  // Produit mis à jour
  PRODUCT_UPDATED: "product.updated",
  // Produit supprimé
  PRODUCT_DELETED: "product.deleted",
};

// -------- TYPES DE CACHE --------
const CACHE_TYPES = {
  // Cache des produits
  PRODUCTS: "products",
  // Cache des catégories
  CATEGORIES: "categories",
  // Cache des utilisateurs
  USERS: "users",
  // Cache des commandes
  ORDERS: "orders",
  // Cache des paramètres
  SETTINGS: "settings",
  // Cache des statistiques
  STATISTICS: "statistics",
};

// -------- DURÉES DE CACHE (en secondes) --------
const CACHE_DURATIONS = {
  // Court : 1 minute - Pour les données volatiles
  SHORT: 60,
  // Moyen : 5 minutes - Pour les données semi-statiques
  MEDIUM: 300,
  // Long : 1 heure - Pour les données statiques
  LONG: 3600,
  // Très long : 24 heures - Pour les données rarement mises à jour
  VERY_LONG: 86400,
  // Jamais : 0 secondes - Pas de cache
  NEVER: 0,
};

// -------- MESSAGES D'ERREUR --------
const ERROR_MESSAGES = {
  // ----- Authentification -----
  AUTH_FAILED: "Authentification échouée. Vérifiez vos identifiants.",
  TOKEN_EXPIRED: "Votre session a expiré. Veuillez vous reconnecter.",
  INVALID_TOKEN: "Token invalide. Veuillez vous reconnecter.",
  UNAUTHORIZED: "Vous devez être connecté pour accéder à cette ressource.",
  FORBIDDEN:
    "Vous n'avez pas les droits nécessaires pour accéder à cette ressource.",
  NOT_FOUND: "La ressource demandée n'existe pas.",

  // ----- Utilisateur -----
  USER_NOT_FOUND: "Utilisateur non trouvé.",
  USER_EXISTS: "Un utilisateur avec cet email existe déjà.",
  EMAIL_EXISTS: "Cet email est déjà utilisé par un autre compte.",
  INVALID_CREDENTIALS: "Email ou mot de passe incorrect.",
  ACCOUNT_DISABLED: "Votre compte a été désactivé. Contactez le support.",
  ACCOUNT_LOCKED: "Votre compte est verrouillé. Réessayez plus tard.",

  // ----- Produit -----
  PRODUCT_NOT_FOUND: "Produit non trouvé.",
  PRODUCT_OUT_OF_STOCK: "Ce produit est en rupture de stock.",
  PRODUCT_DISABLED: "Ce produit n'est plus disponible.",
  INVALID_PRODUCT_DATA: "Les données du produit sont invalides.",
  PRODUCT_IMAGE_REQUIRED: "Au moins une image est requise.",

  // ----- Commande -----
  ORDER_NOT_FOUND: "Commande non trouvée.",
  INVALID_ORDER_STATUS: "Statut de commande invalide.",
  ORDER_CANNOT_BE_CANCELLED: "Cette commande ne peut plus être annulée.",
  ORDER_ALREADY_SHIPPED: "La commande a déjà été expédiée.",
  ORDER_ALREADY_DELIVERED: "La commande a déjà été livrée.",

  // ----- Paiement -----
  PAYMENT_FAILED: "Le paiement a échoué. Veuillez réessayer.",
  INSUFFICIENT_COINS: "Vous n'avez pas assez de coins.",
  PAYMENT_METHOD_INVALID: "Méthode de paiement invalide.",
  PAYMENT_ALREADY_PROCESSED: "Ce paiement a déjà été traité.",

  // ----- Abonnement -----
  SUBSCRIPTION_NOT_FOUND: "Abonnement non trouvé.",
  SUBSCRIPTION_EXPIRED: "Votre abonnement a expiré.",
  SUBSCRIPTION_ACTIVE: "Vous avez déjà un abonnement actif.",

  // ----- Validation -----
  VALIDATION_ERROR: "Erreur de validation des données.",
  INVALID_INPUT: "Données d'entrée invalides.",
  MISSING_FIELDS: "Des champs obligatoires sont manquants.",
  INVALID_EMAIL: "Format d'email invalide.",
  INVALID_PASSWORD:
    "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
  INVALID_PHONE: "Format de numéro de téléphone invalide.",

  // ----- Base de données -----
  DB_CONNECTION_ERROR: "Erreur de connexion à la base de données.",
  DB_QUERY_ERROR: "Erreur lors de l'exécution de la requête.",
  DUPLICATE_ENTRY: "Une entrée en double a été détectée.",

  // ----- Fichiers -----
  FILE_UPLOAD_ERROR: "Erreur lors de l'upload du fichier.",
  FILE_TOO_LARGE: "Le fichier est trop volumineux.",
  FILE_TYPE_NOT_ALLOWED: "Type de fichier non autorisé.",
  FILE_NOT_FOUND: "Fichier non trouvé.",

  // ----- Général -----
  INTERNAL_SERVER_ERROR:
    "Une erreur interne est survenue. Veuillez réessayer plus tard.",
  SERVICE_UNAVAILABLE: "Le service est temporairement indisponible.",
  REQUEST_TIMEOUT: "La requête a expiré.",
  RATE_LIMIT_EXCEEDED: "Trop de requêtes. Veuillez réessayer plus tard.",
  MAINTENANCE_MODE: "Le site est en maintenance. Revenez plus tard.",
};

// -------- MESSAGES DE SUCCÈS --------
const SUCCESS_MESSAGES = {
  // ----- Utilisateur -----
  USER_CREATED: "Compte utilisateur créé avec succès.",
  USER_UPDATED: "Informations utilisateur mises à jour avec succès.",
  USER_DELETED: "Utilisateur supprimé avec succès.",
  USER_VERIFIED: "Email vérifié avec succès.",
  PASSWORD_RESET: "Mot de passe réinitialisé avec succès.",
  PASSWORD_CHANGED: "Mot de passe changé avec succès.",
  LOGIN_SUCCESS: "Connexion réussie.",
  LOGOUT_SUCCESS: "Déconnexion réussie.",

  // ----- Produit -----
  PRODUCT_CREATED: "Produit créé avec succès.",
  PRODUCT_UPDATED: "Produit mis à jour avec succès.",
  PRODUCT_DELETED: "Produit supprimé avec succès.",
  PRODUCT_RESTORED: "Produit restauré avec succès.",

  // ----- Commande -----
  ORDER_CREATED: "Commande créée avec succès.",
  ORDER_UPDATED: "Commande mise à jour avec succès.",
  ORDER_CANCELLED: "Commande annulée avec succès.",
  ORDER_CONFIRMED: "Commande confirmée avec succès.",
  ORDER_SHIPPED: "Commande expédiée avec succès.",
  ORDER_DELIVERED: "Commande marquée comme livrée.",

  // ----- Paiement -----
  PAYMENT_SUCCESS: "Paiement effectué avec succès.",
  PAYMENT_REFUNDED: "Remboursement effectué avec succès.",
  COINS_ADDED: "Coins ajoutés avec succès.",
  COINS_DEDUCTED: "Coins déduits avec succès.",

  // ----- Abonnement -----
  SUBSCRIPTION_ACTIVATED: "Abonnement activé avec succès.",
  SUBSCRIPTION_CANCELLED: "Abonnement annulé avec succès.",
  SUBSCRIPTION_RENEWED: "Abonnement renouvelé avec succès.",

  // ----- Support -----
  TICKET_CREATED: "Ticket de support créé avec succès.",
  TICKET_UPDATED: "Ticket mis à jour avec succès.",
  TICKET_RESOLVED: "Ticket marqué comme résolu.",

  // ----- Général -----
  OPERATION_SUCCESS: "Opération effectuée avec succès.",
  EMAIL_SENT: "Email envoyé avec succès.",
  DATA_SAVED: "Données sauvegardées avec succès.",
  DATA_DELETED: "Données supprimées avec succès.",
};

// -------- CONFIGURATIONS DES PAGINATIONS --------
const PAGINATION = {
  // Nombre d'éléments par page par défaut
  DEFAULT_LIMIT: 20,
  // Nombre maximum d'éléments par page
  MAX_LIMIT: 100,
  // Page par défaut
  DEFAULT_PAGE: 1,
  // Ordre de tri par défaut
  DEFAULT_SORT: "createdAt",
  // Ordre de tri par défaut
  DEFAULT_ORDER: "desc",
};

// -------- CONFIGURATIONS DES FICHIERS --------
const FILE_CONFIG = {
  // Taille maximale en MB
  MAX_SIZE_MB: 10,
  // Taille maximale en bytes (10 MB)
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  // Types autorisés
  ALLOWED_TYPES: {
    IMAGES: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ],
    DOCUMENTS: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    VIDEOS: ["video/mp4", "video/quicktime", "video/x-msvideo"],
    AUDIO: ["audio/mpeg", "audio/wav", "audio/ogg"],
  },
  // Nombre maximum de fichiers par upload
  MAX_FILES: 10,
};

// -------- CONFIGURATIONS DES ABONNEMENTS --------
const SUBSCRIPTION_CONFIG = {
  // Durée en jours
  DURATIONS: {
    MONTHLY: 30,
    QUARTERLY: 90,
    SEMESTRIAL: 180,
    YEARLY: 365,
  },
  // Réductions en pourcentage
  DISCOUNTS: {
    BASIC: 0,
    PREMIUM: 10,
    PRO: 20,
    ENTERPRISE: 30,
  },
  // Coins offerts par mois
  COINS: {
    BASIC: 0,
    PREMIUM: 100,
    PRO: 500,
    ENTERPRISE: 2000,
  },
  // Prix en euros
  PRICES: {
    BASIC: 0,
    PREMIUM: 9.99,
    PRO: 19.99,
    ENTERPRISE: 49.99,
  },
  // Fonctionnalités par abonnement
  FEATURES: {
    BASIC: ["Accès produits", "Support standard"],
    PREMIUM: [
      "Accès produits",
      "Support prioritaire",
      "10% réduction",
      "100 coins/mois",
    ],
    PRO: [
      "Accès produits",
      "Support prioritaire",
      "20% réduction",
      "500 coins/mois",
      "API accès",
    ],
    ENTERPRISE: [
      "Accès produits",
      "Support dédié",
      "30% réduction",
      "2000 coins/mois",
      "API complet",
      "Dashboard personnalisé",
    ],
  },
};

// -------- CONFIGURATIONS DES COINS --------
const COIN_CONFIG = {
  // 1 coin = 0.01 euro
  VALUE_PER_COIN: 0.01,
  // Packs de coins
  PACKS: [
    { amount: 100, price: 0.99, discount: 0 },
    { amount: 500, price: 4.49, discount: 10 },
    { amount: 1000, price: 8.99, discount: 10 },
    { amount: 5000, price: 39.99, discount: 20 },
    { amount: 10000, price: 69.99, discount: 30 },
  ],
  // Coins minimum pour une transaction
  MIN_TRANSACTION: 10,
  // Coins maximum par transaction
  MAX_TRANSACTION: 10000,
};

// -------- CONFIGURATIONS DE SÉCURITÉ --------
const SECURITY_CONFIG = {
  // Tentatives de connexion maximum
  MAX_LOGIN_ATTEMPTS: 5,
  // Temps de verrouillage en minutes
  LOCKOUT_TIME: 15,
  // Force du mot de passe
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRES_UPPERCASE: true,
  PASSWORD_REQUIRES_LOWERCASE: true,
  PASSWORD_REQUIRES_NUMBER: true,
  PASSWORD_REQUIRES_SPECIAL: true,
  // JWT
  JWT_EXPIRY: "30d",
  JWT_REFRESH_EXPIRY: "7d",
  // Session
  SESSION_TIMEOUT: 3600, // 1 heure
  // Rate limiting
  RATE_LIMIT_WINDOW: 15, // minutes
  RATE_LIMIT_MAX: 100, // requêtes par fenêtre
};

// -------- CONFIGURATIONS DES API --------
const API_CONFIG = {
  // Version de l'API
  VERSION: "v1",
  // Préfixe des routes API
  PREFIX: "/api/v1",
  // Timeout des requêtes en millisecondes
  TIMEOUT: 30000,
  // Retry policy
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  // Format de réponse
  RESPONSE_FORMAT: {
    SUCCESS: "success",
    ERROR: "error",
  },
};

// -------- CONFIGURATIONS DES EMAILS --------
const EMAIL_CONFIG = {
  // Templates
  TEMPLATES: {
    WELCOME: "welcome",
    PASSWORD_RESET: "password_reset",
    ORDER_CONFIRMATION: "order_confirmation",
    ORDER_STATUS: "order_status",
    SUPPORT_TICKET: "support_ticket",
    SUBSCRIPTION_ACTIVATED: "subscription_activated",
    SUBSCRIPTION_RENEWAL: "subscription_renewal",
    SUBSCRIPTION_EXPIRY: "subscription_expiry",
    PAYMENT_RECEIPT: "payment_receipt",
    COINS_ADDED: "coins_added",
  },
  // Délais d'envoi
  DELAYS: {
    IMMEDIATE: 0,
    SHORT: 5, // minutes
    MEDIUM: 15, // minutes
    LONG: 60, // minutes
  },
  // Taux d'envoi
  RATE_LIMIT: {
    PER_MINUTE: 5,
    PER_HOUR: 100,
    PER_DAY: 500,
  },
};

// -------- CONFIGURATIONS DES COOKIES --------
const COOKIE_CONFIG = {
  // Cookie d'authentification
  AUTH_COOKIE: "auth_token",
  // Cookie de rafraîchissement
  REFRESH_COOKIE: "refresh_token",
  // Durée de vie des cookies en jours
  MAX_AGE: 30,
  // Secure (HTTPS uniquement)
  SECURE: process.env.NODE_ENV === "production",
  // HttpOnly (pas accessible en JavaScript)
  HTTP_ONLY: true,
  // SameSite
  SAME_SITE: "lax",
  // Domain
  DOMAIN: process.env.COOKIE_DOMAIN || undefined,
};

// -------- CONFIGURATIONS DES PÉRIODES --------
const PERIODS = {
  // En secondes
  SECOND: 1,
  MINUTE: 60,
  HOUR: 3600,
  DAY: 86400,
  WEEK: 604800,
  MONTH: 2592000, // 30 jours
  YEAR: 31536000, // 365 jours
  // En millisecondes
  MS_SECOND: 1000,
  MS_MINUTE: 60000,
  MS_HOUR: 3600000,
  MS_DAY: 86400000,
  MS_WEEK: 604800000,
  MS_MONTH: 2592000000,
  MS_YEAR: 31536000000,
};

// Exporter toutes les constantes
export default {
  // Rôles
  ROLES,

  // Commandes
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,

  // Abonnements
  SUBSCRIPTION_TYPES,
  SUBSCRIPTION_CONFIG,

  // Support
  SUPPORT_STATUS,
  SUPPORT_PRIORITY,
  SUPPORT_CATEGORIES,

  // Événements
  EVENT_TYPES,

  // Cache
  CACHE_TYPES,
  CACHE_DURATIONS,

  // Messages
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,

  // Configurations
  PAGINATION,
  FILE_CONFIG,
  SECURITY_CONFIG,
  API_CONFIG,
  EMAIL_CONFIG,
  COOKIE_CONFIG,
  COIN_CONFIG,

  // Périodes
  PERIODS,
};
