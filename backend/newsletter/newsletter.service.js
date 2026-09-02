// ============================================================================
// FICHIER : backend 2/newsletter/newsletter.service.js
// RÔLE : Logique métier de la newsletter (Abonnement, Désabonnement & Envoi de campagnes groupées)
// ============================================================================

import Newsletter from "./newsletter.model.js";
import { sendEmail } from "../config/email.js";

/**
 * Inscrire une adresse email à la newsletter et envoyer un email de bienvenue
 */
export const subscribeNewsletter = async (email) => {
  const cleanEmail = email.toLowerCase().trim();

  let subscriber = await Newsletter.findOne({ email: cleanEmail });

  if (subscriber) {
    if (subscriber.isActive) {
      throw new Error("Cette adresse email est déjà inscrite à la newsletter.");
    }
    // Réactive l'abonnement s'il s'était désabonné auparavant
    subscriber.isActive = true;
    subscriber.unsubscribedAt = undefined;
    await subscriber.save();
  } else {
    subscriber = await Newsletter.create({ email: cleanEmail, isActive: true });
  }

  // Envoi d'un email de bienvenue
  const welcomeHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #ff4747;">🎉 Bienvenue dans notre Newsletter !</h2>
      <p>Merci de vous être inscrit à notre lettre d'information.</p>
      <p>Vous recevrez désormais en avant-première nos offres exclusives, codes promos, réductions sur les abonnements et nouveautés produits !</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 11px; color: #999;">Si vous souhaitez vous désabonner à tout moment, vous pouvez le faire via le site.</p>
    </div>
  `;

  sendEmail({
    to: cleanEmail,
    subject: "🎉 Bienvenue dans notre Newsletter !",
    html: welcomeHtml,
  }).catch((err) => console.error("❌ Erreur d'envoi email bienvenue newsletter :", err.message));

  return subscriber;
};

/**
 * Désabonner une adresse email de la newsletter
 */
export const unsubscribeNewsletter = async (email) => {
  const cleanEmail = email.toLowerCase().trim();
  const subscriber = await Newsletter.findOne({ email: cleanEmail });

  if (!subscriber || !subscriber.isActive) {
    throw new Error("Cette adresse email n'est pas inscrite ou est déjà désabonnée.");
  }

  subscriber.isActive = false;
  subscriber.unsubscribedAt = new Date();
  await subscriber.save();

  return { message: "Vous avez été désabonné de la newsletter avec succès." };
};

/**
 * Obtenir la liste de tous les abonnés (SuperAdmin)
 */
export const getAllSubscribers = async (page = 1, limit = 50) => {
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Newsletter.countDocuments();
  const activeCount = await Newsletter.countDocuments({ isActive: true });

  const subscribers = await Newsletter.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

  return { subscribers, total, activeCount, page: Number(page), pages: Math.ceil(total / Number(limit)) };
};

/**
 * Diffuser une campagne email d'information/promo à TOUS les abonnés actifs (SuperAdmin Broadcast)
 */
export const sendNewsletterCampaign = async ({ subject, htmlContent }) => {
  if (!subject || !htmlContent) {
    throw new Error("Le sujet et le contenu HTML de la campagne sont obligatoires.");
  }

  const activeSubscribers = await Newsletter.find({ isActive: true }).select("email");
  if (activeSubscribers.length === 0) {
    throw new Error("Aucun abonné actif trouvé pour l'envoi de cette campagne.");
  }

  let sentCount = 0;
  let failCount = 0;

  // Envoi individuel à chaque abonné
  for (const sub of activeSubscribers) {
    try {
      await sendEmail({
        to: sub.email,
        subject,
        html: htmlContent,
      });
      sentCount++;
    } catch (err) {
      console.error(`❌ Échec envoi newsletter à ${sub.email} :`, err.message);
      failCount++;
    }
  }

  return {
    message: `Campagne newsletter achevée. Emails envoyés : ${sentCount}, Échecs : ${failCount}`,
    sentCount,
    failCount,
  };
};

export default {
  subscribeNewsletter,
  unsubscribeNewsletter,
  getAllSubscribers,
  sendNewsletterCampaign,
};
