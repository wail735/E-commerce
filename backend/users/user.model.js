// ============================================================================
// FICHIER : backend 2/users/user.model.js
// RÔLE : Schéma Mongoose pour la collection Utilisateurs (Users & Auth)
// ============================================================================

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    // Nom complet de l'utilisateur
    name: {
      type: String,
      required: [true, "Le nom est obligatoire"],
      trim: true,
      minlength: [2, "Le nom doit contenir au moins 2 caractères"],
    },
    // Adresse email unique
    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    // URL de la photo de profil
    profilePicture: {
      type: String,
      default: null,
    },
    // Numéro de téléphone
    phone: {
      type: String,
      default: null,
    },
    // Adresse
    address: {
      type: String,
      default: null,
    },
    // Mot de passe haché (masqué par défaut lors des requêtes select)
    password: {
      type: String,
      // Le mot de passe n'est pas requis si l'utilisateur se connecte avec Google
      required: function() {
        return !this.googleId;
      },
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
      select: false,
    },
    // Rôle de l'utilisateur dans le système (user, seller, admin, superAdmin)
    role: {
      type: String,
      enum: ["user", "seller", "admin", "superAdmin"],
      default: "user",
    },
    // Détails de la boutique (uniquement pour les vendeurs)
    storeName: {
      type: String,
      trim: true,
    },
    storeDescription: {
      type: String,
    },
    storeLogo: {
      type: String,
    },
    // État d'activation du compte
    isActive: {
      type: Boolean,
      default: true,
    },
    // Solde de coins (monnaie virtuelle de la plateforme)
    coins: {
      type: Number,
      default: 0,
      min: [0, "Le solde de coins ne peut pas être négatif"],
    },
    // Statut de l'abonnement actif (basic, premium, pro, enterprise)
    subscription: {
      plan: {
        type: String,
        enum: ["none", "basic", "premium", "pro", "enterprise"],
        default: "none",
      },
      expiryDate: Date,
      discountRate: {
        type: Number,
        default: 0, // Réduction en % (ex: 10 pour 10%)
      },
    },
    // Panier d'achat de l'utilisateur (Shopping Cart)
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
    // Liste de souhaits / Favoris (Wishlist)
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    // Token de réinitialisation de mot de passe (si demandé)
    resetPasswordToken: String,
    // Expiration du token de réinitialisation (ex: 10 minutes)
    resetPasswordExpires: Date,
    
    // Nouveaux champs pour notre logique d'authentification OTP et Google
    googleId: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
  },
  {
    // Horodatage automatique (createdAt, updatedAt)
    timestamps: true,
  },
);

// Hasher le mot de passe avant de sauvegarder
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour comparer les mots de passe
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Méthode pour générer un JWT
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET || "super_secret_jwt_key_aliexpress", {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};


// Exportation du modèle User (évite la ré-initialisation si déjà enregistré)
export const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
