import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Créer une image de test (1x1 pixel PNG en base64)
const base64Img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

try {
  console.log("Test upload vers Cloudinary...");
  const result = await cloudinary.uploader.upload(base64Img, {
    folder: "test",
    resource_type: "image",
  });
  console.log("✅ Upload réussi !");
  console.log("URL:", result.secure_url);
  
  // Supprimer l'image de test
  await cloudinary.uploader.destroy(result.public_id);
  console.log("✅ Image test supprimée");
} catch (err) {
  console.error("❌ Erreur upload:", err.message);
  console.error("HTTP Code:", err.http_code);
  console.error("Détails:", JSON.stringify(err.error, null, 2));
}
