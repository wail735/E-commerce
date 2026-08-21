import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Filter, ChevronDown, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { useLanguage } from '../context/LanguageContext';

const Products = () => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const { t } = useLanguage();

  // États des filtres globaux
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(1000);

  // Extraire dynamiquement les catégories et marques uniques depuis les produits
  const allCategories = [...new Set(products.map(p => p.category))];
  const allBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];

  // Fonction pour filtrer et trier les produits
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filtre par catégorie
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Filtre par marque
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // Filtre par prix
    result = result.filter(p => p.price <= priceRange);

    // Tri
    switch (sortBy) {
      case "price-low":
        return result.sort((a, b) => a.price - b.price);
      case "price-high":
        return result.sort((a, b) => b.price - a.price);
      case "newest":
        return result.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
      default:
        return result; // popular
    }
  }, [products, selectedCategories, selectedBrands, priceRange, sortBy]);

  // Handlers pour les checkboxes
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange(1000);
  };

  return (
    <div className="bg-white dark:bg-[#0B1120] min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#FF4D20]">{t('home')}</Link>
          <ChevronRight size={16} />
          <span className="text-gray-900 dark:text-gray-300 font-medium">{t('all_products')}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">{t('all_products')}</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl">{t('browse_entire_collection')}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Bouton Filtres Mobile */}
          <button
            className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold text-gray-900 dark:text-white transition-colors"
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          >
            <Filter size={20} />
            {t('filters')}
          </button>

          {/* Sidebar Filtres */}
          <div className={`w-full lg:w-64 shrink-0 space-y-8 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{t('filters')}</h3>
              {(selectedCategories.length > 0 || selectedBrands.length > 0 || priceRange < 1000) && (
                <button onClick={clearFilters} className="text-sm text-[#FF4D20] font-medium hover:underline">
                  {t('clear_all')}
                </button>
              )}
            </div>

            {/* Catégories globales */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
                {t('categories')}
              </h4>
              <div className="space-y-3">
                {allCategories.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 accent-[#FF4D20] dark:bg-gray-700"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                    />
                    <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors capitalize">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Marques */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">{t('brands')}</h4>
              <div className="space-y-3">
                {allBrands.map(brand => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 accent-[#FF4D20] dark:bg-gray-700"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                    />
                    <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Prix */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">{t('max_price')}: ${priceRange}</h4>
              <input
                type="range"
                min="0"
                max="2000"
                step="10"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#FF4D20]"
              />
            </div>
          </div>

          {/* Grille Produits */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pb-6 border-b border-gray-100 dark:border-gray-800 gap-4">
              <p className="text-gray-500 dark:text-gray-400">
                {t('showing')} <span className="font-bold text-gray-900 dark:text-white">{filteredProducts.length}</span> {t('products')}
              </p>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('sort_by')}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-[#FF4D20] focus:border-[#FF4D20] block p-2.5 outline-none font-medium cursor-pointer"
                >
                  <option value="popular">{t('most_popular')}</option>
                  <option value="newest">{t('newest_arrivals')}</option>
                  <option value="price-low">{t('price_low_to_high')}</option>
                  <option value="price-high">{t('price_high_to_low')}</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('no_products_found')}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">{t('try_adjusting_or_clearing')}</p>
                <button onClick={clearFilters} className="bg-[#FF4D20] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-colors">
                  {t('clear_filters')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Products;
