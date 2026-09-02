// Configuration SMTP pour l'envoi d'emails
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Récupérer le chemin du fichier actuel (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Nodemailer : Module Node.js pour l'envoi d'emails
 * Supporte SMTP, Sendmail, et d'autres services
 *
 * SMTP (Simple Mail Transfer Protocol) : Protocole standard
 * pour l'envoi d'emails sur Internet
 *
 * Fonctionnalités :
 * - Envoi d'emails HTML et texte
 * - Pièces jointes
 * - Envoi groupé
 * - Templating d'emails
 * - Gestion des erreurs
 *
 * Cas d'utilisation réels :
 * 1. Emails de bienvenue (inscription)
 * 2. Réinitialisation de mot de passe
 * 3. Confirmation de commande
 * 4. Notifications de livraison
 * 5. Emails marketing
 * 6. Alertes de sécurité
 * 7. Factures et reçus
 */

/**
 * Création du transporteur SMTP
 * Configure la connexion au serveur de messagerie
 */
const createTransporter = () => {
  // Vérifier que les variables d'environnement sont définies
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error("❌ Variables d'email manquantes dans le fichier .env");
    throw new Error("Configuration email incomplète");
  }

  // Configuration du transporteur
  return nodemailer.createTransport({
    // Service email (Gmail, Outlook, Yahoo, etc.)
    service: process.env.EMAIL_SERVICE || "gmail",

    // Configuration SMTP directe (alternative au service)
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === "true", // true pour SSL/TLS

    // Authentification
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },

    // Timeouts pour éviter les blocages
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,

    // Pool de connexions pour les envois groupés
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 1000, // Pause entre les emails
    rateLimit: 5, // Emails par seconde
  });
};

/**
 * Envoi d'un email générique
 * @param {Object} options - Options de l'email
 * @returns {Promise<Object>} - Informations sur l'envoi
 */
export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    // Vérifier que le destinataire est défini
    if (!options.to) {
      throw new Error("Le destinataire est requis");
    }

    // Construire les options de l'email
    const mailOptions = {
      // Expéditeur
      from: {
        name: process.env.EMAIL_FROM_NAME || "Plateforme E-commerce",
        address: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      },
      // Destinataires (peut être un tableau)
      to: options.to,
      // Copie carbone
      cc: options.cc || [],
      // Copie carbone cachée
      bcc: options.bcc || [],
      // Sujet
      subject: options.subject || "Message de la plateforme",
      // Contenu HTML
      html: options.html,
      // Contenu texte (alternative)
      text: options.text || options.html?.replace(/<[^>]*>/g, "") || "",
      // Pièces jointes
      attachments: options.attachments || [],
      // Headers personnalisés
      headers: options.headers || {},
      // Reply-to
      replyTo:
        options.replyTo || process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM,
    };

    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email envoyé avec succès à ${options.to}`);
    console.log(`📧 Message ID: ${info.messageId}`);

    return info;
  } catch (error) {
    console.error(`❌ Erreur d'envoi d'email: ${error.message}`);
    // Ne pas échouer complètement en production
    if (process.env.NODE_ENV === "production") {
      console.error("⚠️ Email non envoyé mais continuation");
      return null;
    }
    throw error;
  }
};

/**
 * Envoi d'email de bienvenue
 * @param {Object} user - Utilisateur
 * @param {String} password - Mot de passe temporaire (optionnel)
 */
export const sendWelcomeEmail = async (user, password = null) => {
  try {
    // Lire le template HTML
    const templatePath = path.join(
      __dirname,
      "../templates/emails/welcome.html",
    );
    let html = "";

    // Vérifier si le template existe
    if (fs.existsSync(templatePath)) {
      html = fs.readFileSync(templatePath, "utf8");
      // Remplacer les variables
      html = html
        .replace(/{{name}}/g, user.name)
        .replace(/{{email}}/g, user.email)
        .replace(/{{role}}/g, user.role)
        .replace(/{{password}}/g, password || "")
        .replace(/{{frontend_url}}/g, process.env.FRONTEND_URL)
        .replace(/{{year}}/g, new Date().getFullYear())
        .replace(/{{app_name}}/g, process.env.APP_NAME || "Mon Commerce");
    } else {
      // Template par défaut si le fichier n'existe pas
      html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        .button { background: #667eea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; }
                        .button:hover { background: #5a67d8; }
                        .footer { margin-top: 20px; text-align: center; color: #888; font-size: 12px; }
                        .info-box { background: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea; }
                        .password-box { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107; }
                        .btn-primary { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎉 Bienvenue sur ${process.env.APP_NAME || "notre plateforme"}!</h1>
                        </div>
                        <div class="content">
                            <h2>Bonjour ${user.name},</h2>
                            <p>Nous sommes ravis de vous compter parmi nos utilisateurs.</p>
                            <p>Votre compte a été créé avec succès avec le rôle <strong>${user.role}</strong>.</p>
                            
                            ${
                              password
                                ? `
                            <div class="password-box">
                                <p><strong>🔑 Mot de passe temporaire :</strong></p>
                                <p style="font-size: 20px; font-weight: bold; color: #d39e00; text-align: center; letter-spacing: 2px;">${password}</p>
                                <p style="font-size: 14px; color: #856404;">⚠️ Changez ce mot de passe lors de votre première connexion.</p>
                            </div>
                            `
                                : ""
                            }
                            
                            <div class="info-box">
                                <p><strong>📧 Email :</strong> ${user.email}</p>
                                <p><strong>👤 Rôle :</strong> ${user.role}</p>
                                <p><strong>📅 Date d'inscription :</strong> ${new Date().toLocaleDateString("fr-FR")}</p>
                            </div>
                            
                            <p>Pour commencer, explorez notre catalogue de produits :</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${process.env.FRONTEND_URL}/products" class="button">
                                    🛍️ Explorer les produits
                                </a>
                            </div>
                            <div style="text-align: center; margin: 20px 0;">
                                <a href="${process.env.FRONTEND_URL}/dashboard" style="color: #667eea; text-decoration: none;">
                                    📊 Accéder à mon compte →
                                </a>
                            </div>
                            <hr style="margin: 30px 0;">
                            <p style="color: #888; font-size: 14px;">
                                <strong>Conseil :</strong> Pour une meilleure sécurité, utilisez un mot de passe fort et unique.
                            </p>
                        </div>
                        <div class="footer">
                            <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
                            <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || "Mon Commerce"}. Tous droits réservés.</p>
                        </div>
                    </div>
                </body>
                </html>
            `;
    }

    return await sendEmail({
      to: user.email,
      subject: `🎉 Bienvenue sur ${process.env.APP_NAME || "notre plateforme"} !`,
      html,
    });
  } catch (error) {
    console.error("❌ Erreur email de bienvenue:", error.message);
    return null;
  }
};

/**
 * Envoi d'email de réinitialisation de mot de passe
 * @param {Object} user - Utilisateur
 * @param {String} resetToken - Token de réinitialisation
 */
export const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const expiryTime = "10 minutes";

    const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; }
                    .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .button { background: #f5576c; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; }
                    .button:hover { background: #e0536a; }
                    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
                    .footer { margin-top: 20px; text-align: center; color: #888; font-size: 12px; }
                    .btn-danger { background: #f5576c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔐 Réinitialisation du mot de passe</h1>
                    </div>
                    <div class="content">
                        <h2>Bonjour ${user.name},</h2>
                        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
                        <div class="warning">
                            <p><strong>⚠️ Attention :</strong></p>
                            <ul>
                                <li>Ce lien est valable <strong>${expiryTime}</strong>.</li>
                                <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</li>
                                <li>Ne partagez jamais ce lien avec personne.</li>
                            </ul>
                        </div>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" class="button">
                                🔑 Réinitialiser le mot de passe
                            </a>
                        </div>
                        <p style="margin-top: 30px; color: #888; font-size: 14px;">
                            <strong>📋 Si le bouton ne fonctionne pas :</strong><br>
                            Copiez ce lien dans votre navigateur :<br>
                            <span style="color: #667eea; word-break: break-all; font-size: 12px;">${resetUrl}</span>
                        </p>
                        <hr style="margin: 30px 0;">
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
                            <p style="color: #888; font-size: 14px; margin: 0;">
                                <strong>🔒 Conseil de sécurité :</strong>
                            </p>
                            <p style="color: #888; font-size: 13px; margin: 5px 0 0 0;">
                                Utilisez un mot de passe fort avec au moins 12 caractères,
                                incluant des majuscules, minuscules, chiffres et caractères spéciaux.
                            </p>
                        </div>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || "Mon Commerce"}. Tous droits réservés.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

    return await sendEmail({
      to: user.email,
      subject: "🔐 Réinitialisation de votre mot de passe",
      html,
    });
  } catch (error) {
    console.error("❌ Erreur email réinitialisation:", error.message);
    throw error;
  }
};

/**
 * Envoi d'email de confirmation de commande
 * @param {Object} user - Utilisateur
 * @param {Object} order - Commande
 */
export const sendOrderConfirmationEmail = async (user, order) => {
  try {
    // Générer le HTML des articles de la commande
    const orderItemsHtml = order.items
      .map(
        (item) => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <img src="${item.product?.images?.[0]?.url || item.image || ""}" 
                         alt="${item.product?.name || item.name || "Produit"}" 
                         style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;">
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <strong>${item.product?.name || item.name || "Produit"}</strong>
                    ${item.variant ? `<br><span style="color: #888; font-size: 12px;">Variante: ${item.variant}</span>` : ""}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)} €</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${(item.price * item.quantity).toFixed(2)} €</td>
            </tr>
        `,
      )
      .join("");

    const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; }
                    .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .order-details { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
                    .table { width: 100%; border-collapse: collapse; }
                    .table th { background: #f4f4f4; padding: 10px; text-align: left; }
                    .table td { padding: 10px; border-bottom: 1px solid #eee; }
                    .total { font-size: 18px; font-weight: bold; color: #4CAF50; }
                    .button { background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
                    .button:hover { background: #45a049; }
                    .footer { margin-top: 20px; text-align: center; color: #888; font-size: 12px; }
                    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
                    .status-pending { background: #ffc107; color: #856404; }
                    .status-processing { background: #17a2b8; color: white; }
                    .status-confirmed { background: #28a745; color: white; }
                    .status-shipped { background: #007bff; color: white; }
                    .status-delivered { background: #28a745; color: white; }
                    .status-cancelled { background: #dc3545; color: white; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✅ Commande confirmée !</h1>
                        <p style="font-size: 14px;">Commande #${order._id.toString().slice(-8).toUpperCase()}</p>
                    </div>
                    <div class="content">
                        <h2>Bonjour ${user.name},</h2>
                        <p>Votre commande a été confirmée et est en cours de traitement.</p>
                        
                        <div style="background: #f4f4f4; padding: 10px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 0;">
                                <strong>Statut :</strong> 
                                <span class="status-badge status-${order.status}">
                                    ${order.status.toUpperCase()}
                                </span>
                            </p>
                            <p style="margin: 5px 0 0 0;">
                                <strong>Date :</strong> ${new Date(
                                  order.createdAt,
                                ).toLocaleDateString("fr-FR", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                            </p>
                        </div>
                        
                        <div class="order-details">
                            <h3>📦 Détails de la commande</h3>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Produit</th>
                                        <th>Nom</th>
                                        <th style="text-align: center;">Qté</th>
                                        <th style="text-align: right;">Prix unitaire</th>
                                        <th style="text-align: right;">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${orderItemsHtml}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="3"></td>
                                        <td style="padding: 10px; text-align: right; font-weight: bold;">Sous-total :</td>
                                        <td style="padding: 10px; text-align: right;">${order.subtotal?.toFixed(2) || order.totalAmount.toFixed(2)} €</td>
                                    </tr>
                                    ${
                                      order.tax
                                        ? `
                                    <tr>
                                        <td colspan="3"></td>
                                        <td style="padding: 10px; text-align: right; font-weight: bold;">TVA (${order.taxRate || 20}%) :</td>
                                        <td style="padding: 10px; text-align: right;">${order.tax.toFixed(2)} €</td>
                                    </tr>
                                    `
                                        : ""
                                    }
                                    ${
                                      order.shippingCost
                                        ? `
                                    <tr>
                                        <td colspan="3"></td>
                                        <td style="padding: 10px; text-align: right; font-weight: bold;">Livraison :</td>
                                        <td style="padding: 10px; text-align: right;">${order.shippingCost.toFixed(2)} €</td>
                                    </tr>
                                    `
                                        : ""
                                    }
                                    ${
                                      order.discount
                                        ? `
                                    <tr>
                                        <td colspan="3"></td>
                                        <td style="padding: 10px; text-align: right; font-weight: bold;">Réduction :</td>
                                        <td style="padding: 10px; text-align: right; color: #dc3545;">-${order.discount.toFixed(2)} €</td>
                                    </tr>
                                    `
                                        : ""
                                    }
                                    <tr>
                                        <td colspan="3"></td>
                                        <td style="padding: 10px; text-align: right; font-size: 18px; font-weight: bold;">Total :</td>
                                        <td style="padding: 10px; text-align: right; font-size: 18px; font-weight: bold; color: #4CAF50;">
                                            ${order.totalAmount.toFixed(2)} €
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        
                        <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #eee;">
                            <h4>📍 Adresse de livraison</h4>
                            <p style="margin: 5px 0;">
                                <strong>${order.shippingAddress?.firstName || user.name}</strong><br>
                                ${order.shippingAddress?.street || ""}<br>
                                ${order.shippingAddress?.city || ""}, ${order.shippingAddress?.country || ""}<br>
                                ${order.shippingAddress?.zipCode || ""}
                            </p>
                            ${
                              order.shippingAddress?.phone
                                ? `
                            <p style="margin: 5px 0 0 0;"><strong>Tél :</strong> ${order.shippingAddress.phone}</p>
                            `
                                : ""
                            }
                        </div>
                        
                        ${
                          order.paymentMethod
                            ? `
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 0;"><strong>💳 Méthode de paiement :</strong> ${order.paymentMethod}</p>
                        </div>
                        `
                            : ""
                        }
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="button">
                                📍 Suivre ma commande
                            </a>
                        </div>
                        
                        <p style="margin-top: 20px; color: #888; font-size: 14px;">
                            Vous recevrez une notification par email lorsque votre commande sera expédiée.
                        </p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || "Mon Commerce"}. Tous droits réservés.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

    return await sendEmail({
      to: user.email,
      subject: `✅ Commande #${order._id.toString().slice(-8).toUpperCase()} confirmée`,
      html,
    });
  } catch (error) {
    console.error("❌ Erreur email confirmation commande:", error.message);
    throw error;
  }
};

/**
 * Envoi d'email de notification de statut de commande
 * @param {Object} user - Utilisateur
 * @param {Object} order - Commande
 * @param {String} status - Nouveau statut
 */
export const sendOrderStatusEmail = async (user, order, status) => {
  try {
    const statusMessages = {
      pending: "⏳ Votre commande est en attente de traitement.",
      processing: "🔧 Votre commande est en cours de traitement.",
      confirmed: "✅ Votre commande a été confirmée.",
      shipped: "🚚 Votre commande a été expédiée !",
      delivered: "📦 Votre commande a été livrée !",
      cancelled: "❌ Votre commande a été annulée.",
      returned: "↩️ Votre commande a été retournée.",
      refunded: "💳 Votre commande a été remboursée.",
    };

    const statusEmojis = {
      pending: "⏳",
      processing: "🔧",
      confirmed: "✅",
      shipped: "🚚",
      delivered: "📦",
      cancelled: "❌",
      returned: "↩️",
      refunded: "💳",
    };

    const statusColors = {
      pending: "#ffc107",
      processing: "#17a2b8",
      confirmed: "#28a745",
      shipped: "#007bff",
      delivered: "#28a745",
      cancelled: "#dc3545",
      returned: "#6c757d",
      refunded: "#28a745",
    };

    const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .status-box { text-align: center; padding: 30px; background: #f8f9fa; border-radius: 10px; margin: 20px 0; }
                    .status-icon { font-size: 60px; display: block; margin-bottom: 10px; }
                    .status-label { font-size: 24px; font-weight: bold; color: ${statusColors[status] || "#333"}; }
                    .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
                    .button:hover { background: #5a67d8; }
                    .footer { margin-top: 20px; text-align: center; color: #888; font-size: 12px; }
                    .timeline { position: relative; margin: 30px 0; padding: 0; }
                    .timeline-item { display: flex; align-items: center; margin-bottom: 15px; }
                    .timeline-dot { width: 12px; height: 12px; border-radius: 50%; margin-right: 15px; flex-shrink: 0; }
                    .timeline-line { position: absolute; left: 5px; top: 15px; width: 2px; height: calc(100% - 30px); background: #ddd; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📧 Mise à jour de commande</h1>
                        <p style="font-size: 14px;">Commande #${order._id.toString().slice(-8).toUpperCase()}</p>
                    </div>
                    <div class="content">
                        <h2>Bonjour ${user.name},</h2>
                        <p>Le statut de votre commande a été mis à jour.</p>
                        
                        <div class="status-box">
                            <span class="status-icon">${statusEmojis[status] || "📦"}</span>
                            <div class="status-label">${status.toUpperCase()}</div>
                            <p style="margin-top: 10px; color: #666;">${statusMessages[status] || "Mise à jour du statut de votre commande."}</p>
                        </div>
                        
                        <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 0;"><strong>📋 Commande #${order._id.toString().slice(-8).toUpperCase()}</strong></p>
                            <p style="margin: 5px 0 0 0;">Total : <strong>${order.totalAmount.toFixed(2)} €</strong></p>
                            <p style="margin: 5px 0 0 0;">Date : ${new Date(order.createdAt).toLocaleDateString("fr-FR")}</p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="button">
                                📍 Voir les détails
                            </a>
                        </div>
                        
                        ${
                          status === "shipped"
                            ? `
                        <div style="background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 0;"><strong>🚚 Suivi de livraison</strong></p>
                            ${
                              order.trackingNumber
                                ? `
                            <p style="margin: 5px 0 0 0;">Numéro de suivi : <strong>${order.trackingNumber}</strong></p>
                            ${
                              order.trackingUrl
                                ? `
                            <p style="margin: 5px 0 0 0;">
                                <a href="${order.trackingUrl}" target="_blank" style="color: #007bff;">Suivre mon colis →</a>
                            </p>
                            `
                                : ""
                            }
                            `
                                : ""
                            }
                        </div>
                        `
                            : ""
                        }
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || "Mon Commerce"}. Tous droits réservés.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

    return await sendEmail({
      to: user.email,
      subject: `${statusEmojis[status] || "📧"} Commande #${order._id.toString().slice(-8).toUpperCase()} - ${status.toUpperCase()}`,
      html,
    });
  } catch (error) {
    console.error("❌ Erreur email statut commande:", error.message);
    throw error;
  }
};

/**
 * Envoi d'email de ticket de support
 * @param {Object} user - Utilisateur
 * @param {Object} ticket - Ticket de support
 */
export const sendSupportTicketEmail = async (user, ticket) => {
  try {
    const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; }
                    .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .ticket-info { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
                    .message-box { background: #f4f4f4; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #f5576c; }
                    .button { background: #f5576c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
                    .button:hover { background: #e0536a; }
                    .footer { margin-top: 20px; text-align: center; color: #888; font-size: 12px; }
                    .priority-high { color: #dc3545; font-weight: bold; }
                    .priority-medium { color: #ffc107; font-weight: bold; }
                    .priority-low { color: #28a745; font-weight: bold; }
                    .priority-urgent { color: #dc3545; font-weight: bold; text-transform: uppercase; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎫 Ticket de support créé</h1>
                        <p style="font-size: 14px;">Ticket #${ticket._id.toString().slice(-8).toUpperCase()}</p>
                    </div>
                    <div class="content">
                        <h2>Bonjour ${user.name},</h2>
                        <p>Votre ticket de support a été créé avec succès.</p>
                        
                        <div class="ticket-info">
                            <h3 style="margin-top: 0;">Détails du ticket</h3>
                            <p><strong>Sujet :</strong> ${ticket.subject}</p>
                            <p><strong>Catégorie :</strong> ${ticket.category}</p>
                            <p><strong>Priorité :</strong> 
                                <span class="priority-${ticket.priority}">${ticket.priority.toUpperCase()}</span>
                            </p>
                            <p><strong>Statut :</strong> ${ticket.status}</p>
                            <p><strong>Créé le :</strong> ${new Date(ticket.createdAt).toLocaleString("fr-FR")}</p>
                            
                            <div class="message-box">
                                <p style="margin: 0;"><strong>📝 Message :</strong></p>
                                <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${ticket.message}</p>
                            </div>
                            
                            ${
                              ticket.attachments?.length
                                ? `
                            <div style="margin-top: 15px;">
                                <p><strong>📎 Pièces jointes :</strong></p>
                                <ul style="margin: 5px 0 0 0; padding-left: 20px;">
                                    ${ticket.attachments
                                      .map(
                                        (att) => `
                                        <li><a href="${att.url}" target="_blank" style="color: #667eea;">${att.name}</a></li>
                                    `,
                                      )
                                      .join("")}
                                </ul>
                            </div>
                            `
                                : ""
                            }
                        </div>
                        
                        <div style="background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 0;"><strong>📌 Prochaines étapes :</strong></p>
                            <ul style="margin: 5px 0 0 0; padding-left: 20px;">
                                <li>Notre équipe examine votre demande</li>
                                <li>Vous recevrez une réponse dans les plus brefs délais</li>
                                <li>Vous pouvez suivre l'évolution de votre ticket</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL}/support/${ticket._id}" class="button">
                                📍 Suivre le ticket
                            </a>
                        </div>
                        
                        <p style="color: #888; font-size: 14px;">
                            Notre équipe vous répondra dans les plus brefs délais (généralement sous 24h).
                        </p>
                        <p style="color: #888; font-size: 14px; margin-top: 10px;">
                            <strong>💡 Astuce :</strong> Pour accélérer le traitement, fournissez autant d'informations que possible.
                        </p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || "Mon Commerce"}. Tous droits réservés.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

    return await sendEmail({
      to: user.email,
      subject: `🎫 Ticket de support #${ticket._id.toString().slice(-8).toUpperCase()}`,
      html,
    });
  } catch (error) {
    console.error("❌ Erreur email support:", error.message);
    throw error;
  }
};

/**
 * Envoi d'email de notification de paiement
 * @param {Object} user - Utilisateur
 * @param {Object} payment - Paiement
 */
export const sendPaymentReceiptEmail = async (user, payment) => {
  try {
    const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; }
                    .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .receipt { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
                    .footer { margin-top: 20px; text-align: center; color: #888; font-size: 12px; }
                    .amount { font-size: 28px; font-weight: bold; color: #28a745; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>💳 Paiement confirmé</h1>
                    </div>
                    <div class="content">
                        <h2>Bonjour ${user.name},</h2>
                        <p>Nous avons bien reçu votre paiement.</p>
                        
                        <div class="receipt">
                            <h3>🧾 Reçu de paiement</h3>
                            <p><strong>Référence :</strong> #${payment._id.toString().slice(-8).toUpperCase()}</p>
                            <p><strong>Date :</strong> ${new Date(payment.createdAt).toLocaleString("fr-FR")}</p>
                            <p><strong>Méthode :</strong> ${payment.method}</p>
                            <p class="amount">${payment.amount.toFixed(2)} €</p>
                            <p><strong>Statut :</strong> ${payment.status}</p>
                        </div>
                        
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="${process.env.FRONTEND_URL}/profile/payments" class="button" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                📊 Voir mes paiements
                            </a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || "Mon Commerce"}. Tous droits réservés.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

    return await sendEmail({
      to: user.email,
      subject: `💳 Reçu de paiement #${payment._id.toString().slice(-8).toUpperCase()}`,
      html,
    });
  } catch (error) {
    console.error("❌ Erreur email reçu de paiement:", error.message);
    throw error;
  }
};

/**
 * Envoi d'email d'ajout de coins
 * @param {Object} user - Utilisateur
 * @param {Number} amount - Quantité de coins ajoutée
 * @param {String} reason - Raison de l'ajout
 */
export const sendCoinsAddedEmail = async (
  user,
  amount,
  reason = "Achat de coins",
) => {
  try {
    const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; }
                    .header { background: linear-gradient(135deg, #ffd700 0%, #f4a460 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .coin-box { text-align: center; padding: 30px; background: #f8f9fa; border-radius: 10px; margin: 20px 0; }
                    .coin-amount { font-size: 48px; font-weight: bold; color: #ffd700; }
                    .footer { margin-top: 20px; text-align: center; color: #888; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🪙 Coins ajoutés !</h1>
                    </div>
                    <div class="content">
                        <h2>Bonjour ${user.name},</h2>
                        <p>${amount} coins ont été ajoutés à votre compte.</p>
                        
                        <div class="coin-box">
                            <span class="coin-amount">🪙 ${amount}</span>
                            <p style="margin-top: 10px; color: #666;">${reason}</p>
                        </div>
                        
                        <p><strong>Nouveau solde :</strong> ${user.coins} coins</p>
                        
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="${process.env.FRONTEND_URL}/profile/coins" class="button" style="background: #ffd700; color: #333; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                                🪙 Voir mon solde
                            </a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || "Mon Commerce"}. Tous droits réservés.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

    return await sendEmail({
      to: user.email,
      subject: `🪙 ${amount} coins ajoutés à votre compte`,
      html,
    });
  } catch (error) {
    console.error("❌ Erreur email coins ajoutés:", error.message);
    throw error;
  }
};

/**
 * Envoi d'email de renouvellement d'abonnement
 * @param {Object} user - Utilisateur
 * @param {Object} subscription - Abonnement
 */
export const sendSubscriptionRenewalEmail = async (user, subscription) => {
  try {
    const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .footer { margin-top: 20px; text-align: center; color: #888; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔄 Renouvellement d'abonnement</h1>
                    </div>
                    <div class="content">
                        <h2>Bonjour ${user.name},</h2>
                        <p>Votre abonnement ${subscription.type} a été renouvelé avec succès.</p>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                            <p><strong>Type :</strong> ${subscription.type.toUpperCase()}</p>
                            <p><strong>Date de renouvellement :</strong> ${new Date().toLocaleDateString("fr-FR")}</p>
                            <p><strong>Prochaine échéance :</strong> ${new Date(subscription.expiryDate).toLocaleDateString("fr-FR")}</p>
                        </div>
                        
                        <p>Vous bénéficiez maintenant de tous les avantages de l'abonnement ${subscription.type}.</p>
                        
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="${process.env.FRONTEND_URL}/profile/subscription" class="button" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                📊 Gérer mon abonnement
                            </a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || "Mon Commerce"}. Tous droits réservés.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

    return await sendEmail({
      to: user.email,
      subject: `🔄 Abonnement ${subscription.type} renouvelé`,
      html,
    });
  } catch (error) {
    console.error("❌ Erreur email renouvellement abonnement:", error.message);
    throw error;
  }
};

/**
 * Envoi d'email de notification d'abonnement expirant
 * @param {Object} user - Utilisateur
 * @param {Object} subscription - Abonnement
 */
export const sendSubscriptionExpiryWarningEmail = async (
  user,
  subscription,
) => {
  try {
    const daysLeft = Math.ceil(
      (new Date(subscription.expiryDate) - new Date()) / (1000 * 60 * 60 * 24),
    );

    const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; }
                    .header { background: linear-gradient(135deg, #ffc107 0%, #f57c00 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .warning-box { background: #fff3cd; border: 1px solid #ffc107; padding: 20px; border-radius: 5px; margin: 20px 0; }
                    .footer { margin-top: 20px; text-align: center; color: #888; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>⚠️ Votre abonnement expire bientôt</h1>
                    </div>
                    <div class="content">
                        <h2>Bonjour ${user.name},</h2>
                        
                        <div class="warning-box">
                            <p style="margin: 0; font-size: 18px; text-align: center;">
                                <strong>${daysLeft} jours restants</strong>
                            </p>
                            <p style="margin: 10px 0 0 0; text-align: center;">
                                Votre abonnement ${subscription.type} expire le 
                                ${new Date(subscription.expiryDate).toLocaleDateString("fr-FR")}
                            </p>
                        </div>
                        
                        <p>Pour continuer à bénéficier de tous les avantages, renouvelez votre abonnement dès maintenant.</p>
                        
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 0;"><strong>💡 N'oubliez pas :</strong></p>
                            <ul style="margin: 5px 0 0 0; padding-left: 20px;">
                                <li>Gardez vos réductions</li>
                                <li>Continuez à gagner des coins</li>
                                <li>Accédez à toutes les fonctionnalités</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="${process.env.FRONTEND_URL}/profile/subscription" class="button" style="background: #ffc107; color: #333; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                                🔄 Renouveler maintenant
                            </a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || "Mon Commerce"}. Tous droits réservés.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

    return await sendEmail({
      to: user.email,
      subject: `⚠️ Abonnement ${subscription.type} - Expire dans ${daysLeft} jours`,
      html,
    });
  } catch (error) {
    console.error("❌ Erreur email avertissement abonnement:", error.message);
    throw error;
  }
};

// Exporter toutes les fonctions
export default {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
  sendSupportTicketEmail,
  sendPaymentReceiptEmail,
  sendCoinsAddedEmail,
  sendSubscriptionRenewalEmail,
  sendSubscriptionExpiryWarningEmail,
};
