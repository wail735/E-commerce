// ============================================================================
// FICHIER : backend 2/admin/admin.service.js
// RÔLE : Logique métier du Panneau d'Administration SuperAdmin (Statistiques, Réglages, Boutiques Pro)
// ============================================================================

import User from "../users/user.model.js";
import Product from "../products/product.model.js";
import Order from "../orders/order.model.js";
import Settings from "../config/settings.model.js";
import { createNotification } from "../notifications/notification.service.js";

/**
 * Récupérer la liste de tous les utilisateurs (pour le SuperAdmin Panel)
 */
export const getAllUsers = async (page = 1, limit = 20) => {
  const skip = (Number(page) - 1) * Number(limit);
  const total = await User.countDocuments();
  const users = await User.find()
    .select("-password")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    users,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  };
};

/**
 * Modifier le rôle d'un utilisateur (Promouvoir en Buyer, Seller, Admin ou SuperAdmin)
 */
export const updateUserRole = async (targetUserId, newRole) => {
  if (!["user", "buyer", "seller", "admin", "superAdmin"].includes(newRole)) {
    throw new Error("Rôle spécifié invalide.");
  }

  const user = await User.findById(targetUserId);
  if (!user) throw new Error("Utilisateur non trouvé.");

  user.role = newRole;
  if (newRole === "seller") {
    user.isProShop = true;
  }
  await user.save();

  return {
    message: `Rôle de ${user.name} mis à jour avec succès : [${newRole}]`,
    user,
  };
};

/**
 * Activer ou Désactiver un compte utilisateur
 */
export const toggleUserStatus = async (targetUserId) => {
  const user = await User.findById(targetUserId);
  if (!user) throw new Error("Utilisateur non trouvé.");

  user.isActive = !user.isActive;
  await user.save();

  return {
    message: `Statut de ${user.name} mis à jour : [${user.isActive ? "Actif" : "Désactivé"}]`,
    isActive: user.isActive,
  };
};

/**
 * Obtenir les statistiques globales de la plateforme (Tableau de bord SuperAdmin)
 */
export const getSystemStats = async () => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalProShops = await User.countDocuments({ isProShop: true });

  // Somme totale des ventes accomplies et commissions prélevées
  const salesResult = await Order.aggregate([
    { $match: { paymentStatus: "completed" } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        totalCommissions: { $sum: "$platformCommission" },
      },
    },
  ]);

  const totalRevenue = salesResult.length > 0 ? salesResult[0].totalRevenue : 0;
  const totalCommissions =
    salesResult.length > 0 ? salesResult[0].totalCommissions : 0;

  // Recent activity: 5 latest users and 5 latest orders
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(3).select('name email createdAt');
  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(3).select('_id totalAmount paymentStatus createdAt');

  const activities = [
    ...recentUsers.map(u => ({ type: 'user', text: `Nouvel utilisateur inscrit (${u.email})`, date: u.createdAt, color: 'bg-blue-500' })),
    ...recentOrders.map(o => ({ type: 'order', text: `Nouvelle commande #${o._id.toString().slice(-8).toUpperCase()} (${o.totalAmount} €)`, date: o.createdAt, color: 'bg-green-500' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  // Data for Sales Chart (Revenue and Commission over time)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const salesDataAggregation = await Order.aggregate([
    { $match: { paymentStatus: "completed", createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$totalAmount" },
        commission: { $sum: "$platformCommission" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  const salesChartData = salesDataAggregation.map((d) => ({
    name: d._id,
    revenue: d.revenue,
    commission: d.commission,
  }));

  // Data for Users Chart (New users over time)
  const usersDataAggregation = await User.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        users: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  const usersChartData = usersDataAggregation.map((d) => ({
    name: d._id,
    users: d.users,
  }));

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalProShops,
    totalRevenue,
    totalCommissions,
    recentActivity: activities,
    salesChartData,
    usersChartData,
  };
};

/**
 * Récupérer la configuration et les prix dynamiques de la plateforme
 */
export const getPlatformSettings = async () => {
  return await Settings.getSettings();
};

/**
 * Mettre à jour dynamiquement les tarifs des abonnements, des coins, des prix boutique pro et le taux de commission
 */
export const updatePlatformSettings = async (newSettingsData) => {
  const settings = await Settings.getSettings();

  if (newSettingsData.commissionRate !== undefined)
    settings.commissionRate = Number(newSettingsData.commissionRate);
  if (newSettingsData.proShopStandalonePrice !== undefined)
    settings.proShopStandalonePrice = Number(
      newSettingsData.proShopStandalonePrice,
    );
  if (newSettingsData.proShopIncludedInPlans !== undefined)
    settings.proShopIncludedInPlans = newSettingsData.proShopIncludedInPlans;
  if (newSettingsData.subscriptionPlans !== undefined)
    settings.subscriptionPlans = newSettingsData.subscriptionPlans;
  if (newSettingsData.coinPackages !== undefined)
    settings.coinPackages = newSettingsData.coinPackages;
  if (newSettingsData.ollamaConfig !== undefined)
    settings.ollamaConfig = {
      ...settings.ollamaConfig,
      ...newSettingsData.ollamaConfig,
    };

  await settings.save();
  return settings;
};

/**
 * Récupérer toutes les demandes de création de Boutique Pro en attente ou traitées
 */
export const getProShopApplications = async (status = "pending") => {
  return await User.find({ "proShopDetails.status": status })
    .select("name email role isProShop proShopDetails createdAt")
    .sort({ "proShopDetails.appliedAt": -1 });
};

/**
 * Approuver ou Rejeter le dossier de candidature d'une Boutique Pro
 */
export const reviewProShopApplication = async (
  targetUserId,
  status,
  rejectionReason = "",
) => {
  const user = await User.findById(targetUserId);
  if (!user) throw new Error("Utilisateur non trouvé.");

  if (!["approved", "rejected"].includes(status)) {
    throw new Error(
      "Statut de modération invalide ('approved' ou 'rejected').",
    );
  }

  user.proShopDetails.status = status;
  user.proShopDetails.rejectionReason = rejectionReason;

  if (status === "approved") {
    user.isProShop = true;
    user.role = "seller"; // Promut l'utilisateur en rôle Vendeur Pro
    user.proShopDetails.approvedAt = new Date();
  }

  await user.save();

  // Envoi de notifications in-app et email à l'utilisateur candidat
  const isApproved = status === "approved";
  createNotification({
    recipientId: user._id,
    title: isApproved
      ? "🎉 Félicitations ! Boutique Pro Validée"
      : "❌ Candidature Boutique Pro Non Retenue",
    message: isApproved
      ? `Votre candidature pour la boutique "${user.proShopDetails.shopName}" a été validée. Vous avez désormais accès aux fonctionnalités Vendeur Pro !`
      : `Votre demande de création de Boutique Pro a été refusée. Motif : ${rejectionReason || "Informations insuffisantes."}`,
    type: "pro_shop_status",
    link: "/user/pro-shop/status",
    sendEmailNotification: true,
  }).catch((err) =>
    console.error("❌ Erreur notif examen boutique :", err.message),
  );

  return {
    message: `Dossier Boutique Pro de ${user.name} mis à jour : [${status}]`,
    user,
  };
};

export default {
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  getSystemStats,
  getPlatformSettings,
  updatePlatformSettings,
  getProShopApplications,
  reviewProShopApplication,
};
