// ============================================================================
// FICHIER : backend 2/users/user.controller.js
// RÔLE : Contrôleur des endpoints Panier, Wishlist, Candidature Boutique Pro et Vendeur
// ============================================================================

import * as userService from "./user.service.js";
import {
  addToCartDTO,
  updateCartQuantityDTO,
  wishlistActionDTO,
} from "./user.dto.js";

/**
 * Ajouter au panier
 */
export const addToCart = async (req, res) => {
  try {
    const { error, value } = addToCartDTO.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const cart = await userService.addToCart(
      req.user._id,
      value.productId,
      value.quantity,
    );
    return res.status(200).json({
      success: true,
      message: "Produit ajouté au panier !",
      data: cart,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Obtenir le panier
 */
export const getCart = async (req, res) => {
  try {
    const cart = await userService.getCart(req.user._id);
    return res.status(200).json({ success: true, data: cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Mettre à jour la quantité d'un produit du panier
 */
export const updateCartQuantity = async (req, res) => {
  try {
    const { error, value } = updateCartQuantityDTO.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const cart = await userService.updateCartQuantity(
      req.user._id,
      value.productId,
      value.quantity,
    );
    return res
      .status(200)
      .json({ success: true, message: "Quantité mise à jour", data: cart });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Supprimer du panier
 */
export const removeFromCart = async (req, res) => {
  try {
    const cart = await userService.removeFromCart(
      req.user._id,
      req.params.productId,
    );
    return res
      .status(200)
      .json({ success: true, message: "Produit retiré du panier", data: cart });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Ajouter / Retirer de la Wishlist
 */
export const toggleWishlist = async (req, res) => {
  try {
    const { error, value } = wishlistActionDTO.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const result = await userService.toggleWishlist(
      req.user._id,
      value.productId,
    );
    return res
      .status(200)
      .json({ success: true, action: result.action, data: result.wishlist });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Obtenir la liste des favoris (Wishlist)
 */
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await userService.getWishlist(req.user._id);
    return res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Soumettre un dossier de candidature pour devenir Boutique Pro
 */
export const applyProShop = async (req, res) => {
  try {
    const result = await userService.applyForProShop(req.user._id, req.body);
    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.proShopDetails,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Consulter l'état de sa candidature Boutique Pro
 */
export const getProShopStatus = async (req, res) => {
  try {
    const data = await userService.getProShopStatus(req.user._id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Accéder au Tableau de Bord Vendeur (Ventes & Solde)
 */
export const getSellerDashboard = async (req, res) => {
  try {
    const data = await userService.getSellerDashboard(req.user._id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * S'inscrire comme vendeur (simplifié - validation immédiate)
 */
export const becomeSeller = async (req, res) => {
  try {
    const { storeName, storeDescription, phone } = req.body;
    if (!storeName) {
      return res.status(400).json({ success: false, message: "Le nom de la boutique est obligatoire." });
    }
    
    const User = (await import("./user.model.js")).default;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { role: "seller", storeName, storeDescription },
      { new: true, select: "-password" }
    );

    return res.status(200).json({
      success: true,
      message: "Félicitations ! Vous êtes maintenant vendeur sur MoExpress.",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Envoyer un OTP de vérification vendeur par email
 */
export const sendSellerOtp = async (req, res) => {
  try {
    const User = (await import("./user.model.js")).default;
    const sendEmail = (await import("../utils/sendEmail.js")).default;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    await User.findByIdAndUpdate(req.user._id, { otp, otpExpires });

    if (process.env.BREVO_API_KEY) {
      try {
        await sendEmail({
          email: req.user.email,
          subject: "Vérification de votre boutique MoExpress",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #f9f9f9; border-radius: 12px;">
              <h2 style="color: #FF4D20; text-align: center;">🛍️ MoExpress Seller</h2>
              <p>Bonjour <strong>${req.user.name}</strong>,</p>
              <p>Voici votre code de vérification pour activer votre espace vendeur :</p>
              <div style="text-align: center; margin: 24px 0;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #FF4D20; background: #fff3f0; padding: 16px 24px; border-radius: 8px; border: 2px solid #FF4D20;">${otp}</span>
              </div>
              <p style="color: #888; font-size: 13px;">Ce code expire dans <strong>10 minutes</strong>. Ne le partagez avec personne.</p>
            </div>
          `,
        });
        return res.status(200).json({ success: true, message: "Code envoyé à votre email via Brevo." });
      } catch (emailError) {
        const brevoErrorDetails = emailError.response?.data?.message || emailError.message;
        console.error("[BREVO ERROR] Détails:", brevoErrorDetails);
        // Fallback: Retourne le devOtp pour que le frontend s'auto-remplisse
        return res.status(200).json({ 
          success: true, 
          message: `Brevo API Error: ${brevoErrorDetails}`, 
          devOtp: otp 
        });
      }
    } else {
      console.log(`[WARNING] BREVO NON CONFIGURE. OTP pour ${req.user.email} : ${otp}`);
      return res.status(200).json({ success: true, message: "Brevo non configuré. Mode dev actif.", devOtp: otp });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Vérifier l'OTP vendeur et activer le rôle seller
 */
export const verifySellerOtp = async (req, res) => {
  try {
    const { otp, storeName, storeDescription } = req.body;
    const User = (await import("./user.model.js")).default;

    const user = await User.findById(req.user._id).select("+otp +otpExpires");
    if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ success: false, message: "Code invalide ou expiré." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { role: "seller", storeName, storeDescription, otp: null, otpExpires: null },
      { new: true, select: "-password" }
    );

    return res.status(200).json({
      success: true,
      message: "Félicitations ! Votre boutique est maintenant active.",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Obtenir le profil public d'une boutique vendeur
 */
export const getStoreProfile = async (req, res) => {
  try {
    const store = await userService.getStoreProfile(req.params.id);
    return res.status(200).json({ success: true, data: store });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

/**
 * Mettre à jour le profil de l'utilisateur
 */
export const updateProfile = async (req, res) => {
  try {
    const User = (await import("./user.model.js")).default;
    const { firstName, lastName, email, phone, address } = req.body;
    
    // Combine firstName and lastName into name if provided, otherwise keep existing logic
    const name = (firstName && lastName) ? `${firstName} ${lastName}` : req.body.name;

    const updateData = { email, phone, address };
    if (name) updateData.name = name;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true, select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    return res.status(200).json({
      success: true,
      message: "Profil mis à jour avec succès",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Mettre à jour la photo de profil
 */
export const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Aucun fichier fourni" });
    }

    const cloudinaryHelper = (await import("../config/cloudinary.js")).default;
    const result = await cloudinaryHelper.uploadImage(req.file.path, { folder: "profiles" });

    const User = (await import("./user.model.js")).default;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: result.url },
      { new: true, runValidators: true, select: "-password" }
    );

    return res.status(200).json({
      success: true,
      message: "Photo de profil mise à jour",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Ajouter une adresse
 */
export const addAddress = async (req, res) => {
  try {
    const user = req.user; // vient du middleware protect
    const { name, street, city, zipCode, country, phone, isDefault } = req.body;

    if (!name || !street || !city || !zipCode) {
      return res.status(400).json({ success: false, message: "Nom, rue, ville et code postal sont requis." });
    }

    // Si c'est la première adresse ou isDefault est true, on désactive les autres
    if (isDefault || user.addresses.length === 0) {
      user.addresses.forEach(a => a.isDefault = false);
    }

    const newAddress = {
      name,
      street,
      city,
      zipCode,
      country: country || 'Algérie',
      phone,
      isDefault: isDefault || user.addresses.length === 0
    };

    user.addresses.push(newAddress);
    await user.save();

    return res.status(201).json({ success: true, message: "Adresse ajoutée avec succès.", data: user.addresses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Mettre à jour une adresse
 */
export const updateAddress = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { name, street, city, zipCode, country, phone, isDefault } = req.body;

    const addressIndex = user.addresses.findIndex(a => a._id.toString() === id);
    if (addressIndex === -1) {
      return res.status(404).json({ success: false, message: "Adresse non trouvée." });
    }

    if (isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }

    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex].toObject(),
      name: name || user.addresses[addressIndex].name,
      street: street || user.addresses[addressIndex].street,
      city: city || user.addresses[addressIndex].city,
      zipCode: zipCode || user.addresses[addressIndex].zipCode,
      country: country || user.addresses[addressIndex].country,
      phone: phone !== undefined ? phone : user.addresses[addressIndex].phone,
      isDefault: isDefault !== undefined ? isDefault : user.addresses[addressIndex].isDefault
    };

    await user.save();
    return res.status(200).json({ success: true, message: "Adresse mise à jour.", data: user.addresses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Supprimer une adresse
 */
export const deleteAddress = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const addressIndex = user.addresses.findIndex(a => a._id.toString() === id);
    if (addressIndex === -1) {
      return res.status(404).json({ success: false, message: "Adresse non trouvée." });
    }

    const wasDefault = user.addresses[addressIndex].isDefault;
    
    // Supprimer l'adresse
    user.addresses.splice(addressIndex, 1);

    // Si on a supprimé l'adresse par défaut et qu'il en reste, on met la première par défaut
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    return res.status(200).json({ success: true, message: "Adresse supprimée.", data: user.addresses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
