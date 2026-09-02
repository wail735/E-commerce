import fs from 'fs';

const filePath = 'moexpress/src/pages/seller/SellerProductsPage.jsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Add import
if(!content.includes('useLanguage')) {
  content = content.replace(/import \{ useAuth \} from '\.\.\/\.\.\/context\/AuthContext';/, "import { useAuth } from '../../context/AuthContext';\nimport { useLanguage } from '../../context/LanguageContext';");
}

// Add useLanguage hook
if(!content.includes('const { t } = useLanguage();')) {
  content = content.replace(/const \{ token, user \} = useAuth\(\);/, "const { token, user } = useAuth();\n  const { t } = useLanguage();");
}

// Translate texts
content = content.replace(/>Mes Produits</g, ">{t('seller_products')}<");
content = content.replace(/>Gérez votre catalogue de vente</g, ">{t('manage_products_desc')}<");
content = content.replace(/>Ajouter un Produit</g, ">{t('add_new_product')}<");
content = content.replace(/placeholder="Rechercher un produit\.\.\."/g, "placeholder={t('search_products')}");
content = content.replace(/>Ajouter un nouveau produit</g, ">{t('add_new_product')}<");
content = content.replace(/>Modifier le produit</g, ">{t('edit')}<");
content = content.replace(/>Prix régulier/g, ">{t('price')}<");
content = content.replace(/>Stock disponible/g, ">{t('stock')}<");
content = content.replace(/>Annuler</g, ">{t('status_cancelled')}<");
content = content.replace(/>Supprimer</g, ">{t('delete')}<");

fs.writeFileSync(filePath, content);
console.log('Translated Products Page');
