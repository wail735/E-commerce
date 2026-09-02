import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import Product from "./products/product.model.js";

dotenv.config();

const realProducts = [
  {
    name: "iPhone 13 Pro",
    description: "The iPhone 13 Pro is a cutting-edge smartphone with a powerful camera system, high-performance chip, and stunning display.",
    price: 1099.99,
    comparePrice: 1199.99,
    quantity: 56,
    category: "electronics",
    subCategory: "smartphones",
    brand: "Apple",
    images: [{ url: "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/1.webp", publicId: "real_1", isMain: true }],
    rating: 4.8,
    numReviews: 250
  },
  {
    name: "iPhone X",
    description: "The iPhone X is a flagship smartphone featuring a bezel-less OLED display, facial recognition technology (Face ID), and impressive performance.",
    price: 899.99,
    comparePrice: 999.99,
    quantity: 37,
    category: "electronics",
    subCategory: "smartphones",
    brand: "Apple",
    images: [{ url: "https://cdn.dummyjson.com/product-images/smartphones/iphone-x/1.webp", publicId: "real_2", isMain: true }],
    rating: 4.5,
    numReviews: 180
  },
  {
    name: "Samsung Galaxy S10",
    description: "The Samsung Galaxy S10 is a flagship device featuring a dynamic AMOLED display, versatile camera system, and powerful performance.",
    price: 699.99,
    comparePrice: 799.99,
    quantity: 19,
    category: "electronics",
    subCategory: "smartphones",
    brand: "Samsung",
    images: [{ url: "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/1.webp", publicId: "real_3", isMain: true }],
    rating: 4.6,
    numReviews: 210
  },
  {
    name: "Oppo F19 Pro Plus",
    description: "The Oppo F19 Pro Plus is a feature-rich smartphone with a focus on camera capabilities and premium user experience.",
    price: 399.99,
    comparePrice: 450.00,
    quantity: 78,
    category: "electronics",
    subCategory: "smartphones",
    brand: "Oppo",
    images: [{ url: "https://cdn.dummyjson.com/product-images/smartphones/oppo-f19-pro-plus/1.webp", publicId: "real_4", isMain: true }],
    rating: 4.3,
    numReviews: 150
  },
  {
    name: "Apple MacBook Pro 14 Inch",
    description: "The MacBook Pro 14 Inch in Space Grey is a powerful and sleek laptop, featuring Apple's M1 Pro chip for exceptional performance.",
    price: 1999.99,
    comparePrice: 2199.99,
    quantity: 24,
    category: "computers",
    subCategory: "laptops",
    brand: "Apple",
    images: [{ url: "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/1.webp", publicId: "real_5", isMain: true }],
    rating: 4.9,
    numReviews: 320
  },
  {
    name: "Asus Zenbook Pro Dual Screen",
    description: "The Asus Zenbook Pro Dual Screen Laptop is a high-performance device with dual screens, providing productivity for creative professionals.",
    price: 1799.99,
    comparePrice: 1999.99,
    quantity: 45,
    category: "computers",
    subCategory: "laptops",
    brand: "Asus",
    images: [{ url: "https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/1.webp", publicId: "real_6", isMain: true }],
    rating: 4.7,
    numReviews: 110
  },
  {
    name: "Huawei Matebook X Pro",
    description: "The Huawei Matebook X Pro is a slim and stylish laptop with a high-resolution touchscreen display, offering a premium experience.",
    price: 1399.99,
    comparePrice: 1599.99,
    quantity: 75,
    category: "computers",
    subCategory: "laptops",
    brand: "Huawei",
    images: [{ url: "https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/1.webp", publicId: "real_7", isMain: true }],
    rating: 4.8,
    numReviews: 290
  },
  {
    name: "Lenovo Yoga 920",
    description: "The Lenovo Yoga 920 is a 2-in-1 convertible laptop with a flexible hinge, allowing you to use it as a laptop or tablet.",
    price: 1099.99,
    comparePrice: 1299.99,
    quantity: 40,
    category: "computers",
    subCategory: "laptops",
    brand: "Lenovo",
    images: [{ url: "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/1.webp", publicId: "real_8", isMain: true }],
    rating: 4.6,
    numReviews: 145
  }
];

const seedRealProducts = async () => {
  try {
    await connectDB();
    
    // Supprimer tous les anciens produits
    await Product.deleteMany();
    console.log("Anciens produits supprimés avec succès.");

    // Insérer les 8 nouveaux produits réalistes
    await Product.insertMany(realProducts);
    console.log("Les 8 produits (Laptops & Phones) ont été insérés avec succès !");

    process.exit(0);
  } catch (error) {
    console.error("Erreur lors de l'insertion :", error);
    process.exit(1);
  }
};

seedRealProducts();
