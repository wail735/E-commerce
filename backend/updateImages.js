import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import Product from "./products/product.model.js";

dotenv.config();

const getSafeKeyword = (name) => {
  const n = name.toLowerCase();
  if (n.includes('smartphone')) return 'smartphone,device';
  if (n.includes('ordinateur')) return 'laptop,computer';
  if (n.includes('casque')) return 'headphones,audio';
  if (n.includes('montre')) return 'smartwatch,watch';
  if (n.includes('appareil photo')) return 'camera,lens';
  if (n.includes('veste')) return 'jacket,clothing';
  if (n.includes('robe')) return 'dress,clothing';
  if (n.includes('basket')) return 'sneakers,shoes';
  if (n.includes('haltère')) return 'dumbbell,fitness';
  if (n.includes('tapis de yoga')) return 'yogamat,fitness';
  if (n.includes('couteau')) return 'chefknife,kitchen';
  if (n.includes('aspirateur')) return 'vacuumcleaner,appliance';
  if (n.includes('sérum')) return 'serumbottle,skincare';
  if (n.includes('maquillage')) return 'makeuppalette,cosmetics';
  if (n.includes('lego')) return 'legotoys,plastic';
  if (n.includes('drone')) return 'drone,gadget';
  if (n.includes('chargeur')) return 'carcharger,usb';
  if (n.includes('support téléphone')) return 'phoneholder,car';
  if (n.includes('console')) return 'gamingconsole,controller';
  if (n.includes('sac à dos')) return 'backpack,bag';
  
  return 'ecommerce,product';
};

const updateImages = async () => {
  try {
    await connectDB();
    
    const products = await Product.find({});
    console.log(`Found ${products.length} products to update.`);

    let count = 0;
    for (const p of products) {
      const keyword = getSafeKeyword(p.name);
      const randomId = Math.floor(Math.random() * 1000);
      
      // Using unsplash API via source.unsplash if possible, but loremflickr is safer with good keywords
      // Adding "isolated" to keywords helps getting product-like photos
      const newImageUrl = `https://loremflickr.com/500/500/${encodeURIComponent(keyword + ',isolated')}?random=${randomId}`;
      
      p.images = [{ url: newImageUrl, publicId: `img_${p._id}`, isMain: true }];
      
      await p.save();
      count++;
    }

    console.log(`Successfully updated ${count} products with safer LoremFlickr photos!`);
    process.exit(0);
  } catch (error) {
    console.error("Error updating images:", error);
    process.exit(1);
  }
};

updateImages();
