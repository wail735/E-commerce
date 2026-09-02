import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import Product from "./products/product.model.js";

dotenv.config();

const dummyProducts = [
  {
    name: "Smartphone X Pro 5G",
    description: "Le tout dernier smartphone avec écran AMOLED 120Hz, processeur ultra-rapide et batterie longue durée. Idéal pour les jeux et la photographie.",
    price: 899.99,
    comparePrice: 1099.99,
    quantity: 50,
    category: "electronics",
    subCategory: "smartphones",
    brand: "TechBrand",
    images: [{ url: "https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=500&q=80", publicId: "img_1", isMain: true }],
    rating: 4.8,
    numReviews: 124
  },
  {
    name: "Ordinateur Portable UltraBook 14\"",
    description: "Léger, puissant et élégant. Cet ordinateur portable est parfait pour les professionnels en déplacement avec son autonomie de 12 heures.",
    price: 1249.00,
    comparePrice: 1499.00,
    quantity: 30,
    category: "computers",
    subCategory: "laptops",
    brand: "Computex",
    images: [{ url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80", publicId: "img_2", isMain: true }],
    rating: 4.7,
    numReviews: 89
  },
  {
    name: "Casque Audio Sans Fil Réduction Bruit",
    description: "Plongez dans votre musique avec notre technologie de réduction de bruit active leader sur le marché. Confort exceptionnel.",
    price: 249.99,
    comparePrice: 299.99,
    quantity: 100,
    category: "electronics",
    subCategory: "audio",
    brand: "SoundMakers",
    images: [{ url: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80", publicId: "img_3", isMain: true }],
    rating: 4.9,
    numReviews: 342
  },
  {
    name: "Montre Connectée Fitness Tracker",
    description: "Suivez votre activité quotidienne, votre fréquence cardiaque et votre sommeil. Étanche jusqu'à 50 mètres.",
    price: 89.99,
    comparePrice: 129.99,
    quantity: 200,
    category: "electronics",
    subCategory: "wearables",
    brand: "FitGear",
    images: [{ url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80", publicId: "img_4", isMain: true }],
    rating: 4.5,
    numReviews: 215
  },
  {
    name: "Appareil Photo Hybride 4K",
    description: "Capturez des moments inoubliables en très haute résolution. Livré avec un objectif standard 18-55mm.",
    price: 799.00,
    comparePrice: 949.00,
    quantity: 15,
    category: "electronics",
    subCategory: "cameras",
    brand: "CamPro",
    images: [{ url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80", publicId: "img_5", isMain: true }],
    rating: 4.6,
    numReviews: 67
  },
  {
    name: "Veste en Cuir Véritable Homme",
    description: "Veste en cuir de vachette véritable. Coupe moderne, fermeture éclair asymétrique. Un classique intemporel.",
    price: 189.50,
    comparePrice: 250.00,
    quantity: 45,
    category: "fashion",
    subCategory: "jackets",
    brand: "LeatherCraft",
    images: [{ url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80", publicId: "img_6", isMain: true }],
    rating: 4.4,
    numReviews: 42
  },
  {
    name: "Robe d'Été Imprimé Floral",
    description: "Robe légère et confortable, parfaite pour les journées ensoleillées. Tissu respirant.",
    price: 34.99,
    comparePrice: 49.99,
    quantity: 120,
    category: "fashion",
    subCategory: "dresses",
    brand: "SunWear",
    images: [{ url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80", publicId: "img_7", isMain: true }],
    rating: 4.3,
    numReviews: 88
  },
  {
    name: "Baskets de Course Performance",
    description: "Amorti optimal et retour d'énergie pour vos courses quotidiennes. Semelle extérieure très adhérente.",
    price: 119.99,
    comparePrice: 159.99,
    quantity: 75,
    category: "sports",
    subCategory: "shoes",
    brand: "RunFast",
    images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", publicId: "img_8", isMain: true }],
    rating: 4.8,
    numReviews: 156
  },
  {
    name: "Set d'Haltères Réglables 20kg",
    description: "Parfait pour votre salle de sport à domicile. Changez de poids rapidement. Livré avec un support.",
    price: 99.00,
    comparePrice: 139.00,
    quantity: 25,
    category: "sports",
    subCategory: "fitness",
    brand: "HomeGym",
    images: [{ url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&q=80", publicId: "img_9", isMain: true }],
    rating: 4.7,
    numReviews: 312
  },
  {
    name: "Tapis de Yoga Antidérapant",
    description: "Épaisseur de 6mm pour un confort optimal. Matière écologique et facile à nettoyer.",
    price: 24.50,
    comparePrice: 35.00,
    quantity: 150,
    category: "sports",
    subCategory: "yoga",
    brand: "ZenLife",
    images: [{ url: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&q=80", publicId: "img_10", isMain: true }],
    rating: 4.5,
    numReviews: 89
  },
  {
    name: "Ensemble de Couteaux de Chef",
    description: "Couteaux professionnels en acier inoxydable japonais. Manche ergonomique et tranchant exceptionnel.",
    price: 129.99,
    comparePrice: 189.99,
    quantity: 40,
    category: "home",
    subCategory: "kitchen",
    brand: "ChefMaster",
    images: [{ url: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&q=80", publicId: "img_11", isMain: true }],
    rating: 4.9,
    numReviews: 245
  },
  {
    name: "Aspirateur Robot Intelligent",
    description: "Nettoyage automatique avec cartographie laser. Contrôlable via application smartphone.",
    price: 349.00,
    comparePrice: 449.00,
    quantity: 20,
    category: "home",
    subCategory: "appliances",
    brand: "CleanBot",
    images: [{ url: "https://images.unsplash.com/photo-1589894404892-7310b92ea7bb?w=500&q=80", publicId: "img_12", isMain: true }],
    rating: 4.6,
    numReviews: 178
  },
  {
    name: "Sérum Anti-Âge à l'Acide Hyaluronique",
    description: "Hydratation intense et réduction visible des ridules. Formule naturelle sans parabènes.",
    price: 45.00,
    comparePrice: 60.00,
    quantity: 85,
    category: "beauty",
    subCategory: "skincare",
    brand: "PureGlow",
    images: [{ url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80", publicId: "img_13", isMain: true }],
    rating: 4.7,
    numReviews: 412
  },
  {
    name: "Palette de Maquillage 18 Couleurs",
    description: "Des couleurs très pigmentées pour des looks de jour comme de soirée. Finitions mates et irisées.",
    price: 39.99,
    comparePrice: 55.00,
    quantity: 110,
    category: "beauty",
    subCategory: "makeup",
    brand: "ColorPop",
    images: [{ url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=80", publicId: "img_14", isMain: true }],
    rating: 4.8,
    numReviews: 256
  },
  {
    name: "Set de Lego Espace",
    description: "Construisez votre propre station spatiale. Idéal pour les enfants de 8 ans et plus.",
    price: 89.99,
    comparePrice: 110.00,
    quantity: 60,
    category: "toys",
    subCategory: "building",
    brand: "BrickWorld",
    images: [{ url: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=500&q=80", publicId: "img_15", isMain: true }],
    rating: 4.9,
    numReviews: 134
  },
  {
    name: "Drone Quadricoptère avec Caméra 4K",
    description: "Volez et capturez des vues aériennes époustouflantes. Temps de vol de 30 minutes.",
    price: 599.00,
    comparePrice: 699.00,
    quantity: 25,
    category: "toys",
    subCategory: "drones",
    brand: "SkyRider",
    images: [{ url: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=500&q=80", publicId: "img_16", isMain: true }],
    rating: 4.5,
    numReviews: 92
  },
  {
    name: "Chargeur Voiture Rapide Double USB",
    description: "Rechargez deux appareils simultanément à haute vitesse pendant vos trajets.",
    price: 15.99,
    comparePrice: 24.99,
    quantity: 300,
    category: "automotive",
    subCategory: "accessories",
    brand: "AutoCharge",
    images: [{ url: "https://images.unsplash.com/photo-1616422361730-a9cbcf51392f?w=500&q=80", publicId: "img_17", isMain: true }],
    rating: 4.4,
    numReviews: 541
  },
  {
    name: "Support Téléphone pour Voiture",
    description: "Support magnétique ultra-puissant. Se fixe facilement sur la grille d'aération.",
    price: 12.50,
    comparePrice: 18.00,
    quantity: 250,
    category: "automotive",
    subCategory: "accessories",
    brand: "SecureMount",
    images: [{ url: "https://images.unsplash.com/photo-1601524317111-d11822c95d9f?w=500&q=80", publicId: "img_18", isMain: true }],
    rating: 4.6,
    numReviews: 320
  },
  {
    name: "Console de Jeu Nouvelle Génération",
    description: "Graphismes ultra-réalistes en 4K. Temps de chargement ultra-rapides. Manette sans fil incluse.",
    price: 499.99,
    comparePrice: 499.99,
    quantity: 10,
    category: "electronics",
    subCategory: "gaming",
    brand: "GameZone",
    images: [{ url: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80", publicId: "img_19", isMain: true }],
    rating: 4.9,
    numReviews: 876
  },
  {
    name: "Sac à Dos Ordinateur Antivol",
    description: "Compartiment caché et tissu résistant aux coupures. Port USB intégré pour charger votre téléphone.",
    price: 55.00,
    comparePrice: 75.00,
    quantity: 130,
    category: "fashion",
    subCategory: "bags",
    brand: "SafePack",
    images: [{ url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80", publicId: "img_20", isMain: true }],
    rating: 4.7,
    numReviews: 201
  }
];

const seedProducts = async () => {
  try {
    await connectDB();
    console.log("Connecté à MongoDB.");
    
    console.log("Insertion des produits en cours...");
    await Product.insertMany(dummyProducts);
    
    console.log(`${dummyProducts.length} produits insérés avec succès !`);
    process.exit(0);
  } catch (error) {
    console.error("Erreur lors de l'insertion des produits :", error);
    process.exit(1);
  }
};

seedProducts();
