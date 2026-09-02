// ============================================================================
// FICHIER : backend 2/newsletter/newsletter.controller.js
// RÔLE : Contrôleur HTTP pour l'inscription, désinscription et campagnes newsletter
// ============================================================================

import * as newsletterService from "./newsletter.service.js";

/**
 * S'inscrire à la newsletter (Public)
 */
export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "L'adresse email est obligatoire." });

    const subscriber = await newsletterService.subscribeNewsletter(email);
    return res.status(201).json({
      success: true,
      message: "Félicitations ! Vous êtes maintenant inscrit à notre newsletter.",
      data: subscriber,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Se désabonner de la newsletter (Public)
 */
export const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "L'adresse email est obligatoire." });

    const result = await newsletterService.unsubscribeNewsletter(email);
    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Consulter tous les abonnés newsletter (SuperAdmin)
 */
export const getSubscribers = async (req, res) => {
  try {
    const data = await newsletterService.getAllSubscribers(req.query.page, req.query.limit);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Diffuser une campagne email à tous les abonnés (SuperAdmin)
 */
export const sendCampaign = async (req, res) => {
  try {
    const { subject, htmlContent } = req.body;
    const result = await newsletterService.sendNewsletterCampaign({ subject, htmlContent });
    return res.status(200).json({ success: true, message: result.message, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
