import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import HeroBanner from "../components/HeroBanner";
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';
import Loader from '../components/Loader';
import ProductSkeleton from '../components/ProductSkeleton';
import {
  Laptop, ShirtIcon, Home as HomeIcon, Dumbbell, Sparkles, Car,
  Gamepad2, Baby, Watch, Smartphone, Monitor, ShoppingBag, ChevronRight,
  Truck, RefreshCw, ShieldCheck, Headphones, Menu, X
} from 'lucide-react';
const bannerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const sidebarCategories = [
  { id: 1,  name: "Electronics",      slug: "electronics", icon: Laptop },
  { id: 2,  name: "Fashion",          slug: "fashion",     icon: ShirtIcon },
  { id: 3,  name: "Home & Garden",    slug: "home",        icon: HomeIcon },
  { id: 4,  name: "Beauty & Health",  slug: "beauty",      icon: Sparkles },
  { id: 5,  name: "Sports & Outdoors",slug: "sports",      icon: Dumbbell },
  { id: 6,  name: "Toys & Kids",      slug: "toys",        icon: Baby },
  { id: 7,  name: "Automotive",       slug: "automotive",  icon: Car },
  { id: 8,  name: "Phones & Accessories", slug: "phones",  icon: Smartphone },
  { id: 9,  name: "Computer & Office",slug: "computers",   icon: Monitor },
  { id: 10, name: "All Products",     slug: "products",    icon: ShoppingBag },
];

const trustBadges = [
  { icon: Truck,       titleKey: "free_shipping",   subKey: "from_50",         color: "#FF4D20" },
  { icon: RefreshCw,   titleKey: "money_back",      subKey: "days_returns",   color: "#2563EB" },
  { icon: ShieldCheck, titleKey: "secure_payment_title",  subKey: "secure_100",      color: "#16A34A" },
  { icon: Headphones,  titleKey: "support_247_title",    subKey: "dedicated_support", color: "#9333EA" },
];

function Home() {
  const [timer, setTimer] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [homepageAd, setHomepageAd] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Fetch Homepage Ads
    const fetchAd = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + '/api/v1/ads/homepage', {
          headers: {
            Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : undefined
          }
        });
        if (res.data?.data?.ads?.length > 0) {
          setHomepageAd(res.data.data.ads[0]);
        }
      } catch (err) {
        console.error("Erreur chargement pub :", err);
      }
    };
    fetchAd();

    const interval = setInterval(() => {
      const currentDate = new Date();
      const endDate = new Date("2026-08-21T23:59:59");
      const diff = endDate - currentDate;
      
      if (diff <= 0) {
        setTimer(null); // Timer is over
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimer(`${days}j ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(import.meta.env.VITE_API_URL + '/api/v1/products?limit=24');
        setProducts(data.data || []);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Slices
  const isPromoActive = new Date() < new Date("2026-08-21T23:59:59");
  const flashDeals = isPromoActive ? products.slice(0, 6) : [];
  // If promo is active and we have many products, skip first 6 for top products, else show all
  const topProducts = (isPromoActive && products.length > 6) ? products.slice(6) : products;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0B1120] pt-0 pb-20 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        
        <div className="hidden lg:flex gap-3 mb-6">
          <div
            className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 py-2 overflow-hidden flex flex-col transition-all duration-300 flex-shrink-0"
            style={{ width: sidebarOpen ? '220px' : '52px' }}
          >
            <div className={`flex items-center border-b border-gray-100 dark:border-gray-700 mb-1 ${sidebarOpen ? 'justify-between px-4' : 'justify-center px-2'} py-2`}>
              {sidebarOpen && (
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('all_categories')}</span>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
                aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                {sidebarOpen ? <X size={15} /> : <Menu size={15} />}
              </button>
            </div>

            <ul className="flex-1">
              {sidebarCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <li key={cat.id}>
                    <Link
                      to={cat.id === 10 ? "/products" : `/category/${cat.slug}`}
                      title={!sidebarOpen ? cat.name : undefined}
                      className={`flex items-center py-2.5 text-[12px] font-bold text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-[#FF4D20] dark:hover:text-[#FF4D20] transition-colors group ${
                        sidebarOpen ? 'gap-3 px-4' : 'justify-center px-2'
                      }`}
                    >
                      <Icon size={16} strokeWidth={1.8} className="text-gray-400 group-hover:text-[#FF4D20] flex-shrink-0" />
                      {sidebarOpen && (
                        <>
                          <span className="truncate">{t(`cat_${cat.slug}`)}</span>
                          {cat.id === 10 && <ChevronRight size={12} className="ml-auto text-gray-300" />}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div className="flex gap-3 h-[340px]">
              <div className="flex-1 rounded-xl overflow-hidden min-w-0 relative">
                <HeroBanner />
              </div>

              <div className="w-[200px] flex-shrink-0 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden h-full">
                <div className="px-4 pt-5 pb-3 bg-gradient-to-b from-orange-50 dark:from-gray-700/50 to-white dark:to-transparent">
                  <p className="text-[#FF4D20] font-bold text-[13px] leading-tight mb-1">{t('welcome_moexpress')}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-[10px]">{t('one_stop_marketplace')}</p>
                </div>
                
                <div className="flex flex-col gap-4 flex-1 px-4 py-3">
                  {[
                    { icon: ShieldCheck, labelKey: "secure_payments" },
                    { icon: ShieldCheck, labelKey: "buyer_protection" },
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="p-1.5 bg-orange-50 dark:bg-gray-700 rounded-lg text-[#FF4D20]">
                        <feature.icon size={16} />
                      </div>
                      <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300 leading-tight">
                        {t(feature.labelKey)}
                      </span>
                    </div>
                  ))}
                </div>                <div className="px-4 pb-5 mt-auto">
                  <Link
                    to="/about"
                    className="text-[11px] font-bold text-[#FF4D20] hover:underline flex items-center gap-0.5"
                  >
                    {t('learn_more')} <ChevronRight size={12} strokeWidth={2} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between px-8 py-4">
              {trustBadges.map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <Icon size={24} className="text-[#FF4D20] flex-shrink-0" strokeWidth={1.5} />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-gray-800 dark:text-gray-200 leading-tight">{t(badge.titleKey)}</span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{t(badge.subKey)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:hidden mb-6 flex flex-col gap-4">
          <HeroBanner />
          <div className="grid grid-cols-2 gap-3">
            {trustBadges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <div key={i} className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3 px-4 py-3 shadow-sm">
                  <Icon size={20} className="text-[#FF4D20]" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-tight">{t(badge.titleKey)}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{t(badge.subKey)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ouedkniss Style Full-Width Banner Ad */}
        {homepageAd && (
          <div className="my-8 w-full rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800 relative group">
            {(() => {
              const url = homepageAd.targetUrl || "";
              const isInternal = url.startsWith("/") || url.includes("localhost") || url.includes(window.location.hostname);
              const internalPath = isInternal ? url.replace(/^.*\/\/[^\/]+/, '') : url; // extract path if it's a full URL
              
              const Wrapper = isInternal ? Link : 'a';
              const props = isInternal 
                ? { to: internalPath } 
                : { href: url, target: "_blank", rel: "noopener noreferrer" };

              return (
                <Wrapper {...props} className="block relative w-full h-[120px] md:h-[160px] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <img src={homepageAd.mediaUrl} alt={homepageAd.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>
                  
                  <div className="absolute top-3 left-3 bg-[#FF4D20] text-white text-[10px] md:text-[12px] font-black uppercase tracking-wider px-3 py-1 rounded shadow-md">
                    Sponsorisé
                  </div>
                  
                  <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 flex justify-between items-end">
                    <div>
                      <p className="text-white font-black text-[16px] md:text-[24px] leading-tight mb-1 line-clamp-1 shadow-sm">
                        {homepageAd.title}
                      </p>
                      <p className="text-[#FF4D20] text-[12px] md:text-[14px] font-bold flex items-center gap-2">
                        <span>Boutique : {homepageAd.advertiser?.name}</span>
                      </p>
                    </div>
                    <div className="hidden md:flex bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors items-center gap-2">
                      Visiter l'offre <ChevronRight size={16} />
                    </div>
                  </div>
                </Wrapper>
              );
            })()}
          </div>
        )}

        {/* Flash Deals Section - Only shown if timer is active */}
        {timer && (
          <div className="mb-6 flex items-center justify-between border-b border-gray-200/60 dark:border-gray-700 pb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-[20px] font-bold text-gray-900 dark:text-white font-display flex items-center gap-2">
                {t('flash_deals')} <span className="text-yellow-400">⚡</span>
              </h2>
              <div className="hidden sm:flex items-center text-sm">
                <span className="text-gray-400 dark:text-gray-500 mr-1.5">{t('ends_in')}</span>
                <span className="text-[#FF4D20] font-mono font-medium tracking-wide">{timer}</span>
              </div>
            </div>
            <a href="/flash-deals" className="text-sm font-medium text-[#FF4D20] hover:underline">
              {t('view_all')}
            </a>
          </div>
        )}

        {timer && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {loading ? (
              [...Array(6)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            ) : (
              flashDeals.map((product) => (
                <ProductCard key={`flash-${product._id || product.id}`} product={product} />
              ))
            )}
          </div>
        )}


        {/* JUST FOR YOU SECTION (Global E-commerce Standard) */}
        <div className="mt-12 mb-8">
          <div className="mb-6 flex items-center justify-between border-b border-gray-200/60 dark:border-gray-700 pb-4">
            <h2 className="text-[20px] font-bold text-gray-900 dark:text-white font-display">{t('just_for_you')}</h2>
            <a href="/products" className="text-sm font-medium text-[#FF4D20] hover:underline">
              {t('view_all')}
            </a>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {[...Array(6)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {topProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="flex justify-center mt-10">
            <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold px-10 py-3 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
              {t('load_more')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
