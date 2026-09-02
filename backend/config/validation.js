// Configuration de la validation avec Joi
import Joi from "joi";

/**
 * Joi : Bibliothèque de validation de données
 * Permet de définir des schémas de validation
 * 
 * Types de validation :
 * - Strings, Numbers, Booleans
 * - Arrays, Objects
 - - Dates, Emails, URLs
 * - Personnalisé (custom)
 * 
 * Cas d'utilisation :
 * 1. Validation des données d'API
 * 2. Validation des formulaires
 * 3. Validation des paramètres
 * 4. Validation des modèles
 */

// Schémas de validation

// Validation de l'email
export const emailSchema = Joi.string()
  .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "fr", "org"] } })
  .required()
  .messages({
    "string.email": "Email invalide",
    "string.empty": "L'email est requis",
    "any.required": "L'email est requis",
  });

// Validation du mot de passe
export const passwordSchema = Joi.string()
  .min(8)
  .max(50)
  .pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  )
  .required()
  .messages({
    "string.min": "Le mot de passe doit contenir au moins 8 caractères",
    "string.max": "Le mot de passe ne peut pas dépasser 50 caractères",
    "string.pattern.base":
      "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial",
    "string.empty": "Le mot de passe est requis",
    "any.required": "Le mot de passe est requis",
  });

// Validation de l'utilisateur
export const userValidationSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.min": "Le nom doit contenir au moins 2 caractères",
    "string.max": "Le nom ne peut pas dépasser 50 caractères",
    "string.empty": "Le nom est requis",
    "any.required": "Le nom est requis",
  }),

  email: emailSchema,

  password: passwordSchema,

  phoneNumber: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .allow(null, "")
    .messages({
      "string.pattern.base": "Numéro de téléphone invalide",
    }),

  address: Joi.object({
    street: Joi.string().max(200).allow(""),
    city: Joi.string().max(100).allow(""),
    state: Joi.string().max(100).allow(""),
    country: Joi.string().max(100).allow(""),
    zipCode: Joi.string().max(20).allow(""),
  }),

  role: Joi.string().valid("user", "admin", "superAdmin").default("user"),
});

// Validation du produit
export const productValidationSchema = Joi.object({
  name: Joi.string().min(3).max(200).required().messages({
    "string.min": "Le nom du produit doit contenir au moins 3 caractères",
    "string.max": "Le nom du produit ne peut pas dépasser 200 caractères",
    "string.empty": "Le nom du produit est requis",
    "any.required": "Le nom du produit est requis",
  }),

  description: Joi.string().min(10).max(5000).required().messages({
    "string.min": "La description doit contenir au moins 10 caractères",
    "string.max": "La description ne peut pas dépasser 5000 caractères",
    "string.empty": "La description est requise",
    "any.required": "La description est requise",
  }),

  shortDescription: Joi.string().max(300).allow(""),

  price: Joi.number().min(0).required().messages({
    "number.min": "Le prix ne peut pas être négatif",
    "number.base": "Le prix doit être un nombre",
    "any.required": "Le prix est requis",
  }),

  comparePrice: Joi.number().min(0).allow(null),

  quantity: Joi.number().integer().min(0).required().messages({
    "number.integer": "La quantité doit être un nombre entier",
    "number.min": "La quantité ne peut pas être négative",
    "any.required": "La quantité est requise",
  }),

  category: Joi.string().required().messages({
    "string.empty": "La catégorie est requise",
    "any.required": "La catégorie est requise",
  }),

  subCategory: Joi.string().allow(""),

  brand: Joi.string().allow(""),

  images: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().uri().required(),
        publicId: Joi.string().required(),
        alt: Joi.string().allow(""),
        isMain: Joi.boolean().default(false),
      }),
    )
    .min(1)
    .messages({
      "array.min": "Au moins une image est requise",
    }),
});

// Validation de la commande
export const orderValidationSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().min(0).required(),
      }),
    )
    .min(1)
    .required(),

  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    zipCode: Joi.string().required(),
  }).required(),

  paymentMethod: Joi.string()
    .valid("card", "paypal", "coins", "bank_transfer", "crypto")
    .required(),

  notes: Joi.string().allow(""),
});

// Validation du support
export const supportValidationSchema = Joi.object({
  subject: Joi.string().min(5).max(200).required().messages({
    "string.min": "Le sujet doit contenir au moins 5 caractères",
    "string.max": "Le sujet ne peut pas dépasser 200 caractères",
    "string.empty": "Le sujet est requis",
    "any.required": "Le sujet est requis",
  }),

  message: Joi.string().min(10).max(5000).required().messages({
    "string.min": "Le message doit contenir au moins 10 caractères",
    "string.max": "Le message ne peut pas dépasser 5000 caractères",
    "string.empty": "Le message est requis",
    "any.required": "Le message est requis",
  }),

  category: Joi.string()
    .valid("account", "order", "payment", "product", "technical", "other")
    .required(),

  priority: Joi.string()
    .valid("low", "medium", "high", "urgent")
    .default("medium"),

  attachments: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().uri(),
        name: Joi.string(),
        size: Joi.number(),
      }),
    )
    .default([]),
});

// Validation du ticket de support (admin)
export const supportUpdateSchema = Joi.object({
  status: Joi.string()
    .valid("open", "in_progress", "resolved", "closed")
    .required(),

  priority: Joi.string().valid("low", "medium", "high", "urgent"),

  response: Joi.string().min(5).max(5000).required().messages({
    "string.min": "La réponse doit contenir au moins 5 caractères",
    "string.max": "La réponse ne peut pas dépasser 5000 caractères",
    "string.empty": "La réponse est requise",
    "any.required": "La réponse est requise",
  }),

  assignedTo: Joi.string().allow(null),
});

// Validation de l'abonnement
export const subscriptionValidationSchema = Joi.object({
  type: Joi.string().valid("basic", "premium", "pro", "enterprise").required(),

  duration: Joi.string()
    .valid("monthly", "quarterly", "semestrial", "yearly")
    .default("monthly"),

  autoRenew: Joi.boolean().default(true),
});

// Middleware de validation
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Récupérer toutes les erreurs
      stripUnknown: true, // Enlever les champs inconnus
      allowUnknown: false, // Ne pas autoriser les champs inconnus
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Erreur de validation",
        errors: errors,
      });
    }

    // Remplacer req.body par les données validées
    req.body = value;
    next();
  };
};

// Middleware de validation des paramètres
export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Paramètres invalides",
        errors: errors,
      });
    }

    req.params = value;
    next();
  };
};

// Middleware de validation des query
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Paramètres de requête invalides",
        errors: errors,
      });
    }

    req.query = value;
    next();
  };
};

export default {
  emailSchema,
  passwordSchema,
  userValidationSchema,
  productValidationSchema,
  orderValidationSchema,
  supportValidationSchema,
  supportUpdateSchema,
  subscriptionValidationSchema,
  validate,
  validateParams,
  validateQuery,
};
