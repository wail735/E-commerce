import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Addresses = () => {
  const { user, token, loadUser } = useAuth();
  const { t } = useLanguage();
  
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update local state if user context updates
  useEffect(() => {
    if (user?.addresses) {
      setAddresses(user.addresses);
    }
  }, [user]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    zipCode: '',
    country: 'Algérie',
    isDefault: false
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.street || !formData.city || !formData.zipCode) {
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      const API_URL = import.meta.env.VITE_API_URL || 'https://e-commerce-backend-7dji.onrender.com';
      await axios.post(`${API_URL}/api/v1/users/addresses`, formData, config);
      
      toast.success('Adresse ajoutée avec succès');
      setIsAdding(false);
      setFormData({ name: '', phone: '', street: '', city: '', zipCode: '', country: 'Algérie', isDefault: false });
      
      // Recharge l'utilisateur pour avoir les nouvelles adresses
      await loadUser();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout de l\'adresse');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette adresse ?')) return;
    
    try {
      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };
      const API_URL = import.meta.env.VITE_API_URL || 'https://e-commerce-backend-7dji.onrender.com';
      await axios.delete(`${API_URL}/api/v1/users/addresses/${id}`, config);
      
      toast.success('Adresse supprimée');
      await loadUser();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleMakeDefault = async (id) => {
    try {
      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };
      const API_URL = import.meta.env.VITE_API_URL || 'https://e-commerce-backend-7dji.onrender.com';
      await axios.put(`${API_URL}/api/v1/users/addresses/${id}`, { isDefault: true }, config);
      
      toast.success('Adresse définie par défaut');
      await loadUser();
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom complet *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-[#FF4D20] focus:ring-[#FF4D20]" placeholder="Votre nom" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-[#FF4D20] focus:ring-[#FF4D20]" placeholder="+213..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse (Rue, bâtiment...) *</label>
              <input type="text" name="street" value={formData.street} onChange={handleChange} className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-[#FF4D20] focus:ring-[#FF4D20]" placeholder="Numéro et nom de rue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ville *</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-[#FF4D20] focus:ring-[#FF4D20]" placeholder="Ville" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code Postal *</label>
              <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-[#FF4D20] focus:ring-[#FF4D20]" placeholder="ex: 16000" />
            </div>
            <div className="md:col-span-2 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={(e) => setFormData({...formData, isDefault: e.target.checked})} className="rounded text-[#FF4D20] focus:ring-[#FF4D20] bg-gray-50 border-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Définir comme adresse par défaut</span>
              </label>
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
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#FF4D20] text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Chargement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">Aucune adresse enregistrée pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr._id || addr.id} className={`p-5 rounded-2xl border-2 transition-all ${addr.isDefault ? 'border-[#FF4D20] bg-orange-50/30 dark:bg-[#FF4D20]/5' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900'}`}>
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
                  {!addr.isDefault && (
                    <button onClick={() => handleMakeDefault(addr._id || addr.id)} className="hover:text-blue-500 transition-colors" title="Définir par défaut"><CheckCircle2 size={16} /></button>
                  )}
                  <button onClick={() => handleDelete(addr._id || addr.id)} className="hover:text-red-500 transition-colors" title="Supprimer"><Trash2 size={16} /></button>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{addr.street}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{addr.city}, {addr.zipCode}, {addr.country}</p>
              {addr.phone && (
                <p className="text-gray-800 dark:text-gray-200 text-sm font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                  {addr.phone}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Addresses;
