import nodemailer from 'nodemailer';
import dns from 'dns';

// Fix for Render/Node.js IPv6 ENETUNREACH error with smtp.gmail.com
dns.setDefaultResultOrder('ipv4first');

const sendEmail = async (options) => {
  // Verify credentials exist to avoid unnecessary hanging
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️ Avertissement: EMAIL_USER ou EMAIL_PASS n'est pas défini. L'email ne sera pas envoyé.");
    return; // Skip email sending
  }

  // 1. Créer le "transporter" (le service d'envoi d'email, ici Gmail)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // Votre adresse Gmail
      pass: process.env.EMAIL_PASS, // Le mot de passe d'application généré
    },
    connectionTimeout: 5000, // Timeout if SMTP port is blocked
    greetingTimeout: 5000,
    socketTimeout: 5000,
  });

  // 2. Définir les options de l'email
  const mailOptions = {
    from: `"MoExpress" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, // Optionnel, si on veut envoyer de l'HTML (du beau design)
  };

  // 3. Envoyer l'email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
