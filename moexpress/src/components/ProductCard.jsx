import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Store } from 'lucide-react';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { t } = useLanguage();
    const { user } = useAuth();
    const isWished = isInWishlist(product._id || product.id);

    // Vérifier si le produit appartient au vendeur connecté
    const creatorId = typeof product.createdBy === 'object' ? product.createdBy?._id : product.createdBy;
    const isOwnProduct = user && creatorId && (user._id === creatorId || user.id === creatorId);
    const storeName = product.createdBy?.storeName || product.createdBy?.name;

    // Global Flash Deal logic
    const promoEndDate = new Date("2026-08-21T23:59:59");
    const isPromoActive = new Date() < promoEndDate;

    // Calcul du % de remise — uniquement si le prix barré est SUPÉRIEUR au prix actuel et que la promo est active
    const comparePrice = product.comparePrice || product.originalPrice || 0;
    const hasPromo = isPromoActive && comparePrice > product.price;
    const discountPercent = hasPromo
        ? Math.round(((comparePrice - product.price) / comparePrice) * 100)
        : 0;

    // Le vrai prix à afficher et utiliser
    const displayPrice = hasPromo ? product.price : (comparePrice > 0 ? comparePrice : product.price);


    return (
        <Link to={`/product/${product._id || product.slug}`} className="group bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-gray-900 hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-full">
            <div className="aspect-square relative overflow-hidden bg-white dark:bg-gray-800">
                <img
                    src={product.images?.[0]?.url || product.image || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {discountPercent > 0 && (
                    <span className="absolute top-2 left-2 bg-[#FF4D20] text-white text-[11px] font-bold px-2 py-0.5 rounded-md z-10">
                        -{discountPercent}%
                    </span>
                )}
                
                {!isOwnProduct && (
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            toggleWishlist(product);
                        }}
                        className="absolute top-2 right-2 bg-white/80 backdrop-blur dark:bg-gray-700/80 w-8 h-8 rounded-full flex items-center justify-center z-10 shadow-sm hover:scale-110 transition-transform"
                    >
                        <Heart size={16} className={isWished ? "fill-[#FF4D20] text-[#FF4D20]" : "text-gray-600 dark:text-gray-300"} />
                    </button>
                )}
            </div>

            <div className="p-4 flex flex-col flex-1">
        {/* Product Title */}
        <h3 className="font-bold text-gray-900 dark:text-white text-[15px] mb-1 leading-tight line-clamp-2 min-h-[38px] group-hover:text-[#FF4D20] transition-colors">
          {product.name ? t(product.name) : (product.slug && t(`prod_${product.slug.replace(/-/g, '_')}`))}
        </h3>

        {storeName && (
            <div className="flex items-center gap-1.5 mt-1 mb-1">
                <Store size={12} className="text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{storeName}</span>
            </div>
        )}

                <div className="flex items-center gap-1 mb-3 mt-auto">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12}
                        className={i < Math.round(product.rating || 0) ? "fill-[#FFB800] text-[#FFB800]" : "fill-gray-200 dark:fill-gray-600 text-gray-200 dark:fill-gray-600"}
                        />
                    ))}
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 ml-1">({product.numReviews || 0})</span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                    <span className="text-[18px] font-black text-gray-900 dark:text-white">${displayPrice.toFixed(2)}</span>
                    {hasPromo && (
                        <span className="text-[13px] text-gray-400 dark:text-gray-500 line-through">${comparePrice.toFixed(2)}</span>
                    )}
                </div>

                {isOwnProduct ? (
                    <button 
                        disabled
                        className="w-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[13px] py-2.5 rounded-xl font-bold mt-auto cursor-not-allowed border border-gray-200 dark:border-gray-700"
                    >
                        Votre produit
                    </button>
                ) : (
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                        }}
                        className="w-full bg-gray-900 dark:bg-[#FF4D20] text-white text-[13px] py-2.5 rounded-xl hover:bg-black dark:hover:bg-orange-600 transition-colors font-bold mt-auto"
                    >
                        {t('add_to_cart')}
                    </button>
                )}
            </div>
        </Link>
    );
};

export default ProductCard;