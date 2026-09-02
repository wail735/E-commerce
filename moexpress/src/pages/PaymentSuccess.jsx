import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

const PaymentSuccess = () => {
  const { t } = useLanguage();
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  
  const ref = searchParams.get('ref'); // Order ID

  useEffect(() => {
    // We clear the cart here to be safe
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0B1120] transition-colors duration-300 px-4 py-20">
      <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        
        <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
          Paiement Réussi !
        </h2>
        
        <p className="text-gray-500 dark:text-gray-400 mb-2">
          Votre commande a été traitée avec succès et votre paiement a été accepté.
        </p>

        {ref && (
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-8 bg-gray-50 dark:bg-gray-900 py-2 px-4 rounded-lg inline-block border border-gray-200 dark:border-gray-700">
            Référence Commande : {ref}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/profile/orders" className="px-8 py-3.5 bg-[#FF4D20] text-white font-bold rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
            Voir ma commande
            <ArrowRight size={18} />
          </Link>
          <Link to="/" className="px-8 py-3.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            {t('continue_shopping')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
