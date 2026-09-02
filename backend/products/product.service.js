// ============================================================================
// FICHIER : backend 2/products/product.service.js
// RÔLE : Logique métier des produits et Auto-Complétion Intelligente via API Ollama AI
// ============================================================================

// 1. Importation du modèle Product, Review et des Réglages système
import Product from "./product.model.js";
import Review from "./review.model.js";
import Settings from "../config/settings.model.js";

// 2. Importation des services Cloudinary
import { uploadImage, deleteImage } from "../config/cloudinary.js";

/**
 * Création d'un produit avec upload d'images sur Cloudinary.
 */
export const createProduct = async (productData, files, adminId) => {
  const uploadedImages = [];

  // Si des fichiers images ont été téléversés via Multer, les envoyer à Cloudinary
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const uploadResult = await uploadImage(files[i].path, {
        folder: "products",
      });
      uploadedImages.push({
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        isMain: i === 0,
      });
    }
  }

  // Crée l'entrée produit dans MongoDB
  const newProduct = await Product.create({
    ...productData,
    images: uploadedImages,
    createdBy: adminId,
  });

  return newProduct;
};

/**
 * Recherche et filtrage multi-critères des produits (avec tri et pagination).
 */
export const searchProducts = async (queryFilters) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    page = 1,
    limit = 20,
    sort,
    seller,
  } = queryFilters;

  const query = {};
  
  if (seller) {
    query.createdBy = seller;
  } else {
    query.isPublished = true;
  }

  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { category: { $regex: keyword, $options: "i" } },
      { brand: { $regex: keyword, $options: "i" } },
    ];
  }

  if (category) {
    query.category = category;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const totalProducts = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate("createdBy", "name email storeName")
    .sort(
      sort === "price_asc"
        ? { price: 1 }
        : sort === "price_desc"
          ? { price: -1 }
          : { createdAt: -1 },
    )
    .skip(skip)
    .limit(Number(limit));

  return {
    products,
    pagination: {
      total: totalProducts,
      page: Number(page),
      pages: Math.ceil(totalProducts / Number(limit)),
    },
  };
};

/**
 * Auto-complétion lettre par lettre / mot par mot basée sur les produits de la BDD via l'API Ollama AI
 */
export const autocompleteSearch = async (queryText) => {
  if (!queryText || queryText.trim().length === 0) {
    return { suggestions: [], source: "empty" };
  }

  const cleanQuery = queryText.trim();

  // 1. Extraction des produits et catégories correspondants dans MongoDB
  const matchingProducts = await Product.find({
    isPublished: true,
    $or: [
      { name: { $regex: cleanQuery, $options: "i" } },
      { category: { $regex: cleanQuery, $options: "i" } },
      { brand: { $regex: cleanQuery, $options: "i" } },
    ],
  })
    .select("name category brand")
    .limit(10);

  // Si aucun produit ne correspond en BDD, retourner une liste vide
  if (!matchingProducts || matchingProducts.length === 0) {
    return { suggestions: [], source: "database" };
  }

  // Liste des noms et marques de produits réels en BDD
  const dbCandidateNames = matchingProducts.map((p) => p.name);
  const fallbackSuggestions = Array.from(new Set(dbCandidateNames)).slice(0, 5);

  // 2. Récupère la configuration Ollama dans les réglages dynamiques
  const settings = await Settings.getSettings();
  const { apiUrl, apiKey, model } = settings.ollamaConfig || {};

  const ollamaEndpoint = apiUrl
    ? `${apiUrl.replace(/\/$/, "")}/api/generate`
    : "http://localhost:11434/api/generate";

  // 3. Appel de l'API Ollama pour générer une déduction/auto-complétion intelligente mot par mot / lettre par lettre
  try {
    const promptText = `Tu es un moteur d'auto-complétion de recherche pour un e-commerce.
L'utilisateur a saisi le texte incomplet : "${cleanQuery}".
Voici les noms de produits réels disponibles en base de données : [${dbCandidateNames.join(", ")}].
Complète la recherche de l'utilisateur mot par mot et lettre par lettre en te basant STRICTEMENT sur ces produits.
Réponds uniquement par un tableau JSON de 5 chaînes de caractères au format : ["suggestion 1", "suggestion 2", "suggestion 3"].
Ne mets pas de texte d'explication avant ou après.`;

    const headers = { "Content-Type": "application/json" };
    if (apiKey && apiKey.trim().length > 0) {
      headers["Authorization"] = `Bearer ${apiKey.trim()}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // Timeout 3 secondes pour préserver la rapidité de la recherche

    const response = await fetch(ollamaEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: model || "llama3",
        prompt: promptText,
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const rawOutput = data.response || data.completion || "";

      // Extrait le tableau JSON de la réponse de l'IA Ollama
      const jsonMatch = rawOutput.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsedArray = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsedArray) && parsedArray.length > 0) {
          return {
            suggestions: parsedArray.slice(0, 5),
            source: "ollama_ai",
          };
        }
      }
    }
  } catch (error) {
    // Si l'API Ollama n'est pas accessible ou met trop de temps, fallback immédiat sur la BDD sans interrompre l'expérience utilisateur
    console.warn(
      "⚠️ API Ollama non joignable (Fallback sur BDD MongoDB) :",
      error.message,
    );
  }

  // Fallback direct sur les résultats réels enregistrés en BDD
  return {
    suggestions: fallbackSuggestions,
    source: "database_fallback",
  };
};

/**
 * Récupère un produit par son ID.
 */
export const getProductById = async (productId) => {
  const product = await Product.findById(productId).populate(
    "createdBy",
    "name email storeName proShopDetails isProShop",
  );
  if (!product) {
    throw new Error("Produit non trouvé.");
  }
  return product;
};

/**
 * Mise à jour d'un produit existant (et ajout optionnel de nouvelles images).
 */
export const updateProduct = async (productId, updateData, newFiles) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Produit non trouvé.");
  }

  if (newFiles && newFiles.length > 0) {
    for (let file of newFiles) {
      const uploadResult = await uploadImage(file.path, { folder: "products" });
      product.images.push({
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        isMain: product.images.length === 0,
      });
    }
  }

  Object.assign(product, updateData);
  await product.save();

  return product;
};

/**
 * Suppression d'un produit et de ses images associées sur Cloudinary.
 */
export const deleteProduct = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Produit non trouvé.");
  }

  if (product.images && product.images.length > 0) {
    for (let image of product.images) {
      if (image.publicId) {
        await deleteImage(image.publicId).catch((err) =>
          console.error("Échec suppr image Cloudinary :", err),
        );
      }
    }
  }

  await Product.findByIdAndDelete(productId);

  return { message: "Produit et images supprimés avec succès." };
};

/**
 * Obtenir les avis d'un produit
 */
export const getProductReviews = async (productId) => {
  return await Review.find({ product: productId })
    .populate("user", "name")
    .sort({ createdAt: -1 });
};

/**
 * Créer un avis
 */
export const createProductReview = async (productId, userId, reviewData) => {
  const { rating, comment } = reviewData;
  const product = await Product.findById(productId);
  
  if (!product) {
    throw new Error("Produit non trouvé");
  }

  const alreadyReviewed = await Review.findOne({ product: productId, user: userId });
  if (alreadyReviewed) {
    throw new Error("Vous avez déjà donné votre avis sur ce produit");
  }

  const review = await Review.create({
    product: productId,
    user: userId,
    rating: Number(rating),
    comment,
  });

  // Mettre à jour la moyenne du produit
  const reviews = await Review.find({ product: productId });
  product.numReviews = reviews.length;
  product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  
  await product.save();
  return review;
};

export default {
  createProduct,
  searchProducts,
  autocompleteSearch,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductReviews,
  createProductReview,
};
