import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const PaymentCancel = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref');

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0B1120] transition-colors duration-300 px-4 py-20">
      <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} className="text-red-500" />
        </div>
        
        <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
          Paiement Annulé
        </h2>
        
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Vous avez annulé le paiement. Votre commande {ref ? `(${ref})` : ''} n'a pas été finalisée. 
          Aucun montant n'a été débité de votre compte.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/checkout" className="px-8 py-3.5 bg-gray-900 dark:bg-gray-700 text-white font-bold rounded-xl hover:bg-black dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
            <ArrowLeft size={18} />
            Retourner au paiement
          </Link>
          <Link to="/cart" className="px-8 py-3.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            {t('my_cart')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
