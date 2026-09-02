// Configuration de la compression Gzip
import compression from "compression";

/**
 * Compression : Middleware qui compresse les réponses HTTP
 * avec l'algorithme Gzip ou Brotli
 * 
 * Avantages :
 * - Réduit la taille des réponses (jusqu'à 70%)
 * - Améliore les temps de chargement
 - Réduit la bande passante
 * - Meilleure expérience utilisateur
 * 
 * Cas d'utilisation :
 * 1. API REST avec de grandes réponses
 * 2. Applications web avec beaucoup de contenu
 * 3. Services de streaming
 * 4. Téléchargements de fichiers
 */

// Configuration de la compression
export const compressionOptions = {
  // Niveau de compression (1-9)
  level: 6, // Bon compromis vitesse/compression

  // Seuil minimum en bytes avant compression
  threshold: 1024, // 1 KB

  // Filtrer les types de contenu à compresser
  filter: (req, res) => {
    // Vérifier si la compression est demandée
    if (req.headers["x-no-compression"]) {
      return false;
    }

    // Ne pas compresser les images, vidéos, etc.
    const contentType = res.getHeader("content-type");
    if (contentType) {
      const noCompress = [
        "image/",
        "video/",
        "audio/",
        "application/zip",
        "application/pdf",
      ];
      if (noCompress.some((type) => contentType.includes(type))) {
        return false;
      }
    }

    // Compression par défaut
    return true;
  },

  // Algorithme de compression
  // brotli : Plus efficace mais plus lent
  // gzip : Bon compromis
  // deflate : Rapide
  algorithm: "gzip",
};

// Middleware de compression
export const compressionMiddleware = compression(compressionOptions);

// Compression avec Brotli (si disponible)
export const brotliCompression = compression({
  level: 11,
  threshold: 1024,
  algorithm: "brotliCompress",
});

export default {
  compressionOptions,
  compressionMiddleware,
  brotliCompression,
};
