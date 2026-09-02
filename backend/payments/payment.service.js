// ============================================================================
// FICHIER : backend 2/payments/payment.service.js
// RÔLE : Logique métier des Paiements (Stripe, RIB Algérien, RIP Poste, Preuves & Coins)
// ============================================================================

import Payment from "./payment.model.js";
import User from "../users/user.model.js";
import Order from "../orders/order.model.js";
import Ad from "../ads/ad.model.js";
import Settings from "../config/settings.model.js";
import { uploadImage } from "../config/cloudinary.js";
import { createNotification } from "../notifications/notification.service.js";
import { subscribeToPlan } from "../subscriptions/subscription.service.js";
import Stripe from "stripe";

/**
 * Récupérer les coordonnées bancaires officielles de la plateforme (RIB Algérie, RIP Poste, Visa)
 */
export const getBankDetails = async () => {
  const settings = await Settings.getSettings();

  return {
    algerianBankRib: settings.bankDetails?.algerianRib || {
      bankName: "Banque Nationale d'Algérie (BNA) / BDL",
      ownerName: "AliExpress Clone SARL",
      rib: "00100 234567890123456 78",
      agency: "Alger Centre",
    },
    posteAlgerienneRip: settings.bankDetails?.algerianRip || {
      ownerName: "AliExpress Clone E-Commerce",
      ccpAccount: "1234567 Clé 89",
      rip: "00799999000123456789 22",
    },
    internationalVisaAccount: settings.bankDetails?.visaAccount || {
      bankName: "Paysera / Wise / Paysafe International Bank",
      ownerName: "AliExpress Clone Global",
      iban: "LT12 3456 7890 1234 5678",
      swift: "PAYSLT21XXX",
    },
  };
};

/**
 * Créer une session de paiement Stripe Checkout (Paiement par Carte Bancaire Visa / MasterCard)
 */
export const createStripeSession = async (userId, { paymentType, referenceId, amount, description }) => {
  const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_mock_stripe_key";
  const stripe = new Stripe(stripeKey);

  const user = await User.findById(userId);
  if (!user) throw new Error("Utilisateur non trouvé.");

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  // Création de la session Stripe Checkout
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: description || `Paiement ${paymentType} sur AliExpress Clone`,
          },
          unit_amount: Math.round(Number(amount) * 100), // Montant en centimes
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&ref=${referenceId}`,
    cancel_url: `${frontendUrl}/payment/cancel?ref=${referenceId}`,
    metadata: {
      userId: userId.toString(),
      paymentType,
      referenceId: referenceId.toString(),
    },
  });

  // Enregistre l'intention de paiement en BDD
  await Payment.create({
    user: userId,
    paymentType,
    referenceId,
    amount,
    currency: "EUR",
    method: "stripe",
    status: "pending",
    stripeSessionId: session.id,
  });

  return {
    sessionId: session.id,
    checkoutUrl: session.url,
  };
};

/**
 * Téléverser le reçu / preuve de paiement par virement bancaire (RIB BNA/BDL, RIP CCP, Visa)
 */
export const uploadPaymentProof = async (userId, file, { paymentType, referenceId, method, amount }) => {
  if (!file) {
    throw new Error("Veuillez joindre le fichier ou l'image de preuve de paiement.");
  }

  // Upload du reçu sur Cloudinary
  const uploadResult = await uploadImage(file.path, { folder: "payment_proofs" });

  const paymentRecord = await Payment.create({
    user: userId,
    paymentType,
    referenceId,
    amount: Number(amount),
    method,
    status: "pending",
    proofImage: uploadResult.url,
  });

  // Notification aux SuperAdmins pour modération dans le tableau de bord
  const superAdmins = await User.find({ role: "superAdmin" });
  for (const admin of superAdmins) {
    createNotification({
      recipientId: admin._id,
      senderId: userId,
      title: "🧾 Nouvelle preuve de paiement reçue",
      message: `Preuve téléversée pour [${paymentType}] (${amount} €) via ${method}. En attente de validation.`,
      type: "system",
      link: "/admin/payment-proofs",
      sendEmailNotification: true,
    }).catch((err) => console.error("❌ Erreur notif preuve paiement admin :", err.message));
  }

  return {
    message: "Preuve de paiement transmise avec succès ! L'administration va vérifier et valider votre transaction.",
    payment: paymentRecord,
  };
};

/**
 * SuperAdmin examine et valide/refuse la preuve de paiement d'un virement
 */
export const reviewPaymentProof = async (adminId, paymentId, { status, rejectionReason = "" }) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) throw new Error("Enregistrement de paiement non trouvé.");

  if (!["approved", "rejected"].includes(status)) {
    throw new Error("Statut invalide ('approved' ou 'rejected').");
  }

  payment.status = status;
  payment.rejectionReason = rejectionReason;
  payment.approvedBy = adminId;
  await payment.save();

  const isApproved = status === "approved";

  // Si approuvé, finaliser automatiquement la commande, l'abonnement ou la pub associée
  if (isApproved) {
    payment.status = "completed";
    await payment.save();

    if (payment.paymentType === "order") {
      await Order.findByIdAndUpdate(payment.referenceId, { paymentStatus: "completed", status: "processing" });
    } else if (payment.paymentType === "subscription") {
      await subscribeToPlan(payment.user, payment.referenceId);
    } else if (payment.paymentType === "ad_campaign") {
      await Ad.findByIdAndUpdate(payment.referenceId, { status: "active", isActive: true });
    }
  }

  // Notifier l'utilisateur
  createNotification({
    recipientId: payment.user,
    title: isApproved ? "✅ Paiement Bancaire Validé !" : "❌ Preuve de Paiement Refusée",
    message: isApproved
      ? `Votre paiement de ${payment.amount} € via ${payment.method} a été validé avec succès par l'administration.`
      : `Votre preuve de virement a été refusée. Motif : ${rejectionReason || "Pièce justificative illisible."}`,
    type: "system",
    link: "/user/payments",
    sendEmailNotification: true,
  }).catch((err) => console.error("❌ Erreur notif examen preuve paiement :", err.message));

  return payment;
};

/**
 * Obtenir toutes les preuves de paiement en attente de vérification (Tableau SuperAdmin)
 */
export const getPendingPaymentProofs = async (page = 1, limit = 20) => {
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Payment.countDocuments({ status: "pending", proofImage: { $ne: "" } });
  const payments = await Payment.find({ status: "pending", proofImage: { $ne: "" } })
    .populate("user", "name email role")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return { payments, total, page: Number(page), pages: Math.ceil(total / Number(limit)) };
};

/**
 * Handle Stripe Webhook Events
 */
export const handleStripeWebhook = async (rawBody, signature) => {
  const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_mock_stripe_key";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_mock";
  const stripe = new Stripe(stripeKey);

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    throw new Error(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    
    // Find payment record
    const payment = await Payment.findOne({ stripeSessionId: session.id });
    if (!payment) return;

    payment.status = "completed";
    await payment.save();

    // Fulfill the purchase based on payment type
    if (payment.paymentType === "order") {
      await Order.findByIdAndUpdate(payment.referenceId, { paymentStatus: "completed", status: "processing" });
    } else if (payment.paymentType === "subscription") {
      await subscribeToPlan(payment.user, payment.referenceId);
    } else if (payment.paymentType === "ad_campaign") {
      await Ad.findByIdAndUpdate(payment.referenceId, { status: "active", isActive: true });
    }

    // Notify user
    createNotification({
      recipientId: payment.user,
      title: "✅ Paiement Stripe Validé !",
      message: `Votre paiement de ${payment.amount} € a été validé avec succès.`,
      type: "system",
      link: "/user/orders",
      sendEmailNotification: true,
    }).catch(err => console.error(err));
  }
};

export default {
  getBankDetails,
  createStripeSession,
  uploadPaymentProof,
  reviewPaymentProof,
  getPendingPaymentProofs,
  handleStripeWebhook,
};
