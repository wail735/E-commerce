import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImage = async (filePath, options = {}) => {
  try {
    const defaultOptions = {
      folder: "products",
      resource_type: "auto",
    };
    const uploadOptions = { ...defaultOptions, ...options };
    const result = await cloudinary.uploader.unsigned_upload(filePath, "moexpress_products", uploadOptions);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      createdAt: result.created_at,
    };
  } catch (error) {
    console.error("Erreur upload Cloudinary:", error.message);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // nettoyer le fichier temp même en cas d'erreur
    throw new Error(`Erreur lors de l'upload de l'image: ${error.message}`);
  }
};

const uploadBase64 = async (base64String, options = {}) => {
  try {
    // Vérifier si la chaîne base64 est valide
    if (!base64String || !base64String.startsWith("data:image")) {
      throw new Error("Format base64 invalide");
      return await uploadImage(base64String, options);
    }
  } catch (error) {
    console.error("Erreur upload base64:", error.message);
    throw error;
  }
};

const uploadMultiple = async (files, options = {}) => {
  try {
    // Créer un tableau de promesses d'upload
    const uploadPromises = files.map((file) => uploadImage(file.path, options));
    // Exécuter toutes les promesses en parallèle
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error("Erreur upload multiple:", error.message);
    throw error;
  }
};

export const deleteImage = async (publicId) => {
  try {
    // Destruction de l'image par son ID public
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      console.log(`Image ${publicId} supprimée avec succès`);
    } else {
      console.warn(`Échec de suppression de ${publicId}: ${result.result}`);
    }

    return result;
  } catch (error) {
    console.error("Erreur suppression image:", error.message);
    throw error;
  }
};

const deleteMultipleImages = async (publicIds) => {
  try {
    // Créer un tableau de promesses de suppression
    const deletePromises = publicIds.map((id) => deleteImage(id));
    // Exécuter toutes les suppressions en parallèle
    const results = await Promise.all(deletePromises);
    return results;
  } catch (error) {
    console.error("Erreur suppression multiple:", error.message);
    throw error;
  }
};

const optimizeUrl = (url, options = {}) => {
  // Si l'URL n'est pas Cloudinary, la retourner telle quelle
  if (!url.includes("cloudinary.com")) {
    return url;
  }

  // Options par défaut
  const defaultOptions = {
    quality: "auto", // Qualité automatique
    fetch_format: "auto", // Format automatique
    width: 800,
    height: 800,
    crop: "limit",
  };

  const finalOptions = { ...defaultOptions, ...options };

  // Générer l'URL optimisée avec Cloudinary
  return cloudinary.url(url, finalOptions);
};

const getOptimizedUrl = (publicId, transformations = {}) => {
  try {
    // Définir les transformations par défaut
    const defaultTransform = {
      width: 600,
      height: 600,
      crop: "fill",
      quality: "auto",
      fetch_format: "auto",
    };

    const finalTransform = { ...defaultTransform, ...transformations };

    // Générer l'URL avec les transformations
    return cloudinary.url(publicId, {
      ...finalTransform,
      secure: true,
    });
  } catch (error) {
    console.error("Erreur génération URL:", error.message);
    return publicId;
  }
};

const uploadWithSizeLimit = async (filePath, maxSize = 5) => {
  try {
    // Vérifier la taille du fichier
    const stats = fs.statSync(filePath);
    const fileSizeInMB = stats.size / (1024 * 1024);

    if (fileSizeInMB > maxSize) {
      throw new Error(
        `La taille du fichier (${fileSizeInMB.toFixed(2)} MB) dépasse la limite de ${maxSize} MB`,
      );
    }

    return await uploadImage(filePath);
  } catch (error) {
    console.error("Erreur upload avec limite de taille:", error.message);
    throw error;
  }
};

export default {
  uploadImage,
  uploadBase64,
  uploadMultiple,
  deleteImage,
  deleteMultipleImages,
  optimizeUrl,
  getOptimizedUrl,
  uploadWithSizeLimit,
};
