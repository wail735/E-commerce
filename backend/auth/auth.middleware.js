// ============================================================================
// FICHIER : backend 2/auth/auth.middleware.js
// RÔLE : Middlewares de protection des routes et de contrôle d'accès basé sur les rôles (RBAC)
// ============================================================================

// 1. Importation du module jsonwebtoken pour vérifier les tokens JWT
import jwt from "jsonwebtoken";

// 2. Importation du modèle User
import User from "./auth.model.js";

/**
 * Middleware qui vérifie la présence et la validité d'un token JWT dans les headers HTTP (Bearer token).
 * Injecte l'utilisateur authentifié dans req.user.
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Extrait le token du header Authorization: Bearer <TOKEN>
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Si aucun token n'est présent, renvoyer une erreur 401 Non Autorisé
    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Accès refusé. Veuillez vous connecter pour accéder à cette ressource.",
      });
    }

    // 2. Vérifie la signature et la validité du token JWT avec la clé secrète
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "super_secret_jwt_key_aliexpress",
    );

    // 3. Recherche l'utilisateur en BDD
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "L'utilisateur associé à ce jeton n'existe plus.",
      });
    }

    // 4. Vérifie si le compte utilisateur est actif
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Votre compte est désactivé.",
      });
    }

    // 5. Attache le document utilisateur à req.user et passe au middleware suivant
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Jeton d'authentification invalide ou expiré.",
    });
  }
};

/**
 * Middleware d'autorisation basé sur les rôles (Role-Based Access Control - RBAC).
 * @param  {...string} roles - Liste des rôles autorisés (ex: 'admin', 'superAdmin')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Vérifie si le rôle de l'utilisateur connecté fait partie des rôles autorisés
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Droits insuffisants. Le rôle [${req.user?.role}] n'est pas autorisé à effectuer cette action.`,
      });
    }
    next();
  };
};
