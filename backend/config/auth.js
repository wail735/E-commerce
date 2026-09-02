// Configuration JWT (JSON Web Token) pour l'authentification
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/**
 * JWT : Standard ouvert (RFC 7519) qui définit une manière compacte
 * et auto-suffisante de transmettre des informations entre parties
 * sous forme d'objet JSON.
 *
 * Utilisation : Authentification, autorisation, échange d'informations
 *
 * Structure : header.payload.signature
 * - Header : Algorithme et type de token
 * - Payload : Données (claims)
 * - Signature : Vérification d'intégrité
 */

// Génération du token JWT
const generateToken = (id, role) => {
  // jwt.sign(payload, secret, options)
  // payload : Données à encoder
  // secret : Clé secrète (dans .env)
  // options : Expiration, algorithme, etc.
  return jwt.sign(
    {
      id,
      role,
      // Timestamp de création pour suivi
      iat: Math.floor(Date.now() / 1000),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || "30d", // Expiration par défaut 30 jours
      algorithm: "HS256", // Algorithme HMAC-SHA256
    },
  );
};

// Vérification et décodage du token avec gestion complète des erreurs
const verifyToken = (token) => {
  try {
    // jwt.verify(token, secret) : Vérifie la signature et le payload
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // Différents types d'erreurs JWT :
    // - TokenExpiredError : Le token a expiré (expiration dépassée)
    // - JsonWebTokenError : Le token est invalide (mal formé, mauvaise signature)
    // - NotBeforeError : Le token n'est pas encore actif (nbf > maintenant)
    // - SyntaxError : Le token est mal formaté (structure incorrecte)

    // Log de l'erreur pour débogage
    console.error(
      "Erreur de vérification du token:",
      error.name,
      error.message,
    );

    // Retourne un objet d'erreur structuré
    return {
      valid: false,
      error: {
        name: error.name,
        message: error.message,
        type:
          error.name === "TokenExpiredError"
            ? "EXPIRED"
            : error.name === "JsonWebTokenError"
              ? "INVALID"
              : error.name === "NotBeforeError"
                ? "NOT_ACTIVE"
                : "UNKNOWN",
      },
    };
  }
};

// Nouvelle fonction : Vérification du token avec gestion détaillée
const verifyTokenDetailed = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      valid: true,
      decoded: decoded,
    };
  } catch (error) {
    // Gestion détaillée des erreurs
    let errorType = "UNKNOWN";
    let errorMessage = error.message;
    let statusCode = 401;

    switch (error.name) {
      case "TokenExpiredError":
        // Le token a expiré
        errorType = "EXPIRED";
        errorMessage = "Le token a expiré. Veuillez vous reconnecter.";
        statusCode = 401;
        break;

      case "JsonWebTokenError":
        // Token invalide (mauvaise signature, mal formé, etc.)
        errorType = "INVALID";
        errorMessage = "Token invalide. Vérifiez vos identifiants.";
        statusCode = 401;
        break;

      case "NotBeforeError":
        // Token pas encore actif
        errorType = "NOT_ACTIVE";
        errorMessage = "Le token n'est pas encore actif.";
        statusCode = 401;
        break;

      case "SyntaxError":
        // Token mal formaté
        errorType = "MALFORMED";
        errorMessage = "Le token est mal formaté.";
        statusCode = 400;
        break;

      default:
        // Erreur inconnue
        errorType = "UNKNOWN";
        errorMessage = "Erreur inattendue lors de la vérification du token.";
        statusCode = 500;
        break;
    }

    console.error(`Erreur JWT [${errorType}]:`, error.message);

    return {
      valid: false,
      error: {
        name: error.name,
        type: errorType,
        message: errorMessage,
        statusCode: statusCode,
      },
    };
  }
};

// Fonction pour rafraîchir un token expiré
const refreshToken = (expiredToken) => {
  try {
    // Décoder le token sans vérifier l'expiration
    const decoded = jwt.decode(expiredToken, { complete: true });

    if (!decoded || !decoded.payload) {
      throw new Error("Token invalide pour le rafraîchissement");
    }

    const { id, role } = decoded.payload;

    // Générer un nouveau token
    return generateToken(id, role);
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token:", error.message);
    return null;
  }
};

// Fonction pour extraire le token du header Authorization
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      valid: false,
      error: "Header Authorization manquant ou mal formé",
      token: null,
    };
  }

  // Extraction du token (enlever 'Bearer ')
  const token = authHeader.split(" ")[1];

  if (!token) {
    return {
      valid: false,
      error: "Token manquant dans le header",
      token: null,
    };
  }

  return {
    valid: true,
    token: token,
  };
};

// Hachage du mot de passe avec bcrypt
// bcrypt : Algorithme de hachage adaptatif basé sur Blowfish
// Utilisé pour stocker les mots de passe de manière sécurisée
const hashPassword = async (password) => {
  // genSalt : Génère un "sel" (valeur aléatoire)
  // Salt rounds : 10 est un bon compromis sécurité/performance
  const salt = await bcrypt.genSalt(10);
  // hash : Combine le mot de passe et le sel pour créer un hash
  return bcrypt.hash(password, salt);
};

// Comparaison du mot de passe avec le hash
export const comparePassword = async (enteredPassword, hashedPassword) => {
  // compare : Compare un mot de passe en clair avec un hash
  return bcrypt.compare(enteredPassword, hashedPassword);
};

// Vérification de la force du mot de passe
const isPasswordStrong = (password) => {
  // Au moins 8 caractères
  if (password.length < 8) return false;

  // Au moins une majuscule
  if (!/[A-Z]/.test(password)) return false;

  // Au moins une minuscule
  if (!/[a-z]/.test(password)) return false;

  // Au moins un chiffre
  if (!/\d/.test(password)) return false;

  // Au moins un caractère spécial
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;

  return true;
};

// Génération d'un token avec des claims personnalisés
const generateCustomToken = (user, additionalClaims = {}) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
      ...additionalClaims,
      iat: Math.floor(Date.now() / 1000),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || "30d",
      algorithm: "HS256",
      // Audience et émetteur pour plus de sécurité
      audience: process.env.JWT_AUDIENCE || "myapp",
      issuer: process.env.JWT_ISSUER || "myapp.com",
    },
  );
};

// Vérification du token avec validation d'audience et d'émetteur
const verifyTokenWithOptions = (token, options = {}) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      audience: options.audience || process.env.JWT_AUDIENCE,
      issuer: options.issuer || process.env.JWT_ISSUER,
      // Vérification des claims personnalisés
      complete: true,
    });

    return {
      valid: true,
      decoded: decoded.payload,
      header: decoded.header,
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
      type: error.name,
    };
  }
};

export default {
  generateToken,
  verifyToken,
  verifyTokenDetailed,
  refreshToken,
  extractTokenFromHeader,
  hashPassword,
  comparePassword,
  isPasswordStrong,
  generateCustomToken,
  verifyTokenWithOptions,
};
