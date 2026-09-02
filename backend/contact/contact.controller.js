// ============================================================================
// FICHIER : backend 2/contact/contact.controller.js
// RÔLE : Contrôleur HTTP pour la réception et le traitement des messages de contact
// ============================================================================

import * as contactService from "./contact.service.js";

/**
 * Soumettre le formulaire de contact (Public)
 */
export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "Tous les champs (nom, email, sujet, message) sont obligatoires." });
    }

    const contactEntry = await contactService.submitContactForm({ name, email, phone, subject, message });
    return res.status(201).json({
      success: true,
      message: "Votre message a été transmis avec succès ! Un email d'accusé de réception vous a été envoyé.",
      data: contactEntry,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Consulter tous les messages de contact (SuperAdmin)
 */
export const getMessages = async (req, res) => {
  try {
    const data = await contactService.getContactMessages(req.query.status, req.query.page, req.query.limit);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Répondre par email à un message de contact (SuperAdmin)
 */
export const replyMessage = async (req, res) => {
  try {
    const { replyText } = req.body;
    if (!replyText) {
      return res.status(400).json({ success: false, message: "Le texte de la réponse est obligatoire." });
    }

    const updatedContact = await contactService.replyToContactMessage(req.params.id, replyText);
    return res.status(200).json({ success: true, message: "Réponse envoyée avec succès au client !", data: updatedContact });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
