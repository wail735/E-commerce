import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Settings as SettingsIcon, Percent, Bot, Save, Loader2, CheckCircle } from 'lucide-react';
import Loader from '../../components/Loader';

export default function AdminSettings() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [settings, setSettings] = useState({
    commissionRate: 10,
    ollamaConfig: {
      modelName: 'llama3',
      host: 'http://127.0.0.1:11434',
      enabled: true
    }
  });

  const fetchSettings = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/v1/admin/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.data) {
        setSettings({
          commissionRate: res.data.data.commissionRate ?? 10,
          ollamaConfig: {
            modelName: res.data.data.ollamaConfig?.modelName || 'llama3',
            host: res.data.data.ollamaConfig?.host || 'http://127.0.0.1:11434',
            enabled: res.data.data.ollamaConfig?.enabled ?? true
          }
        });
      }
    } catch (error) {
      console.error("Erreur chargement paramètres", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      await axios.put(import.meta.env.VITE_API_URL + '/api/v1/admin/settings', 
        settings,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert(error.response?.data?.message || "Erreur de sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <SettingsIcon size={24} className="text-[#FF4D20]" />
            Paramètres de la Plateforme
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configurez les frais, les commissions et les intégrations globales.
          </p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#FF4D20] text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl text-green-700 dark:text-green-400 font-bold">
          <CheckCircle size={20} /> Paramètres sauvegardés avec succès !
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Commission Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-500/10">
              <Percent size={20} className="text-[#FF4D20]" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Frais & Commissions</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Commission sur les ventes (%)
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Pourcentage prélevé par la plateforme sur chaque vente d'un vendeur.
              </p>
              <div className="relative">
                <input 
                  type="number" 
                  min="0" max="100" step="0.5"
                  value={settings.commissionRate}
                  onChange={(e) => setSettings({...settings, commissionRate: Number(e.target.value)})}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-white outline-none focus:border-[#FF4D20]"
                />
                <Percent size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* AI Integration Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10">
              <Bot size={20} className="text-blue-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Intelligence Artificielle (Ollama)</h2>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={settings.ollamaConfig.enabled}
                  onChange={(e) => setSettings({
                    ...settings, 
                    ollamaConfig: { ...settings.ollamaConfig, enabled: e.target.checked }
                  })}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${settings.ollamaConfig.enabled ? 'bg-[#FF4D20]' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.ollamaConfig.enabled ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                Activer l'auto-complétion IA
              </div>
            </label>

            <div className={!settings.ollamaConfig.enabled ? 'opacity-50 pointer-events-none' : ''}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Modèle utilisé
              </label>
              <select 
                value={settings.ollamaConfig.modelName}
                onChange={(e) => setSettings({
                  ...settings, 
                  ollamaConfig: { ...settings.ollamaConfig, modelName: e.target.value }
                })}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-[#FF4D20] mb-4"
              >
                <option value="llama3">LLaMA 3</option>
                <option value="mistral">Mistral</option>
                <option value="gemma">Gemma</option>
              </select>

              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Hôte de l'API Ollama
              </label>
              <input 
                type="text" 
                value={settings.ollamaConfig.host}
                onChange={(e) => setSettings({
                  ...settings, 
                  ollamaConfig: { ...settings.ollamaConfig, host: e.target.value }
                })}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-[#FF4D20]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
