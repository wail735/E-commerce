// ============================================================================
// FICHIER : backend 2/social/social.model.js
// RÔLE : Schémas Mongoose pour les Amis, Avis Produits, Likes et Partages
// ============================================================================

import mongoose from "mongoose";

// 1. Schéma pour la gestion du Réseau d'Amis entre Utilisateurs
const friendRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// 2. Schéma pour les Avis, Commentaires, Likes et Partages de Produits
const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    sharesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const FriendRequest = mongoose.models.FriendRequest || mongoose.model("FriendRequest", friendRequestSchema);
export const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default {
  FriendRequest,
  Review,
};
