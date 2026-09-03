import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const PaymentMethods = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // Mock data for payment methods
  const [methods, setMethods] = useState([
    {
      id: 1,
      type: 'visa',
      brand: 'Visa',
      last4: '4242',
      expMonth: '12',
      expYear: '2025',
      isDefault: true,
      name: user?.name || 'Client'
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CreditCard className="text-[#FF4D20]" />
          Méthodes de paiement
        </h1>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[#FF4D20] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-orange-600 transition-colors"
        >
          <Plus size={16} />
          Ajouter
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Nouvelle carte bancaire</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom sur la carte</label>
              <input type="text" className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-[#FF4D20] focus:ring-[#FF4D20]" placeholder="Nom complet" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Numéro de carte</label>
              <div className="relative">
                <input type="text" className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-[#FF4D20] focus:ring-[#FF4D20] pl-10" placeholder="0000 0000 0000 0000" />
                <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date d'expiration</label>
              <input type="text" className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-[#FF4D20] focus:ring-[#FF4D20]" placeholder="MM/AA" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVC</label>
              <input type="text" className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-[#FF4D20] focus:ring-[#FF4D20]" placeholder="123" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button 
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors font-medium"
            >
              Annuler
            </button>
            <button 
              onClick={() => setIsAdding(false)}
              className="bg-[#FF4D20] text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 transition-colors"
            >
              Ajouter la carte
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {methods.map((method) => (
          <div key={method.id} className={`p-5 rounded-2xl border-2 transition-all relative overflow-hidden ${method.isDefault ? 'border-[#FF4D20] bg-gradient-to-br from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 text-white' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900'}`}>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <div className={`font-black italic text-xl ${method.isDefault ? 'text-white' : 'text-blue-700 dark:text-blue-400'}`}>VISA</div>
                {method.isDefault && (
                  <span className="bg-[#FF4D20] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ml-2">
                    <CheckCircle2 size={10} /> Principale
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <button className="hover:text-red-500 transition-colors z-20"><Trash2 size={16} /></button>
              </div>
            </div>
            
            <div className={`text-lg font-mono tracking-widest mb-4 relative z-10 ${method.isDefault ? 'text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>
              **** **** **** {method.last4}
            </div>
            
            <div className="flex justify-between items-end relative z-10">
              <div>
                <p className={`text-[10px] uppercase mb-0.5 ${method.isDefault ? 'text-gray-400' : 'text-gray-400'}`}>Titulaire</p>
                <p className={`text-sm font-medium ${method.isDefault ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{method.name}</p>
              </div>
              <div>
                <p className={`text-[10px] uppercase mb-0.5 text-right ${method.isDefault ? 'text-gray-400' : 'text-gray-400'}`}>Expire fin</p>
                <p className={`text-sm font-medium ${method.isDefault ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{method.expMonth}/{method.expYear}</p>
              </div>
            </div>

            {/* Decorative background circle */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full border-[10px] border-white/5 z-0"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
