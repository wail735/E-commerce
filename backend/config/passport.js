// Configuration de Passport.js pour l'authentification
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../users/user.model.js";
import { comparePassword } from "./auth.js";

/**
 * Passport.js : Middleware d'authentification pour Node.js
 * Supporte de nombreuses stratégies d'authentification
 *
 * Stratégies supportées :
 * - Local (email/mot de passe)
 * - JWT (JSON Web Token)
 * - OAuth (Google, Facebook, etc.)
 * - SAML
 * - OpenID
 *
 * Cas d'utilisation :
 * 1. Authentification traditionnelle
 * 2. Authentification par token
 * 3. SSO (Single Sign-On)
 * 4. Authentification sociale
 */

// Stratégie locale (email + mot de passe)
export const localStrategy = new LocalStrategy(
  {
    usernameField: "email", // Champ pour l'email
    passwordField: "password", // Champ pour le mot de passe
    session: false, // Ne pas utiliser de session
  },
  async (email, password, done) => {
    try {
      // Rechercher l'utilisateur par email
      const user = await User.findOne({ email: email.toLowerCase() }).select(
        "+password",
      ); // Inclure le mot de passe

      // Vérifier si l'utilisateur existe
      if (!user) {
        return done(null, false, {
          message: "Email ou mot de passe incorrect",
        });
      }

      // Vérifier si le compte est actif
      if (!user.isActive) {
        return done(null, false, {
          message: "Compte désactivé. Contactez le support.",
        });
      }

      // Comparer les mots de passe
      const isMatch = await comparePassword(password, user.password);

      if (!isMatch) {
        return done(null, false, {
          message: "Email ou mot de passe incorrect",
        });
      }

      // Succès de l'authentification
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  },
);

// Stratégie JWT
export const jwtStrategy = new JwtStrategy(
  {
    // Extraire le token du header Authorization
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // Clé secrète pour la vérification
    secretOrKey: process.env.JWT_SECRET,
    // Options supplémentaires
    issuer: process.env.JWT_ISSUER || "myapp.com",
    audience: process.env.JWT_AUDIENCE || "myapp",
    // Vérifier l'expiration automatiquement
    ignoreExpiration: false,
  },
  async (payload, done) => {
    try {
      // Rechercher l'utilisateur à partir du payload
      const user = await User.findById(payload.id);

      // Vérifier si l'utilisateur existe
      if (!user) {
        return done(null, false, {
          message: "Utilisateur non trouvé",
        });
      }

      // Vérifier si le compte est actif
      if (!user.isActive) {
        return done(null, false, {
          message: "Compte désactivé",
        });
      }

      // Succès
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  },
);

// Configuration Passport
export const configurePassport = () => {
  // Utiliser les stratégies
  passport.use("local", localStrategy);
  passport.use("jwt", jwtStrategy);

  // Serialization (pour les sessions)
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialization (pour les sessions)
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  return passport;
};

// Middleware d'authentification JWT
export const authenticateJWT = passport.authenticate("jwt", {
  session: false,
  failWithError: true,
});

// Middleware d'authentification locale
export const authenticateLocal = passport.authenticate("local", {
  session: false,
  failWithError: true,
});

export { passport };

export default {
  localStrategy,
  jwtStrategy,
  configurePassport,
  authenticateJWT,
  authenticateLocal,
  passport,
};
