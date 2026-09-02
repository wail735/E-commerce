import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Clock, ChevronRight, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';

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

function FlashDeals() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(import.meta.env.VITE_API_URL + '/api/v1/products');
        // Les offres éclair sont celles qui ont un prix de comparaison supérieur au prix
        const flashDeals = (data.data || []).filter(p => p.comparePrice > p.price);
        setProducts(flashDeals);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filtered =
    activeCategory === 'All'
      ? products
      : products.filter(p => p.category === activeCategory);

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
                  {products.length} {t('deals_active_right_now')}
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#FF4D20]">{t('home')}</Link>
          <ChevronRight size={16} />
          <span className="text-gray-900 dark:text-gray-300 font-medium">{t('flash_deals')}</span>
        </nav>

        {loading ? (
          <div className="flex justify-center items-center h-64"><Loader /></div>
        ) : (
          <>
            <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-8 pb-2">
              {categories.map((cat, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all
                    ${activeCategory === cat
                      ? 'bg-[#FF4D20] text-white shadow-lg shadow-orange-500/25'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {cat === 'All' ? t('all') : t(cat)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
              {filtered.map(product => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FlashDeals;
