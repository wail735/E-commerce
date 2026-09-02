// ============================================================================
// FICHIER : backend 2/contact/contact.service.js
// RÔLE : Logique métier de traitement des messages de contact et réponses email
// ============================================================================

import Contact from "./contact.model.js";
import User from "../users/user.model.js";
import { sendEmail } from "../config/email.js";
import { createNotification } from "../notifications/notification.service.js";

/**
 * Enregistrer un message du formulaire de contact, notifier le SuperAdmin et envoyer un email d'accusé de réception
 */
export const submitContactForm = async ({ name, email, phone = "", subject, message }) => {
  // 1. Enregistre le message dans MongoDB
  const contactEntry = await Contact.create({
    name,
    email: email.toLowerCase(),
    phone,
    subject,
    message,
    status: "unread",
  });

  // 2. Accusé de réception automatique par email à l'expéditeur
  const userHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #ff4747;">📬 Message bien reçu !</h2>
      <p>Bonjour <strong>${name}</strong>,</p>
      <p>Nous avons bien reçu votre message concernant : <strong>"${subject}"</strong>.</p>
      <p>Notre équipe du service client étudie votre demande et vous répondra dans les plus brefs délais.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888;">Ceci est un message automatique, merci de ne pas y répondre directement.</p>
    </div>
  `;

  sendEmail({
    to: email,
    subject: `📬 Accusé de réception : ${subject}`,
    html: userHtml,
  }).catch((err) => console.error("❌ Erreur d'envoi email accusé réception contact :", err.message));

  // 3. Notifier tous les SuperAdmins en BDD et par In-App notification
  const superAdmins = await User.find({ role: "superAdmin" });
  for (const admin of superAdmins) {
    createNotification({
      recipientId: admin._id,
      title: `📩 Nouveau message de contact : ${subject}`,
      message: `De : ${name} (${email}) - "${message.substring(0, 60)}..."`,
      type: "system",
      link: "/admin/contact-messages",
      sendEmailNotification: true,
    }).catch((err) => console.error("❌ Erreur notif admin message contact :", err.message));
  }

  return contactEntry;
};

/**
 * Récupérer tous les messages de contact reçus (SuperAdmin)
 */
export const getContactMessages = async (status = null, page = 1, limit = 20) => {
  const query = {};
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Contact.countDocuments(query);
  const messages = await Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

  return { messages, total, page: Number(page), pages: Math.ceil(total / Number(limit)) };
};

/**
 * Répondre par email à un message de contact (SuperAdmin)
 */
export const replyToContactMessage = async (contactId, replyText) => {
  const contactEntry = await Contact.findById(contactId);
  if (!contactEntry) {
    throw new Error("Message de contact non trouvé.");
  }

  contactEntry.status = "replied";
  contactEntry.replyMessage = replyText;
  contactEntry.repliedAt = new Date();
  await contactEntry.save();

  // Envoi de la réponse par email au client
  const replyHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #ff4747;">💬 Réponse à votre message</h2>
      <p>Bonjour <strong>${contactEntry.name}</strong>,</p>
      <p>Concernant votre demande initiale : <em>"${contactEntry.subject}"</em></p>
      <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #ff4747; margin: 15px 0;">
        <p style="margin: 0; font-size: 14px; color: #333;">${replyText}</p>
      </div>
      <p>N'hésitez pas à nous recontacter si vous avez d'autres questions !</p>
    </div>
  `;

  await sendEmail({
    to: contactEntry.email,
    subject: `Re: ${contactEntry.subject}`,
    html: replyHtml,
  });

  return contactEntry;
};

export default {
  submitContactForm,
  getContactMessages,
  replyToContactMessage,
};
