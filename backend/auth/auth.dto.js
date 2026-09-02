// ============================================================================
// FICHIER : backend 2/auth/auth.dto.js
// RÔLE : Schémas de validation Joi pour les requêtes d'authentification (DTOs)
// ============================================================================

// 1. Importation du module de validation Joi
import Joi from "joi";

/**
 * Schéma de validation DTO pour l'inscription d'un nouvel utilisateur (Signup)
 */
export const registerDTO = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Le nom est obligatoire",
    "string.min": "Le nom doit comporter au moins 2 caractères",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "L'adresse email doit être valide",
    "string.empty": "L'email est obligatoire",
  }),
  password: Joi.string().min(6).max(50).required().messages({
    "string.min": "Le mot de passe doit comporter au moins 6 caractères",
    "string.empty": "Le mot de passe est obligatoire",
  }),
});

/**
 * Schéma de validation DTO pour la connexion (Login)
 */
export const loginDTO = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Format d'email invalide",
    "string.empty": "L'email est obligatoire",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Le mot de passe est obligatoire",
  }),
});

/**
 * Schéma de validation DTO pour la demande de réinitialisation (Forgot Password)
 */
export const forgotPasswordDTO = Joi.object({
  email: Joi.string().email().required(),
});

/**
 * Schéma de validation DTO pour la réinitialisation effective (Reset Password)
 */
export const resetPasswordDTO = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});
