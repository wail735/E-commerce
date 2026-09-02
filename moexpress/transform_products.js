const fs = require('fs');

const content = fs.readFileSync('./src/data/products.js', 'utf8');
const { products } = require('./src/data/products.js');

const frTranslations = {
  "Wireless Earbuds": "Écouteurs sans fil",
  "Smart Watch": "Montre intelligente",
  "Backpack": "Sac à dos",
  "Sneakers": "Baskets",
  "Sunglasses": "Lunettes de soleil",
  "Portable Speaker": "Enceinte portable",
  "Laptop Pro": "Ordinateur portable Pro",
  "Running Shoes": "Chaussures de course",
  "Face Serum": "Sérum pour le visage",
  "Desk Lamp": "Lampe de bureau",
  "Men's Jacket": "Veste pour homme",
  "USB-C Hub": "Hub USB-C",
  "Designer Handbag": "Sac à main de créateur",
  "Coffee Maker": "Cafetière",
  "Smartphone X": "Smartphone X",
  "Perfume Set": "Coffret de parfum",
  "Gaming Mouse": "Souris de jeu",
  "Kids Toy Set": "Ensemble de jouets",
  "Mechanical Keyboard": "Clavier mécanique"
};

const arTranslations = {
  "Wireless Earbuds": "سماعات لاسلكية",
  "Smart Watch": "ساعة ذكية",
  "Backpack": "حقيبة ظهر",
  "Sneakers": "حذاء رياضي",
  "Sunglasses": "نظارات شمسية",
  "Portable Speaker": "مكبر صوت محمول",
  "Laptop Pro": "لابتوب برو",
  "Running Shoes": "حذاء جري",
  "Face Serum": "سيروم للوجه",
  "Desk Lamp": "مصباح مكتب",
  "Men's Jacket": "سترة رجالية",
  "USB-C Hub": "موزع USB-C",
  "Designer Handbag": "حقيبة يد فاخرة",
  "Coffee Maker": "صانعة قهوة",
  "Smartphone X": "هاتف ذكي X",
  "Perfume Set": "مجموعة عطور",
  "Gaming Mouse": "ماوس ألعاب",
  "Kids Toy Set": "مجموعة ألعاب أطفال",
  "Mechanical Keyboard": "لوحة مفاتيح ميكانيكية"
};

const descEn = "Experience premium quality with our latest product. Designed to meet the highest standards, this product combines functionality with a sleek, modern aesthetic. Whether you are using it at home, in the office, or on the go, it delivers exceptional performance and reliability.";
const descFr = "Découvrez une qualité supérieure avec notre dernier produit. Conçu pour répondre aux normes les plus élevées, ce produit allie fonctionnalité et esthétique moderne et épurée. Que vous l'utilisiez à la maison, au bureau ou en déplacement, il offre des performances et une fiabilité exceptionnelles.";
const descAr = "استمتع بجودة ممتازة مع أحدث منتجاتنا. تم تصميم هذا المنتج لتلبية أعلى المعايير، ويجمع بين الوظائف والجماليات الحديثة والأنيقة. سواء كنت تستخدمه في المنزل أو المكتب أو أثناء التنقل، فإنه يوفر أداءً وموثوقية استثنائيين.";

const newProducts = products.map(p => {
  return {
    ...p,
    name: {
      en: p.name,
      fr: frTranslations[p.name] || p.name,
      ar: arTranslations[p.name] || p.name
    },
    description: {
      en: descEn,
      fr: descFr,
      ar: descAr
    }
  }
});

const fileContent = `export const products = ${JSON.stringify(newProducts, null, 2)};\n`;
fs.writeFileSync('./src/data/products.js', fileContent);
console.log("Updated products.js");
