import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Clock, ChevronRight, ShoppingCart, Star } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const getEndTime = () => {
  const end = new Date();
  end.setHours(end.getHours() + 23, 59, 59, 0);
  return end;
};

const END_TIME = getEndTime();

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = END_TIME - Date.now();
    return Math.max(0, diff);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, END_TIME - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(timeLeft / 3_600_000);
  const minutes = Math.floor((timeLeft % 3_600_000) / 60_000);
  const seconds = Math.floor((timeLeft % 60_000) / 1_000);

  return { hours, minutes, seconds };
}

function TimeUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
        <span className="text-2xl sm:text-3xl font-black text-white tabular-nums leading-none">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-1.5">
        {label}
      </span>
    </div>
  );
}

const flashProducts = products.filter(p => p.badges?.includes('Flash Deal'));

const categories = ['All', ...new Set(flashProducts.map(p => p.category))];

function FlashDeals() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const filtered =
    activeCategory === 'All'
      ? flashProducts
      : flashProducts.filter(p => p.category === activeCategory);

  const { hours, minutes, seconds } = useCountdown();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1120] transition-colors duration-300 pb-20">

      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FF4D20] opacity-10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-500 opacity-5 blur-3xl rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-3">
                {t('flash_deals')}
              </h1>
              <p className="text-gray-400 text-base sm:text-lg max-w-sm">
                {t('flash_deals_desc')}
              </p>
              <div className="flex items-center gap-2 mt-4 justify-center lg:justify-start">
                <span className="w-2 h-2 rounded-full bg-[#FF4D20] animate-pulse" />
                <span className="text-sm text-gray-400 font-medium">
                  {flashProducts.length} {t('deals_active_right_now')}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                <Clock size={16} className="text-[#FF4D20]" />
                {t('deals_end_in')}
              </div>
              <div className="flex items-center gap-3">
                <TimeUnit value={hours} label={t('hours')} />
                <span className="text-3xl font-black text-[#FF4D20] mb-4 leading-none">:</span>
                <TimeUnit value={minutes} label={t('mins')} />
                <span className="text-3xl font-black text-[#FF4D20] mb-4 leading-none">:</span>
                <TimeUnit value={seconds} label={t('secs')} />
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="sticky top-[64px] sm:top-[70px] z-30 bg-white dark:bg-[#0B1120] border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-[#FF4D20] text-white shadow-[0_4px_12px_rgba(255,77,32,0.3)]'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#FF4D20] rounded-full" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {activeCategory === 'All' ? t('all_flash_deals') : activeCategory}
              <span className="ml-2 text-sm font-normal text-gray-400 dark:text-gray-500">
                ({filtered.length} {t('items')})
              </span>
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[#FF4D20] hover:underline"
          >
            {t('view_all_products')} <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {filtered.map(product => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="group flex flex-col bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-gray-900 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="relative aspect-square bg-white dark:bg-gray-800 overflow-hidden">
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-[#FF4D20] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow z-10">
                  <Zap size={10} fill="white" />
                  {t('flash')}
                </div>
                <div className="absolute top-2 right-2 bg-gray-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md z-10">
                  -{product.discount}%
                </div>
                <img
                  src={product.image}
                  alt={t(`prod_${product.slug.replace(/-/g, '_')}`)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = 'https://picsum.photos/seed/fallback/400/400'; }}
                />
              </div>
              <div className="flex flex-col gap-1.5 p-4 flex-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate leading-tight">
                  {t(`prod_${product.slug.replace(/-/g, '_')}`)}
                </h3>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < Math.round(product.rating) ? 'fill-[#FFB800] text-[#FFB800]' : 'fill-gray-200 dark:fill-gray-600 text-gray-200 dark:text-gray-600'}
                    />
                  ))}
                  <span className="text-[10px] text-gray-400 ml-0.5">({product.reviews})</span>
                </div>

                <div className="flex items-center gap-2 mt-auto">
                  <span className="text-[18px] font-black text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-[13px] text-gray-400 dark:text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                  )}
                </div>

                <p className="text-[11px] font-semibold text-[#FF4D20] mb-2">
                  {t('save')} ${(product.originalPrice - product.price).toFixed(2)}
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product);
                  }}
                  className="mt-1 w-full flex items-center justify-center gap-1.5 bg-gray-900 dark:bg-[#FF4D20] text-white text-xs font-bold py-2.5 rounded-xl hover:bg-black dark:hover:bg-orange-600 transition-colors shadow-sm"
                >
                  <ShoppingCart size={13} />
                  {t('add_to_cart')}
                </button>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}

export default FlashDeals;
