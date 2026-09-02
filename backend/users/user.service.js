// ============================================================================
// FICHIER : backend 2/users/user.service.js
// RÔLE : Logique métier des utilisateurs (Panier, Wishlist, Candidature Boutique Pro & Tableau Vendeur)
// ============================================================================

import User from "./user.model.js";
import Product from "../products/product.model.js";
import Order from "../orders/order.model.js";
import { createNotification } from "../notifications/notification.service.js";

/**
 * Ajouter un produit au panier d'un utilisateur
 */
export const addToCart = async (userId, productId, quantity = 1) => {
  const user = await User.findById(userId);
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Le produit spécifié n'existe pas.");
  }

  // Vérifie si le produit est déjà présent dans le panier
  const existingCartItemIndex = user.cart.findIndex(
    (item) => item.product.toString() === productId,
  );

  if (existingCartItemIndex > -1) {
    user.cart[existingCartItemIndex].quantity += Number(quantity);
  } else {
    user.cart.push({ product: productId, quantity: Number(quantity) });
  }

  await user.save();
  return user.populate("cart.product");
};

/**
 * Mettre à jour la quantité d'un article dans le panier
 */
export const updateCartQuantity = async (userId, productId, quantity) => {
  const user = await User.findById(userId);
  const cartItem = user.cart.find(
    (item) => item.product.toString() === productId,
  );

  if (!cartItem) {
    throw new Error("Produit non trouvé dans le panier.");
  }

  cartItem.quantity = Number(quantity);
  await user.save();
  return user.populate("cart.product");
};

/**
 * Retirer un article du panier
 */
export const removeFromCart = async (userId, productId) => {
  const user = await User.findById(userId);
  user.cart = user.cart.filter((item) => item.product.toString() !== productId);
  await user.save();
  return user.populate("cart.product");
};

/**
 * Récupérer le panier de l'utilisateur avec les détails des produits
 */
export const getCart = async (userId) => {
  const user = await User.findById(userId).populate("cart.product");
  return user.cart;
};

/**
 * Ajouter ou supprimer un produit de la liste de souhaits (Toggle Wishlist)
 */
export const toggleWishlist = async (userId, productId) => {
  const user = await User.findById(userId);
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Produit non trouvé.");
  }

  const index = user.wishlist.indexOf(productId);
  let action = "";

  if (index > -1) {
    user.wishlist.splice(index, 1);
    action = "removed";
  } else {
    user.wishlist.push(productId);
    action = "added";
  }

  await user.save();
  return { action, wishlist: user.wishlist };
};

/**
 * Récupérer la liste des favoris avec les détails produits
 */
export const getWishlist = async (userId) => {
  const user = await User.findById(userId).populate("wishlist");
  return user.wishlist;
};

/**
 * Postuler pour obtenir une Boutique Pro (Candidature Vendeur Pro)
 */
export const applyForProShop = async (
  userId,
  {
    shopName,
    description,
    category,
    logo = "",
    banner = "",
    businessRegistrationNumber = "",
    phone = "",
  },
) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("Utilisateur non trouvé.");

  if (user.isProShop && user.proShopDetails?.status === "approved") {
    throw new Error("Vous possédez déjà une Boutique Pro certifiée.");
  }

  user.proShopDetails = {
    shopName,
    description,
    category,
    logo,
    banner,
    businessRegistrationNumber,
    phone,
    status: "pending",
    rejectionReason: "",
    appliedAt: new Date(),
  };

  await user.save();

  // Notifier les SuperAdmins
  const superAdmins = await User.find({ role: "superAdmin" });
  for (const admin of superAdmins) {
    createNotification({
      recipientId: admin._id,
      senderId: userId,
      title: "🏢 Nouvelle candidature Boutique Pro",
      message: `L'utilisateur "${user.name}" a postulé pour la boutique "${shopName}".`,
      type: "pro_shop_status",
      link: "/admin/pro-shops",
      sendEmailNotification: true,
    }).catch((err) =>
      console.error("❌ Erreur notif candidature pro shop :", err.message),
    );
  }

  return {
    message:
      "Votre dossier de candidature pour une Boutique Pro a été soumis avec succès et est en cours d'examen.",
    proShopDetails: user.proShopDetails,
  };
};

/**
 * Récupérer le statut de la candidature Boutique Pro
 */
export const getProShopStatus = async (userId) => {
  const user = await User.findById(userId).select(
    "isProShop proShopDetails role",
  );
  return {
    isProShop: user.isProShop,
    role: user.role,
    proShopDetails: user.proShopDetails || { status: "none" },
  };
};

/**
 * Obtenir le Tableau de Bord Vendeur (Statistiques de ventes & Solde)
 */
export const getSellerDashboard = async (userId) => {
  const user = await User.findById(userId);
  if (
    !user ||
    (!user.isProShop &&
      user.role !== "seller" &&
      user.role !== "admin" &&
      user.role !== "superAdmin")
  ) {
    throw new Error(
      "Accès refusé. Vous devez posséder une Boutique Pro certifiée pour accéder au tableau vendeur.",
    );
  }

  const totalProducts = await Product.countDocuments({ createdBy: userId });

  // Recherche les commandes qui contiennent au moins un produit créé par ce vendeur
  const myProducts = await Product.find({ createdBy: userId }).select("_id");
  const productIds = myProducts.map((p) => p._id);

  const orders = await Order.find({ "items.product": { $in: productIds } })
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  return {
    sellerBalance: user.sellerBalance,
    shopDetails: user.proShopDetails,
    totalProducts,
    totalOrders: orders.length,
    recentOrders: orders.slice(0, 10),
  };
};

export default {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  getCart,
  toggleWishlist,
  getWishlist,
  applyForProShop,
  getProShopStatus,
  getSellerDashboard,
};
