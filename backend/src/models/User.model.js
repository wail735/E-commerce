import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez fournir un email valide'],
    },
    password: {
      type: String,
      // Le mot de passe n'est pas requis si l'utilisateur se connecte avec Google
      required: function() {
        return !this.googleId;
      },
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
      select: false, // Ne pas renvoyer le mot de passe par défaut dans les requêtes
    },
    googleId: {
      type: String,
      default: null, // Si l'utilisateur s'est inscrit via Google
    },
    isVerified: {
      type: Boolean,
      default: false, // Par défaut, le compte n'est pas vérifié (besoin d'OTP)
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    }
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt
  }
);

// Hasher le mot de passe avant de sauvegarder
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour comparer les mots de passe
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Méthode pour générer un JWT
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const User = mongoose.model('User', userSchema);

export default User;
