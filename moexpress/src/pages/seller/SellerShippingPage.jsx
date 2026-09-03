import React, { useState } from 'react';
import { 
  Truck, MapPin, Package, ShieldCheck, Clock, Settings, Save, Search, Check, AlertCircle 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

const wilayas = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", 
  "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", 
  "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", 
  "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran"
];

export default function SellerShippingPage() {
  const { t } = useLanguage();
  const [standardEnabled, setStandardEnabled] = useState(true);
  const [expressEnabled, setExpressEnabled] = useState(false);
  const [searchWilaya, setSearchWilaya] = useState('');
  
  // Dummy rates mapping
  const [rates, setRates] = useState({
    "Alger": { standard: 400, express: 800 },
    "Blida": { standard: 500, express: 900 },
    "Oran": { standard: 800, express: 1200 },
  });

  const handleSave = () => {
    toast.success("Paramètres de livraison sauvegardés !");
  };

  const updateRate = (wilaya, type, value) => {
    setRates(prev => ({
      ...prev,
      [wilaya]: {
        ...prev[wilaya],
        [type]: value ? parseInt(value) : 0
      }
    }));
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Truck className="text-[#FF4D20]" />
            Paramètres de Livraison
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Configurez vos transporteurs, tarifs et zones de livraison</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-[#FF4D20] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#e0431a] transition-colors shadow-sm"
        >
          <Save size={18} />
          Sauvegarder
        </button>
      </div>

      {/* Methods Setup */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Modes de Livraison Actifs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Standard */}
          <div className={`relative p-5 rounded-2xl border-2 transition-all ${
            standardEnabled ? 'border-[#FF4D20] bg-orange-50/50 dark:bg-[#FF4D20]/5' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${standardEnabled ? 'bg-[#FF4D20] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Livraison Standard</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Yalidine, Nord & Sud (2-5 jours)</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={standardEnabled} onChange={() => setStandardEnabled(!standardEnabled)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#FF4D20]"></div>
              </label>
            </div>
            {standardEnabled && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-emerald-500"/> Suivi inclus</div>
                <div className="flex items-center gap-1.5"><MapPin size={16} className="text-blue-500"/> 58 Wilayas</div>
              </div>
            )}
          </div>

          {/* Express */}
          <div className={`relative p-5 rounded-2xl border-2 transition-all ${
            expressEnabled ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${expressEnabled ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Livraison Express</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Coursier privé (24h - 48h)</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={expressEnabled} onChange={() => setExpressEnabled(!expressEnabled)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
              </label>
            </div>
            {expressEnabled && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-emerald-500"/> Remise en main propre</div>
                <div className="flex items-center gap-1.5"><MapPin size={16} className="text-blue-500"/> Zones limitées</div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Tarification par Wilaya */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tarifs par Wilaya</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Définissez vos frais de livraison manuellement</p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Chercher une wilaya..."
              className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-sm focus:ring-[#FF4D20] focus:border-[#FF4D20] dark:text-white"
              value={searchWilaya}
              onChange={(e) => setSearchWilaya(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4">Wilaya</th>
                <th className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Package size={16} className={standardEnabled ? "text-[#FF4D20]" : ""} />
                    Standard (DA)
                  </div>
                </th>
                <th className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className={expressEnabled ? "text-emerald-500" : ""} />
                    Express (DA)
                  </div>
                </th>
                <th className="px-6 py-4 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {wilayas.filter(w => w.toLowerCase().includes(searchWilaya.toLowerCase())).map((wilaya, index) => {
                const wRates = rates[wilaya] || { standard: 0, express: 0 };
                const isConfigured = wRates.standard > 0 || wRates.express > 0;

                return (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {index + 1}. {wilaya}
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        disabled={!standardEnabled}
                        value={wRates.standard || ''}
                        onChange={(e) => updateRate(wilaya, 'standard', e.target.value)}
                        placeholder="Ex: 500"
                        className="w-24 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm disabled:opacity-50 focus:ring-1 focus:ring-[#FF4D20] outline-none"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        disabled={!expressEnabled}
                        value={wRates.express || ''}
                        onChange={(e) => updateRate(wilaya, 'express', e.target.value)}
                        placeholder="Ex: 800"
                        className="w-24 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm disabled:opacity-50 focus:ring-1 focus:ring-emerald-500 outline-none"
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isConfigured ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
                          <Check size={14} /> Configuré
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 dark:bg-gray-800">
                          <AlertCircle size={14} /> Non défini
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      
    </div>
  );
}
