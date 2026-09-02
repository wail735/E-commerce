import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function SellerPlaceholderPage({ title }) {
  const { t } = useLanguage();
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{t(title)}</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-10">{t('page_in_construction_desc')}</p>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-16 text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-bold text-gray-400 dark:text-gray-500">{t('page_in_construction')}</h3>
      </div>
    </div>
  );
}
