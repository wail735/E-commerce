import User from '../models/User.model.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';
import axios from 'axios';


export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: 'Cet utilisateur existe déjà et est vérifié.' });
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const otpExpires = Date.now() + 10 * 60 * 1000;

    if (!user) {
      user = await User.create({
        name,
        email,
        password,
        otp,
        otpExpires,
      });
    } else {
      user.name = name;
      user.password = password;
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    }

    const message = `Bonjour ${name},\n\nVotre code de vérification MoExpress est : ${otp}\nCe code expirera dans 10 minutes.\n\nSi vous n'avez pas demandé ce code, veuillez ignorer cet email.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Votre code de vérification MoExpress',
        message,
      });

      res.status(200).json({
        success: true,
        message: 'Un code de vérification a été envoyé à votre email.',
      });
    } catch (error) {
      console.error("Erreur d'envoi d'email:", error);
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      
      return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }
    const token = user.getSignedJwtToken();
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() }, 
    });

    if (!user) {
      return res.status(400).json({ message: 'Code invalide ou expiré.' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mot de passe oublié (Générer OTP)
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Il n'y a pas d'utilisateur avec cet email." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const message = `Bonjour,\n\nVous avez demandé la réinitialisation de votre mot de passe. Voici votre code OTP : ${otp}\nCe code expirera dans 10 minutes.\n\nSi vous n'avez pas demandé cela, veuillez ignorer cet email.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Réinitialisation de votre mot de passe',
        message,
      });

      res.status(200).json({ success: true, message: 'Code envoyé à votre email.' });
    } catch (error) {
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      return res.status(500).json({ message: "Erreur lors de l'envoi de l'email." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Réinitialiser le mot de passe avec OTP
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Code invalide ou expiré.' });
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Mot de passe réinitialisé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Connexion avec Google
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({ message: "Token Google manquant" });
    }

    // Récupérer les infos de l'utilisateur depuis l'API Google
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!data.email) {
      return res.status(400).json({ message: "Impossible d'obtenir l'email depuis Google" });
    }

    // Chercher l'utilisateur
    let user = await User.findOne({ email: data.email });

    if (!user) {
      // Créer un nouvel utilisateur s'il n'existe pas
      user = await User.create({
        name: data.name,
        email: data.email,
        googleId: data.sub, // ID unique de Google
        isVerified: true, // Automatiquement vérifié si via Google
      });
    } else {
      // Si l'utilisateur existe mais sans googleId, on le met à jour
      if (!user.googleId) {
        user.googleId = data.sub;
        user.isVerified = true;
        await user.save();
      }
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: data.picture || user.avatar,
      },
    });
  } catch (error) {
    console.error("Erreur Google Login:", error.message);
    res.status(500).json({ message: "La connexion avec Google a échoué" });
  }
};
