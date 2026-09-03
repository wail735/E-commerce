import React, { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const Addresses = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // Mock data for addresses since backend doesn't support multiple addresses yet
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: user?.name || 'Client',
      street: user?.address || '123 Rue de la République',
      city: 'Alger',
      zipCode: '16000',
      country: 'Algérie',
      isDefault: true,
      phone: user?.phone || '+213 555 123 456'
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MapPin className="text-[#FF4D20]" />
          Adresses de livraison
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
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Nouvelle adresse</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom complet</label>
              <input type="text" className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-[#FF4D20] focus:ring-[#FF4D20]" placeholder="Votre nom" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone</label>
              <input type="tel" className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-[#FF4D20] focus:ring-[#FF4D20]" placeholder="+213..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse (Rue, bâtiment...)</label>
              <input type="text" className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-[#FF4D20] focus:ring-[#FF4D20]" placeholder="Numéro et nom de rue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ville</label>
              <input type="text" className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-[#FF4D20] focus:ring-[#FF4D20]" placeholder="Ville" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code Postal</label>
              <input type="text" className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-[#FF4D20] focus:ring-[#FF4D20]" placeholder="ex: 16000" />
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
              Enregistrer
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div key={addr.id} className={`p-5 rounded-2xl border-2 transition-all ${addr.isDefault ? 'border-[#FF4D20] bg-orange-50/30 dark:bg-[#FF4D20]/5' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900'}`}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 dark:text-white">{addr.name}</span>
                {addr.isDefault && (
                  <span className="bg-[#FF4D20] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={10} /> Par défaut
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <button className="hover:text-blue-500 transition-colors"><Edit2 size={16} /></button>
                <button className="hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{addr.street}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{addr.city}, {addr.zipCode}, {addr.country}</p>
            <p className="text-gray-800 dark:text-gray-200 text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></span>
              {addr.phone}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Addresses;
