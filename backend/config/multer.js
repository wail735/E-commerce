// Configuration de Multer pour l'upload de fichiers
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

/**
 * Multer : Middleware Node.js pour la gestion des uploads de fichiers
 *
 * Fonctionnalités :
 * - Upload de fichiers (images, vidéos, documents)
 * - Validation des types de fichiers
 * - Limitation de taille
 * - Stockage personnalisé
 * - Traitement des fichiers
 *
 * Cas d'utilisation :
 * 1. Images de produits (e-commerce)
 * 2. Photos de profil utilisateur
 * 3. Documents administratifs
 * 4. Fichiers joints (support)
 * 5. Upload de vidéos
 * 6. Import de données (CSV, Excel)
 */

// Récupérer le chemin du fichier actuel (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration des types de fichiers autorisés
export const fileTypes = {
  images: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ],
  documents: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  videos: ["video/mp4", "video/quicktime", "video/x-msvideo"],
  all: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "video/mp4",
  ],
};

// Filtrage des fichiers par type
const fileFilter = (req, file, cb) => {
  const allowedTypes = req.body.type
    ? fileTypes[req.body.type]
    : fileTypes.images;

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Type de fichier non autorisé. Types autorisés: ${allowedTypes.join(", ")}`,
      ),
      false,
    );
  }
};

// Configuration du stockage
const storage = multer.diskStorage({
  // Dossier de destination
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, "../uploads/");

    // Déterminer le dossier en fonction du type
    if (file.mimetype.startsWith("image/")) {
      uploadPath += "images/";
    } else if (file.mimetype.startsWith("video/")) {
      uploadPath += "videos/";
    } else if (file.mimetype === "application/pdf") {
      uploadPath += "documents/";
    } else {
      uploadPath += "others/";
    }

    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  // Nom du fichier
  filename: (req, file, cb) => {
    // Générer un nom unique
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    // Nettoyer le nom (enlever les caractères spéciaux)
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();

    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  },
});

// Configuration de Multer
export const multerConfig = {
  storage: storage,

  // Taille limite (10 MB par défaut)
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10 MB
    files: 10, // Nombre max de fichiers
  },

  // Filtre de fichier
  fileFilter: fileFilter,
};

// Upload simple
export const uploadSingle = (fieldName, options = {}) => {
  const config = {
    ...multerConfig,
    ...options,
  };

  const upload = multer(config);
  return upload.single(fieldName);
};

// Upload multiple (même champ)
export const uploadMultiple = (fieldName, maxCount = 5, options = {}) => {
  const config = {
    ...multerConfig,
    ...options,
  };

  const upload = multer(config);
  return upload.array(fieldName, maxCount);
};

// Upload de champs multiples
export const uploadFields = (fields, options = {}) => {
  const config = {
    ...multerConfig,
    ...options,
  };

  const upload = multer(config);
  return upload.fields(fields);
};

// Upload avec validation supplémentaire
export const uploadWithValidation = (fieldName, options = {}) => {
  const config = {
    ...multerConfig,
    ...options,
  };

  const upload = multer(config);

  return (req, res, next) => {
    // Vérifier la taille avant l'upload
    if (
      req.headers["content-length"] &&
      req.headers["content-length"] > config.limits.fileSize
    ) {
      return res.status(413).json({
        success: false,
        message: "Fichier trop volumineux",
      });
    }

    // Vérifier le type de fichier
    const contentType = req.headers["content-type"];
    if (contentType && !contentType.includes("multipart/form-data")) {
      return res.status(400).json({
        success: false,
        message: "Content-Type doit être multipart/form-data",
      });
    }

    // Exécuter l'upload
    upload.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Erreur Multer
        let message = "Erreur d'upload";
        if (err.code === "LIMIT_FILE_SIZE") {
          message = "Fichier trop volumineux";
        } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
          message = "Fichier inattendu";
        } else if (err.code === "LIMIT_FILE_COUNT") {
          message = "Trop de fichiers";
        }
        return res.status(400).json({
          success: false,
          message: message,
          error: err.message,
        });
      } else if (err) {
        // Erreur générique
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      // Succès
      next();
    });
  };
};

// Upload de profil utilisateur
export const uploadProfilePicture = () => {
  return uploadSingle("profilePicture", {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB
    },
    fileFilter: (req, file, cb) => {
      if (fileTypes.images.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new Error(
            "Seules les images sont autorisées pour la photo de profil",
          ),
          false,
        );
      }
    },
  });
};

// Upload d'images de produits
export const uploadProductImages = (maxCount = 5) => {
  return uploadMultiple("images", maxCount, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB
    },
    fileFilter: (req, file, cb) => {
      if (fileTypes.images.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new Error("Seules les images sont autorisées pour les produits"),
          false,
        );
      }
    },
  });
};

// Upload de documents (support)
export const uploadSupportDocuments = (
  fields = [
    { name: "attachment", maxCount: 1 },
    { name: "screenshots", maxCount: 3 },
  ],
) => {
  return uploadFields(fields, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB par fichier
    },
    fileFilter: (req, file, cb) => {
      const allowed = [...fileTypes.images, ...fileTypes.documents];
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Type de fichier non autorisé pour le support"), false);
      }
    },
  });
};

// Middleware de nettoyage des fichiers temporaires
export const cleanupFiles = (req, res, next) => {
  next();

  // Nettoyer les fichiers après la réponse
  res.on("finish", () => {
    if (req.files) {
      const files = Array.isArray(req.files)
        ? req.files
        : Object.values(req.files).flat();
      files.forEach((file) => {
        try {
          if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (error) {
          console.error("Erreur nettoyage fichier:", error.message);
        }
      });
    }
  });
};

export default {
  uploadSingle,
  uploadMultiple,
  uploadFields,
  uploadWithValidation,
  uploadProfilePicture,
  uploadProductImages,
  uploadSupportDocuments,
  cleanupFiles,
  fileTypes,
  multerConfig,
};
