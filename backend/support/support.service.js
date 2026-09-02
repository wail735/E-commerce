// ============================================================================
// FICHIER : backend 2/support/support.service.js
// RÔLE : Logique métier du support client et notification par email
// ============================================================================

import SupportTicket from "./support.model.js";
import User from "../auth/auth.model.js";
import { sendEmail } from "../config/email.js";

/**
 * Créer un ticket de support et envoyer un email de confirmation
 */
export const createTicket = async (userId, { subject, message, priority }) => {
  const user = await User.findById(userId);

  const ticket = await SupportTicket.create({
    user: userId,
    subject,
    message,
    priority: priority || "medium",
  });

  // Envoie un email à l'équipe support et au client
  await sendEmail({
    to: user.email,
    subject: `🎫 Notification Ticket de Support #${ticket._id}`,
    html: `<h3>Votre demande d'assistance a été reçue !</h3><p>Sujet : <strong>${subject}</strong></p><p>Nous traiterons votre demande dans les plus brefs délais.</p>`,
  }).catch((err) => console.error("Erreur d'envoi d'email support :", err));

  return ticket;
};

/**
 * Répondre à un ticket de support (Admin)
 */
export const replyTicket = async (ticketId, { response, status }) => {
  const ticket = await SupportTicket.findById(ticketId).populate("user");
  if (!ticket) {
    throw new Error("Ticket non trouvé.");
  }

  ticket.adminResponse = response;
  if (status) ticket.status = status;
  await ticket.save();

  // Alerte le client par email
  if (ticket.user && ticket.user.email) {
    await sendEmail({
      to: ticket.user.email,
      subject: `💬 Réponse à votre ticket de support #${ticket._id}`,
      html: `<h3>Réponse du support :</h3><p>${response}</p><p>Statut du ticket : <strong>${ticket.status}</strong></p>`,
    }).catch((err) =>
      console.error("Erreur d'envoi d'email réponse support :", err),
    );
  }

  return ticket;
};

/**
 * Obtenir mes tickets de support
 */
export const getUserTickets = async (userId) => {
  return await SupportTicket.find({ user: userId }).sort({ createdAt: -1 });
};

/**
 * Obtenir tous les tickets pour le panneau d'administration
 */
export const getAllTicketsForAdmin = async (page = 1, limit = 20) => {
  const skip = (Number(page) - 1) * Number(limit);
  const total = await SupportTicket.countDocuments();
  const tickets = await SupportTicket.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return { tickets, total, page: Number(page), pages: Math.ceil(total / Number(limit)) };
};

export default {
  createTicket,
  replyTicket,
  getUserTickets,
  getAllTicketsForAdmin,
};
