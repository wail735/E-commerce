// ============================================================================
// FICHIER : backend 2/auth/auth.service.js
// RÔLE : Logique métier d'authentification (JWT, Bcrypt, Inscription, Connexion, Reset Password)
// ============================================================================

// 1. Importation du modèle User
import User from "./auth.model.js";

// 2. Importation de BcryptJS pour le hachage et la comparaison des mots de passe
import bcrypt from "bcryptjs";

// 3. Importation de jsonwebtoken pour générer et signer les tokens JWT
import jwt from "jsonwebtoken";

// 4. Importation de crypto natif Node.js pour générer des tokens aléatoires hexadécimaux
import crypto from "crypto";

// 5. Importation du service d'envoi d'emails Nodemailer
import { sendPasswordResetEmail } from "../config/email.js";

/**
 * Génère un jeton de sécurité JWT signé.
 * @param {string} userId - ID unique Mongo de l'utilisateur
 * @param {string} role - Rôle de l'utilisateur (user, admin, superAdmin)
 */
export const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET || "super_secret_jwt_key_aliexpress",
    { expiresIn: process.env.JWT_EXPIRE || "30d" },
  );
};

/**
 * Service d'inscription d'un nouvel utilisateur (Signup)
 */
export const registerUser = async ({ name, email, password }) => {
  // Vérifie si un utilisateur avec cet email existe déjà en BDD
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error("Un compte existe déjà avec cette adresse email.");
  }

  // Génère un sel de hachage Bcrypt à 10 tours
  const salt = await bcrypt.genSalt(10);
  // Hache le mot de passe en clair
  const hashedPassword = await bcrypt.hash(password, salt);

  // Crée l'utilisateur dans MongoDB
  const newUser = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: "user",
  });

  // Génère un token JWT d'authentification
  const token = generateToken(newUser._id, newUser.role);

  return {
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      coins: newUser.coins,
      subscription: newUser.subscription,
    },
    token,
  };
};

/**
 * Service de connexion d'un utilisateur (Login)
 */
export const loginUser = async ({ email, password }) => {
  // Recherche l'utilisateur par email et inclut le mot de passe masqué avec +password
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );
  if (!user) {
    throw new Error("Adresse email ou mot de passe incorrect.");
  }

  // Vérifie si le compte est désactivé
  if (!user.isActive) {
    throw new Error(
      "Votre compte a été désactivé. Veuillez contacter le support.",
    );
  }

  // Compare le mot de passe saisi avec le hash stocké
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Adresse email ou mot de passe incorrect.");
  }

  // Génère un token JWT
  const token = generateToken(user._id, user.role);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      coins: user.coins,
      subscription: user.subscription,
    },
    token,
  };
};

/**
 * Service d'oubli de mot de passe (Forgot Password)
 */
export const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error("Aucun compte n'est associé à cette adresse email.");
  }

  // Génère un token de réinitialisation aléatoire de 32 octets (hexadécimal)
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Enregistre le token et son expiration (10 minutes) sur l'utilisateur
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // Envoie l'email via SMTP Nodemailer
  await sendPasswordResetEmail(user.email, resetToken);

  return { message: "Un email de réinitialisation vous a été envoyé." };
};

/**
 * Service de réinitialisation de mot de passe (Reset Password)
 */
export const resetPassword = async (resetToken, newPassword) => {
  // Recherche l'utilisateur par token valide et non expiré
  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Le jeton de réinitialisation est invalide ou a expiré.");
  }

  // Hache le nouveau mot de passe
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  // Efface le token de réinitialisation
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return {
    message:
      "Mot de passe réinitialisé avec succès. Vous pouvez vous connecter.",
  };
};

export default {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  generateToken,
};
