import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const base64Img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

try {
  console.log("Test upload UNSIGNED vers Cloudinary...");
  const result = await cloudinary.uploader.unsigned_upload(base64Img, "moexpress_products", {
    folder: "products",
    resource_type: "auto",
  });
  console.log("✅ Upload réussi !");
  console.log("URL:", result.secure_url);
  
  await cloudinary.uploader.destroy(result.public_id);
  console.log("✅ Image test supprimée");
} catch (err) {
  console.error("❌ Erreur upload:", err.message);
  console.error("HTTP Code:", err.http_code);
  console.error("Détails:", JSON.stringify(err.error, null, 2));
}
