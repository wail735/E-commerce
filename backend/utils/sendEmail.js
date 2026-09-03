import axios from 'axios';

const sendEmail = async (options) => {
  // Verify Brevo API key exists
  if (!process.env.BREVO_API_KEY) {
    console.warn("⚠️ Avertissement: BREVO_API_KEY n'est pas défini. L'email ne sera pas envoyé.");
    return; // Skip email sending
  }

  // Utilisation de l'API REST de Brevo pour contourner le blocage SMTP de Render
  const payload = {
    sender: {
      name: "MoExpress",
      email: process.env.EMAIL_USER || "contact@moexpress.com"
    },
    to: [
      {
        email: options.email
      }
    ],
    subject: options.subject,
    htmlContent: options.html
  };

  if (options.message) {
    payload.textContent = options.message;
  }

  await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      'accept': 'application/json'
    }
  });
};

export default sendEmail;
