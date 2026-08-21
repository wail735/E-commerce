import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { ChevronRight, Star, Minus, Plus, Heart, Share2, ShieldCheck, Truck, Calendar } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { t } = useLanguage();
  
  const product = products.find(p => p.slug === slug);
  const isWished = product ? isInWishlist(product.id) : false;
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('Black');
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
    setActiveImage(0);
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white dark:bg-[#0B1120] text-gray-900 dark:text-white transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <button onClick={() => navigate(-1)} className="text-[#FF4D20] hover:underline">
          Go back
        </button>
      </div>
    );
  }

  // Gallery images per product slug
  const galleryMap = {
    'mechanical-keyboard': [
      prod => prod.image,
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop&q=80",
    ],
    'wireless-earbuds': [
      prod => prod.image,
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop&q=80",
    ],
    'smart-watch': [
      prod => prod.image,
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80",
    ],
    'laptop-pro': [
      prod => prod.image,
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop&q=80",
    ],
    'usb-c-hub': [
      prod => prod.image,
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1536825211030-094de935f680?w=400&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop&q=80",
    ],
    'gaming-mouse': [
      prod => prod.image,
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1563297007-0686b7003af7?w=400&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=400&fit=crop&q=80",
    ],
  };

  const getGalleryImages = (prod) => {
    const entry = galleryMap[prod.slug];
    if (entry) {
      return entry.map(item => (typeof item === 'function' ? item(prod) : item));
    }
    // Default: repeat the main image to fill the 4 thumbnail slots
    return Array(4).fill(prod.image);
  };

  const gallery = getGalleryImages(product);

  const colors = [
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Black', hex: '#111111' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Brown', hex: '#8B4513' }
  ];

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1120] transition-colors duration-300 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl pt-6">
        
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-1.5 text-[13px] text-gray-500 dark:text-gray-400 mb-6">
          <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">{t('home')}</Link>
          <ChevronRight size={13} />
          <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-gray-900 dark:hover:text-white transition-colors">
            {t(`cat_${product.category.toLowerCase().replace(' & ', '_').replace(' ', '_')}`)}
          </Link>
          <ChevronRight size={13} />
          <span className="text-gray-900 dark:text-white font-semibold truncate max-w-[200px] sm:max-w-md">
            {t(`prod_${product.slug.replace(/-/g, '_')}`)}
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 mb-16">
          
          {/* GAUCHE : GALERIE D'IMAGES (Vignettes à gauche, Grande image à droite) */}
          <div className="w-full lg:w-1/2 flex gap-4 shrink-0 h-[400px] sm:h-[500px]">
            
            {/* Thumbnails (Vertical) */}
            <div className="w-20 shrink-0 flex flex-col gap-3 overflow-y-auto no-scrollbar py-1">
              {gallery.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-full aspect-square bg-white dark:bg-gray-800 rounded-lg p-1.5 border-2 transition-all shrink-0 ${
                    activeImage === idx ? "border-[#FF4D20]" : "border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover rounded-md" onError={(e) => { e.target.src = product.image; }} />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 relative flex items-center justify-center overflow-hidden">
              <img 
                src={gallery[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.src = product.image; }}
              />
            </div>
          </div>

          {/* DROITE : INFOS DU PRODUIT */}
          <div className="flex-1 flex flex-col">
            
            {/* Titre & Sous-titre */}
            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {t(`prod_${product.slug.replace(/-/g, '_')}`)}
              </h1>
              <p className="text-[15px] text-gray-500 dark:text-gray-400">
                {t('premium_quality')} {t(`cat_${product.category.toLowerCase().replace(' & ', '_').replace(' ', '_')}`)}
              </p>
            </div>
              
            {/* Étoiles & Ventes */}
            <div className="flex items-center gap-3 text-sm mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className={i < Math.round(product.rating) ? "fill-[#FF9900] text-[#FF9900]" : "fill-gray-200 text-gray-200"} />
                ))}
              </div>
              <span className="text-gray-500 dark:text-gray-400">({product.reviews} {t('reviews')})</span>
              <div className="w-[1px] h-3 bg-gray-300 dark:bg-gray-600"></div>
              <span className="text-gray-500 dark:text-gray-400">128 {t('sold')}</span>
            </div>
            
            {/* Prix */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 dark:text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
              {product.discount > 0 && (
                <span className="bg-red-50 text-red-500 text-[13px] font-bold px-2 py-0.5 rounded-md">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* SELECTION COULEUR */}
            <div className="mb-6">
              <span className="block text-[14px] font-bold text-gray-900 dark:text-white mb-3">{t('color')}: <span className="font-normal text-gray-600 dark:text-gray-400">{selectedColor}</span></span>
              <div className="flex items-center gap-3">
                {colors.map((color) => (
                  <button 
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      selectedColor === color.name ? 'ring-1 ring-offset-2 ring-[#FF4D20]' : 'ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-gray-300'
                    }`}
                  >
                    <span 
                      className="w-7 h-7 rounded-full border border-gray-100/50"
                      style={{ backgroundColor: color.hex }}
                    ></span>
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITE & STOCK */}
            <div className="mb-8">
              <span className="block text-[14px] font-bold text-gray-900 dark:text-white mb-3">{t('quantity')}:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md h-10 w-28 bg-white dark:bg-gray-800">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Minus size={16} strokeWidth={2} />
                  </button>
                  <span className="flex-1 text-center text-[14px] font-semibold text-gray-900 dark:text-white border-x border-gray-200 dark:border-gray-700 h-full flex items-center justify-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Plus size={16} strokeWidth={2} />
                  </button>
                </div>
                <span className="text-[#00B578] text-[14px] font-medium">{t('in_stock')}</span>
              </div>
            </div>

            {/* BOUTONS D'ACTION */}
            <div className="flex flex-col gap-3 mb-6">
              <button 
                onClick={handleAddToCart}
                className="w-full h-12 bg-[#FF4D20] text-white rounded-lg font-bold text-[15px] hover:bg-orange-600 transition-colors shadow-sm"
              >
                {t('add_to_cart')}
              </button>
              
              <button className="w-full h-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg font-bold text-[15px] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                {t('buy_now')}
              </button>
            </div>
            
            {/* WISHLIST & SHARE */}
            <div className="flex items-center gap-6 mb-8 border-b border-gray-100 dark:border-gray-800 pb-8">
              <button 
                onClick={() => toggleWishlist(product)}
                className={`flex items-center gap-2 text-[14px] font-medium transition-colors ${
                  isWished ? "text-[#FF4D20]" : "text-gray-600 dark:text-gray-400 hover:text-[#FF4D20]"
                }`}
              >
                <Heart size={18} className={isWished ? "fill-[#FF4D20]" : ""} />
                {isWished ? t('saved_to_wishlist') : t('add_to_wishlist')}
              </button>
              <button className="flex items-center gap-2 text-[14px] font-medium text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                <Share2 size={18} />
                {t('share')}
              </button>
            </div>

            {/* FEATURES (Delivery, Return, Guarantee) */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Calendar size={22} className="text-gray-500 shrink-0" />
                <p className="text-[14px] text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-900 dark:text-white">{t('estimated_delivery')}</span> {t('business_days_5_10')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Truck size={22} className="text-gray-500 shrink-0" />
                <p className="text-[14px] text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-900 dark:text-white">{t('free_shipping_label')}</span> {t('on_orders_over_10')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <ShieldCheck size={22} className="text-gray-500 shrink-0" />
                <p className="text-[14px] text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-900 dark:text-white">{t('buyer_protection_label')}</span> {t('money_back_guarantee_45')}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* TABBED PRODUCT DESCRIPTION SECTION (AliExpress Style) */}
        <div className="mt-16 mb-16 bg-white dark:bg-[#0B1120] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          {/* Tabs Header */}
          <div className="flex border-b border-gray-100 dark:border-gray-800 overflow-x-auto no-scrollbar">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 text-[15px] font-bold whitespace-nowrap transition-colors relative ${
                  activeTab === tab ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50/50 dark:bg-gray-900/50'
                }`}
              >
                {t(`tab_${tab}`)}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF4D20]"></span>
                )}
              </button>
            ))}
          </div>
          
          {/* Tabs Content */}
          <div className="p-8 sm:p-10 min-h-[300px]">
            
            {activeTab === 'description' && (
              <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-[15px]">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('product_overview')}</h3>
                <p>
                  {t('prod_desc_default')}
                </p>
                <div className="grid sm:grid-cols-2 gap-8 mt-8">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">{t('key_features')}</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      <li>{t('feature_1')}</li>
                      <li>{t('feature_2')}</li>
                      <li>{t('feature_3')}</li>
                      <li>{t('feature_4')}</li>
                      <li>{t('feature_5')}</li>
                    </ul>
                  </div>
                  <div>
                    <img 
                      src={gallery[1] || product.image} 
                      alt="Feature" 
                      className="w-full h-48 object-cover rounded-xl"
                      onError={(e) => { e.target.src = product.image; }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('tech_specs')}</h3>
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">{t('spec_brand')}</div>
                    <div className="p-4 col-span-2 text-gray-600 dark:text-gray-400">MoExpress Premium</div>
                  </div>
                  <div className="grid grid-cols-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">{t('spec_category')}</div>
                    <div className="p-4 col-span-2 text-gray-600 dark:text-gray-400">{t(`cat_${product.category.toLowerCase().replace(' & ', '_').replace(' ', '_')}`)}</div>
                  </div>
                  <div className="grid grid-cols-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">{t('spec_colors')}</div>
                    <div className="p-4 col-span-2 text-gray-600 dark:text-gray-400">Black, White, Gray, Brown</div>
                  </div>
                  <div className="grid grid-cols-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">{t('spec_origin')}</div>
                    <div className="p-4 col-span-2 text-gray-600 dark:text-gray-400">Imported</div>
                  </div>
                  <div className="grid grid-cols-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">{t('spec_weight')}</div>
                    <div className="p-4 col-span-2 text-gray-600 dark:text-gray-400">0.5 kg - 1.2 kg</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('customer_reviews')} ({product.reviews})</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{product.rating}</span>
                    <span className="text-gray-500 dark:text-gray-400">{t('out_of_5')}</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {[1, 2, 3].map((_, idx) => (
                    <div key={idx} className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold">
                            U{idx + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">{t('verified_user')} {idx + 1}</p>
                            <div className="flex text-[#FF9900]">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} className={i < Math.floor(product.rating) ? "fill-current" : "text-gray-300 dark:text-gray-700"} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500">2 days ago</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-3">
                        Excellent product! The quality is exactly as described and it arrived earlier than expected. 
                        Highly recommend this seller. Will definitely buy again!
                      </p>
                    </div>
                  ))}
                </div>
                <button className="mt-8 w-full py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  {t('view_all_reviews')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="pt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-display">{t('you_may_also_like')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
