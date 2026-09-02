// ============================================================================
// FICHIER : backend 2/ads/ad.model.js
// RÔLE : Schéma Mongoose pour le Système de Publicités (Photos, Vidéos & Promos Boutiques Pro)
// ============================================================================

import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    // Titre ou nom de la campagne publicitaire
    title: {
      type: String,
      required: [true, "Le titre de la publicité est obligatoire"],
      trim: true,
    },
    // Type de fichier multimédia ('image' ou 'video')
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
      default: "image",
    },
    // URL du média (hébergé sur Cloudinary ou serveur externe)
    mediaUrl: {
      type: String,
      required: [true, "L'URL de l'image ou de la vidéo est obligatoire"],
    },
    // Lien de redirection lors du clic sur la pub (Ex: Lien vers la boutique ou le produit)
    targetUrl: {
      type: String,
      required: [true, "Le lien de redirection est obligatoire"],
    },
    // Emplacement d'affichage sur le site ('homepage_banner', 'sidebar', 'product_page')
    placement: {
      type: String,
      enum: ["homepage_banner", "sidebar", "product_page"],
      default: "homepage_banner",
    },
    // Origine de la publicité : créee par SuperAdmin ou achetée par un Vendeur Pro
    type: {
      type: String,
      enum: ["super_admin", "boutique_promotion"],
      default: "super_admin",
    },
    // Référence vers l'utilisateur/vendeur de la Boutique Pro (si boutique_promotion)
    advertiser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Produit spécifique mis en avant (optionnel)
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    // Prix payé par le vendeur pour l'emplacement publicitaire (€)
    pricePaid: {
      type: Number,
      default: 0,
    },
    // Statut de modération et d'activation de la publicité
    status: {
      type: String,
      enum: ["pending_approval", "active", "rejected", "expired"],
      default: "active",
    },
    // Motif de refus en cas de rejet par le SuperAdmin
    rejectionReason: {
      type: String,
      default: "",
    },
    // Date de début et date de fin de la campagne publicitaire
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    // Activation globale (Boolean toggle facile pour le SuperAdmin)
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Ad = mongoose.models.Ad || mongoose.model("Ad", adSchema);
export default Ad;
