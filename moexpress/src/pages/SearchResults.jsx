import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { useLanguage } from '../context/LanguageContext';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { t } = useLanguage();

    const results = useMemo(() => { //useMemo pour eviter les recalculs inutiles 
        if (!query) return [];
        const lowerQuery = query.toLowerCase();
        return products.filter(p => {
            const translatedName = t(`prod_${p.slug.replace(/-/g, '_')}`).toLowerCase();
            return translatedName.includes(lowerQuery) ||
                p.category.toLowerCase().includes(lowerQuery) ||
                (p.brand && p.brand.toLowerCase().includes(lowerQuery));
        });
    }, [query, t]);

    return (
        <div className="min-h-screen bg-white dark:bg-[#0B1120] transition-colors duration-300">
            <div className="container mx-auto px-4 py-8 max-w-6xl">

                <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
                    <Link to="/" className="hover:text-[#FF4D20]">{t('home')}</Link>
                    <ChevronRight size={16} />
                    <span className="text-gray-900 dark:text-white">{t('search_results_for')} "<strong>{query}</strong>"</span>
                </nav>

                <div className="mb-6 pb-4 border-b border-gray-200/60 dark:border-gray-800 flex items-center justify-between">
                    <h1 className="text-[20px] font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Search size={20} className="text-[#FF4D20]" />
                        "{query}"
                    </h1>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                        <strong className="text-gray-900 dark:text-white">{results.length}</strong> {t('results_found')}
                    </span>
                </div>

                {results.length === 0 ? (
                    <div className="text-center py-24">
                        <Search size={60} className="text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('no_results_found')}</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">
                            {t('couldnt_find_matching')} "<strong>{query}</strong>".
                        </p>
                        <Link to="/products" className="bg-[#FF4D20] text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">
                            {t('browse_all_products')}
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                        {results.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default SearchResults;
