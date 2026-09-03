import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { ChevronRight, Star, Minus, Plus, Heart, Share2, ShieldCheck, Truck, Calendar } from 'lucide-react';
import ProductCard from '../components/ProductCard';


const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { t } = useLanguage();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);

  const isWished = product ? isInWishlist(product._id || product.id) : false;
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('Black');
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
    setActiveImage(0);

    const fetchProduct = async () => {
      setLoading(true);
      try {
        // slug contains the product id (passed from ProductCard)
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/products/${slug}`);
        setProduct(data.data || null);
        
        try {
          const revRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/products/${slug}/reviews`);
          setReviews(revRes.data.data || []);
        } catch (err) {
          console.error("Error fetching reviews", err);
        }
        
        if (data.data && data.data.category) {
          try {
            const relRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/products?category=${encodeURIComponent(data.data.category)}&limit=5`);
            if (relRes.data && relRes.data.data) {
              setRelatedProducts(relRes.data.data.filter(p => p._id !== data.data._id).slice(0, 4));
            }
          } catch (err) {
            console.error("Error fetching related products", err);
          }
        }

        // Increment product views
        try {
          await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/products/${slug}/view`);
        } catch (err) {
          console.error("Error tracking view", err);
        }
      } catch (error) {
        console.error("Error fetching product", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white dark:bg-[#0B1120] transition-colors duration-300">
        <Loader />
      </div>
    );
  }

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

  const creatorId = typeof product.createdBy === 'object' ? product.createdBy?._id : product.createdBy;
  const isOwnProduct = user && creatorId && (user._id === creatorId || user.id === creatorId);

  const getGalleryImages = (prod) => {
    if (prod.images && prod.images.length > 0) {
      return prod.images.map(img => img.url);
    }
    return [prod.image || 'https://via.placeholder.com/800'];
  };

  const gallery = getGalleryImages(product);

  const colors = [
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Black', hex: '#111111' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Brown', hex: '#8B4513' }
  ];

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ ...product, selectedColor }, quantity);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const isOwnProduct = user && product && product.createdBy && (
    user._id === product.createdBy._id || 
    user.id === product.createdBy._id || 
    user._id === product.createdBy || 
    user.id === product.createdBy
  );

  const handleContactSeller = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setChatLoading(true);
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/api/v1/chat/initiate-product-chat', 
        { productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const roomId = res.data.data.roomId;
      const sellerId = res.data.data.seller.id;
      const sellerName = res.data.data.seller.shopName || res.data.data.seller.name;
      navigate(`/profile/messages?room=${roomId}&receiverId=${sellerId}&receiverName=${encodeURIComponent(sellerName)}`);
    } catch (error) {
      console.error("Erreur d'initialisation du chat:", error);
      alert(error.response?.data?.message || "Impossible de contacter le vendeur pour le moment.");
    } finally {
      setChatLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Connectez-vous pour laisser un avis");
      navigate('/login');
      return;
    }
    if (!newReview.comment.trim()) return;

    setReviewLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/products/${slug}/reviews`, newReview, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(prev => [res.data.data, ...prev]);
      setNewReview({ rating: 5, comment: '' });
      
      // Update local product stats
      setProduct(prev => ({
        ...prev,
        rating: ((prev.rating * prev.numReviews) + res.data.data.rating) / (prev.numReviews + 1),
        numReviews: prev.numReviews + 1
      }));
      alert("Avis ajouté avec succès !");
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l'ajout de l'avis");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <Loader />;

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
            {product.name ? t(product.name) : (product.slug && t(`prod_${product.slug.replace(/-/g, '_')}`))}
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
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover rounded-md" onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Indisponible'; }} />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 relative flex items-center justify-center overflow-hidden">
              <img 
                src={gallery[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Indisponible'; }}
              />
            </div>
          </div>

          {/* DROITE : INFOS DU PRODUIT */}
          <div className="flex-1 flex flex-col">
            
            {/* Titre & Sous-titre */}
            <div className="mb-4">
              
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                {product.name ? t(product.name) : (product.slug && t(`prod_${product.slug.replace(/-/g, '_')}`))}
              </h1>
              <p className="text-[15px] text-gray-500 dark:text-gray-400">
                {t('premium_quality')} {t(`cat_${product.category.toLowerCase().replace(' & ', '_').replace(' ', '_')}`)}
              </p>
            </div>
            
            {/* Reviews & Seller Info */}
            <div className="flex items-center flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex gap-1 text-[#FFB800]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < Math.round(product.rating || 0) ? "fill-current" : "text-gray-200 dark:fill-gray-700"} />
                  ))}
                </div>
                <span className="font-bold text-gray-900 dark:text-white">
                  {product.rating ? product.rating.toFixed(1) : "0"}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({product.numReviews || 0} {t('reviews')})
                </span>
              </div>
              <span className="text-sm text-green-500 font-medium bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded">In Stock</span>
              
              {product.createdBy && (
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    Vendu par : 
                    <span className="font-bold text-gray-900 dark:text-white">
                      {product.createdBy.storeName || product.createdBy.name}
                    </span>
                  </span>
                  {!isOwnProduct && (
                    <button 
                      onClick={handleContactSeller}
                      disabled={chatLoading}
                      className="text-xs px-3 py-1.5 bg-[#FF4D20]/10 text-[#FF4D20] font-bold rounded-lg hover:bg-[#FF4D20]/20 transition-colors flex items-center gap-1"
                    >
                      {chatLoading ? <Loader className="w-3 h-3 animate-spin" /> : null}
                      Contacter
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-3xl font-black text-gray-900 dark:text-white">${(product.price || 0).toFixed(2)}</span>
                {(product.comparePrice > 0 || product.originalPrice > 0) && (
                  <>
                    <span className="text-lg text-gray-400 line-through mb-1">${(product.comparePrice || product.originalPrice).toFixed(2)}</span>
                    {product.discount > 0 && (
                      <span className="text-sm font-bold text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-md mb-1">
                        {t('save')} {product.discount}%
                      </span>
                    )}
                  </>
                )}
              </div>
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
                <div className={`flex items-center border border-gray-200 dark:border-gray-700 rounded-md h-10 w-28 bg-white dark:bg-gray-800 ${isOwnProduct ? 'opacity-50' : ''}`}>
                  <button disabled={isOwnProduct} onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:cursor-not-allowed disabled:hover:bg-transparent">
                    <Minus size={16} strokeWidth={2} />
                  </button>
                  <span className="flex-1 text-center text-[14px] font-semibold text-gray-900 dark:text-white border-x border-gray-200 dark:border-gray-700 h-full flex items-center justify-center">{quantity}</span>
                  <button disabled={isOwnProduct} onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:cursor-not-allowed disabled:hover:bg-transparent">
                    <Plus size={16} strokeWidth={2} />
                  </button>
                </div>
                <span className="text-[#00B578] text-[14px] font-medium">{t('in_stock')}</span>
              </div>
            </div>

            {/* BOUTONS D'ACTION */}
            <div className="flex flex-col gap-3 mb-6">
              {isOwnProduct ? (
                <button 
                  disabled
                  className="w-full h-12 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg font-bold text-[15px] cursor-not-allowed border border-gray-200 dark:border-gray-700"
                >
                  C'est votre produit
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleAddToCart}
                    className="w-full h-12 bg-[#FF4D20] text-white rounded-lg font-bold text-[15px] hover:bg-orange-600 transition-colors shadow-sm"
                  >
                    {t('add_to_cart')}
                  </button>
                  
                  <button 
                    onClick={handleBuyNow}
                    className="w-full h-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg font-bold text-[15px] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {t('buy_now')}
                  </button>
                </>
              )}
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
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Indisponible'; }}
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
                <div className="flex flex-col md:flex-row gap-12">
                  
                  {/* Reviews List */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('customer_reviews')} ({product.numReviews || 0})</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{product.rating ? product.rating.toFixed(1) : 0}</span>
                        <span className="text-gray-500 dark:text-gray-400">{t('out_of_5')}</span>
                      </div>
                    </div>
                    
                    {reviews.length > 0 ? (
                      <div className="space-y-6">
                        {reviews.map((rev) => (
                          <div key={rev._id} className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0 last:pb-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold">
                                  {(rev.user?.name || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{rev.user?.name || 'Utilisateur'}</p>
                                  <div className="flex text-[#FF9900]">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} size={12} className={i < rev.rating ? "fill-current" : "text-gray-300 dark:text-gray-700"} />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                {new Date(rev.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-3">
                              {rev.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 italic py-8">Aucun avis pour le moment. Soyez le premier !</div>
                    )}
                  </div>

                  {/* Add Review Form */}
                  <div className="md:w-[350px] shrink-0 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 h-fit">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4">Laisser un avis</h4>
                    <form onSubmit={submitReview} className="flex flex-col gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Note (1-5)</label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setNewReview(prev => ({ ...prev, rating: num }))}
                              className={`p-1 ${num <= newReview.rating ? 'text-[#FF9900]' : 'text-gray-300 dark:text-gray-600'}`}
                            >
                              <Star size={24} className={num <= newReview.rating ? "fill-current" : ""} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Votre commentaire</label>
                        <textarea
                          required
                          value={newReview.comment}
                          onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                          rows="4"
                          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#FF4D20]"
                          placeholder="Qu'avez-vous pensé de ce produit ?"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        disabled={reviewLoading || !newReview.comment.trim()}
                        className="w-full h-11 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {reviewLoading && <Loader className="w-4 h-4 animate-spin" />}
                        Envoyer
                      </button>
                    </form>
                  </div>
                  
                </div>
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
