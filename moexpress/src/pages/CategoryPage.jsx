import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { products } from '../data/products';
import { ChevronRight, Star, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const categoryMeta = {
  electronics:  { label: "Electronics",          desc: "Discover our wide range of electronics products" },
  fashion:      { label: "Fashion",              desc: "Trending fashion for men & women" },
  home:         { label: "Home & Garden",         desc: "Beautiful products for your home" },
  beauty:       { label: "Beauty & Health",       desc: "Best beauty and skincare products" },
  sports:       { label: "Sports & Outdoors",     desc: "Everything for your active lifestyle" },
  toys:         { label: "Toys & Kids",           desc: "Fun toys for all ages" },
  automotive:   { label: "Automotive",            desc: "Car accessories and more" },
  phones:       { label: "Phones & Accessories",  desc: "Latest smartphones and accessories" },
  computers:    { label: "Computer & Office",     desc: "Computers, laptops and office supplies" },
  categories:   { label: "All Categories",        desc: "Browse all our categories" },
};

const subCategories = {
  electronics: ["All Electronics", "Phones & Accessories", "Computer & Office", "Consumer Electronics", "TV & Home Appliances", "Cameras & Photo"],
  fashion:     ["All Fashion", "Men's Clothing", "Women's Clothing", "Shoes", "Bags & Accessories"],
  home:        ["All Home", "Furniture", "Kitchen", "Bedding", "Garden"],
  beauty:      ["All Beauty", "Skincare", "Makeup", "Hair Care", "Fragrances"],
  sports:      ["All Sports", "Fitness", "Outdoor", "Team Sports", "Water Sports"],
};

const brandsByCategory = {
  electronics: ["Samsung", "Apple", "Xiaomi", "Sony", "HP", "Dell"],
  fashion:     ["Nike", "Adidas", "Zara", "H&M", "Levi's", "Ray-Ban"],
  beauty:      ["L'Oreal", "Maybelline", "NYX", "Chanel", "Dior"],
  sports:      ["Nike", "Adidas", "Puma", "Under Armour"],
  home:        ["IKEA", "Philips", "Bosch", "Tefal"],
  toys:        ["Lego", "Hasbro", "Mattel", "Fisher-Price"],
};

const sortOptions = ["Popular", "Price: Low to High", "Price: High to Low", "Newest", "Top Rated"];
const showOptions = [10, 20, 30, 50];

const CategoryPage = () => {
  const { slug } = useParams();
  const { t } = useLanguage();
  const meta = categoryMeta[slug] || { label: slug, desc: "" };

  const [sortBy, setSortBy]       = useState("Popular");
  const [showCount, setShowCount] = useState(10);
  const [maxPrice, setMaxPrice]   = useState(1000);
  const [minPrice, setMinPrice]   = useState(1);
  const [minRating, setMinRating] = useState(0);
  const [activeSub, setActiveSub] = useState(subCategories[slug]?.[0] || "All");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showAllBrands, setShowAllBrands]   = useState(false);

  const subs   = subCategories[slug]   || [];
  const brands = brandsByCategory[slug] || [];
  const visibleBrands = showAllBrands ? brands : brands.slice(0, 5);

  useEffect(() => {
    setActiveSub(subs[0] || "All");
    setSelectedBrands([]);
    setMinPrice(1);
    setMaxPrice(1000);
    setMinRating(0);
  }, [slug, subs]);

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const resetFilters = () => {
    setActiveSub(subs[0] || "All");
    setSelectedBrands([]);
    setMinPrice(1);
    setMaxPrice(1000);
    setMinRating(0);
    setSortBy("Popular");
  };

  const allProducts = products.filter(p =>
    p.category.toLowerCase() === meta.label.toLowerCase() ||
    meta.label === "All Categories"
  );

  const filtered = allProducts
    .filter(p => p.price >= minPrice && p.price <= maxPrice)
    .filter(p => p.rating >= minRating)
    .filter(p => {
      if (selectedBrands.length === 0) return true;
      return selectedBrands.includes(p.brand);
    })
    .filter(p => {
      if (activeSub === "All" || activeSub === "All Fashion" || activeSub === "All Electronics" || activeSub === "All Home" || activeSub === "All Beauty" || activeSub === "All Sports") return true;
      return p.subCategory === activeSub;
    })
    .sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      if (sortBy === "Top Rated")          return b.rating - a.rating;
      return b.reviews - a.reviews;
    })
    .slice(0, showCount);

  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-[#0B1120] transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">

        {/* BREADCRUMB */}
        <nav className="flex items-center gap-1.5 text-[13px] text-gray-400 mb-5">
          <Link to="/" className="hover:text-[#FF4D20] transition-colors">{t('home')}</Link>
          <ChevronRight size={13} />
          <span className="text-gray-700 dark:text-gray-300 font-medium">{meta.label}</span>
        </nav>

        <div className="flex gap-6">

          {/* ===== LEFT SIDEBAR ===== */}
          <aside className="hidden lg:flex flex-col gap-5 w-[190px] shrink-0">

            {/* Sub-categories */}
            {subs.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
                <h3 className="text-[13px] font-bold text-gray-800 dark:text-gray-200 mb-3">{t('categories') || 'Categories'}</h3>
                <ul className="space-y-1">
                  {subs.map(sub => (
                    <li key={sub}>
                      <button
                        onClick={() => setActiveSub(sub)}
                        className={`w-full text-left text-[12px] px-2 py-1.5 rounded-lg transition-colors ${
                          activeSub === sub
                            ? "text-[#FF4D20] font-bold bg-orange-50 dark:bg-orange-500/10"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        {sub}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Brand filter */}
            {brands.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
                <h3 className="text-[13px] font-bold text-gray-800 dark:text-gray-200 mb-3">{t('brand')}</h3>
                <ul className="space-y-2">
                  {visibleBrands.map(brand => (
                    <li key={brand}>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="accent-[#FF4D20] w-3.5 h-3.5 rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="text-[12px] text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                          {brand}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
                {brands.length > 5 && (
                  <button
                    onClick={() => setShowAllBrands(p => !p)}
                    className="text-[11px] text-[#FF4D20] font-medium mt-2 flex items-center gap-1 hover:underline"
                  >
                    {showAllBrands ? t('view_less') : t('view_more')}
                    <ChevronDown size={11} className={showAllBrands ? "rotate-180 transition-transform" : "transition-transform"} />
                  </button>
                )}
              </div>
            )}

            {/* Price Range */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
              <h3 className="text-[13px] font-bold text-gray-800 dark:text-gray-200 mb-3">{t('price_range')}</h3>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 flex-1">
                  <span className="text-[11px] text-gray-400 mr-1">$</span>
                  <input
                    type="number"
                    value={minPrice}
                    min={0}
                    max={maxPrice - 1}
                    onChange={e => setMinPrice(Number(e.target.value))}
                    className="w-full text-[12px] font-medium text-gray-700 dark:text-gray-300 outline-none bg-transparent"
                  />
                </div>
                <span className="text-gray-300 dark:text-gray-600 text-xs">—</span>
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 flex-1">
                  <span className="text-[11px] text-gray-400 mr-1">$</span>
                  <input
                    type="number"
                    value={maxPrice}
                    min={minPrice + 1}
                    max={2000}
                    onChange={e => setMaxPrice(Number(e.target.value))}
                    className="w-full text-[12px] font-medium text-gray-700 dark:text-gray-300 outline-none bg-transparent"
                  />
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={2000}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#FF4D20]"
              />
            </div>

            {/* Rating */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
              <h3 className="text-[13px] font-bold text-gray-800 dark:text-gray-200 mb-3">{t('rating')}</h3>
              <ul className="space-y-2">
                {[4, 3, 2].map(r => (
                  <li key={r}>
                    <button
                      onClick={() => setMinRating(prev => prev === r ? 0 : r)}
                      className="flex items-center gap-1.5 w-full group"
                    >
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13}
                          className={i < r ? "fill-amber-400 text-amber-400" : "fill-gray-200 dark:fill-gray-700 text-gray-200 dark:text-gray-700"}
                        />
                      ))}
                      <span className={`text-[11px] ml-1 ${minRating === r ? "text-[#FF4D20] font-bold" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`}>
                        {t('and_up')}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setMinRating(0)}
                className="mt-3 w-full text-[12px] font-bold bg-[#FF4D20] text-white py-1.5 rounded-lg hover:bg-orange-600 transition-colors"
              >
                {t('apply')}
              </button>
            </div>

          </aside>

          {/* ===== MAIN CONTENT ===== */}
          <div className="flex-1 min-w-0">

            {/* Title */}
            <div className="mb-4">
              <h1 className="text-[22px] font-bold text-gray-900 dark:text-white font-display">{meta.label}</h1>
              <p className="text-[13px] text-gray-400 mt-0.5">{meta.desc}</p>
            </div>

            {/* Sort bar */}
            <div className="flex items-center justify-between mb-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 px-4 py-2.5 shadow-sm">
              <div className="flex items-center gap-4">
                <span className="text-[13px] text-gray-500 dark:text-gray-400">
                  {t('showing')} <strong className="text-gray-800 dark:text-gray-200">{filtered.length}</strong> {t('of')} {allProducts.length} {t('products')}
                </span>
                <button
                  onClick={resetFilters}
                  className="text-[12px] text-[#FF4D20] font-medium hover:underline"
                >
                  {t('reset_filters')}
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-gray-400">{t('sort_by')}</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="text-[12px] font-semibold text-gray-700 dark:text-gray-300 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 outline-none cursor-pointer"
                  >
                    {sortOptions.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-gray-400">{t('show')}</span>
                  <select
                    value={showCount}
                    onChange={e => setShowCount(Number(e.target.value))}
                    className="text-[12px] font-semibold text-gray-700 dark:text-gray-300 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 outline-none cursor-pointer"
                  >
                    {showOptions.map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-24 text-gray-400">
                <p className="text-lg font-semibold mb-1">{t('no_products_found')}</p>
                <p className="text-sm">{t('try_adjusting_filters')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filtered.map(product => (
                  <Link
                    key={product.id}
                    to={`/product/${product.slug}`}
                    className="group bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-gray-900 hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
                  >
                    <div className="aspect-square relative overflow-hidden bg-white dark:bg-gray-800">
                      <img
                        src={product.image}
                        alt={t(`prod_${product.slug.replace(/-/g, '_')}`)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.discount > 0 && (
                        <span className="absolute top-2 left-2 bg-[#FF4D20] text-white text-[11px] font-bold px-2 py-0.5 rounded-md z-10">
                          -{product.discount}%
                        </span>
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-[14px] font-bold text-gray-900 dark:text-white line-clamp-1 mb-2">
                        {t(`prod_${product.slug.replace(/-/g, '_')}`)}
                      </p>

                      <div className="flex items-center gap-1 mb-3 mt-auto">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12}
                            className={i < Math.round(product.rating) ? "fill-[#FFB800] text-[#FFB800]" : "fill-gray-200 dark:fill-gray-600 text-gray-200 dark:text-gray-600"}
                          />
                        ))}
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 ml-1">({product.reviews})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[18px] font-black text-gray-900 dark:text-white">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-[13px] text-gray-400 dark:text-gray-500 line-through">${product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
