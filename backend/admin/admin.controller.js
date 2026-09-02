// ============================================================================
// FICHIER : backend 2/admin/admin.controller.js
// RÔLE : Contrôleur HTTP pour le Panneau d'Administration SuperAdmin
// ============================================================================

import * as adminService from "./admin.service.js";

/**
 * Obtenir la liste de tous les utilisateurs
 */
export const getUsers = async (req, res) => {
  try {
    const data = await adminService.getAllUsers(
      req.query.page,
      req.query.limit,
    );
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Changer le rôle d'un utilisateur
 */
export const changeRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const result = await adminService.updateUserRole(userId, role);
    return res
      .status(200)
      .json({ success: true, message: result.message, data: result.user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Activer ou Désactiver un compte utilisateur
 */
export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await adminService.toggleUserStatus(userId);
    return res.status(200).json({
      success: true,
      message: result.message,
      isActive: result.isActive,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Obtenir les statistiques globales
 */
export const getStats = async (req, res) => {
  try {
    const stats = await adminService.getSystemStats();
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Obtenir les réglages dynamiques (Tarifs abonnements, coins, commission, etc.)
 */
export const getSettings = async (req, res) => {
  try {
    const settings = await adminService.getPlatformSettings();
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Mettre à jour les réglages dynamiques et les tarifs
 */
export const updateSettings = async (req, res) => {
  try {
    const settings = await adminService.updatePlatformSettings(req.body);
    return res.status(200).json({
      success: true,
      message: "Réglages de la plateforme mis à jour avec succès !",
      data: settings,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Liste des dossiers de candidature Boutique Pro
 */
export const getProShops = async (req, res) => {
  try {
    const status = req.query.status || "pending";
    const applications = await adminService.getProShopApplications(status);
    return res.status(200).json({ success: true, data: applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Examen/Modération d'un dossier Boutique Pro
 */
export const reviewProShop = async (req, res) => {
  try {
    const { userId, status, rejectionReason } = req.body;
    const result = await adminService.reviewProShopApplication(
      userId,
      status,
      rejectionReason,
    );
    return res
      .status(200)
      .json({ success: true, message: result.message, data: result.user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
