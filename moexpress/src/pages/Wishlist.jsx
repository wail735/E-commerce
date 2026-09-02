import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ChevronRight, AlertCircle } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlistItems } = useWishlist();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] transition-colors duration-300 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#FF4D20] transition-colors">{t('home')}</Link>
          <ChevronRight size={16} />
          <span className="text-gray-900 dark:text-white font-medium">{t('my_wishlist')}</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
            {t('my_wishlist')}
            <span className="bg-[#FF4D20] text-white text-sm font-bold px-3 py-1 rounded-full">
              {wishlistItems.length}
            </span>
          </h1>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 flex flex-col items-center justify-center text-center min-h-[400px] transition-colors">
            <div className="w-24 h-24 bg-orange-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
              <Heart size={40} className="text-[#FF4D20]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Your wishlist is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
              Looks like you haven't added anything to your wishlist yet. 
              Explore our products and save your favorites for later!
            </p>
            <Link 
              to="/products"
              className="bg-[#FF4D20] text-white font-bold py-3.5 px-8 rounded-xl hover:bg-orange-600 transition-all shadow-md flex items-center gap-2"
            >
              <ShoppingBag size={20} />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
              {wishlistItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Wishlist;
