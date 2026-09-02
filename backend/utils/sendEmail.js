import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1. Créer le "transporter" (le service d'envoi d'email, ici Gmail)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Votre adresse Gmail
      pass: process.env.EMAIL_PASS, // Le mot de passe d'application généré
    },
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
