import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Store, Camera, Mail, Phone, MapPin, ShieldCheck, Save, Loader2, CreditCard, Link as LinkIcon
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function SellerSettingsPage() {
  const { user, token, updateUser } = useAuth();
  const { t } = useLanguage();
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    storeName: '',
    email: '',
    phone: '',
    description: '',
    address: '',
    socialLinks: {
      facebook: '',
      instagram: ''
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        storeName: user.storeName || '',
        email: user.email || '',
        phone: user.phone || '',
        description: user.storeDescription || '',
        address: user.address || '',
        socialLinks: {
          facebook: user.socialLinks?.facebook || '',
          instagram: user.socialLinks?.instagram || ''
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const socialKey = name.replace('social_', '');
      setFormData(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [socialKey]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    const formDataObj = new FormData();
    formDataObj.append('profilePicture', file);

    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/users/profile-picture`, formDataObj, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      updateUser(res.data.data); // Update user data with new picture
      toast.success('Logo mis à jour !');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors du téléchargement');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/users/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      updateUser(res.data.data); // Update user context with new settings
      toast.success('Paramètres sauvegardés avec succès !');
    } catch (err) {
      console.error("Settings save error:", err);
      console.error("Response data:", err.response?.data);
      const errorMsg = err.response?.data?.message || err.response?.data || err.message || 'Erreur lors de la sauvegarde';
      toast.error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Paramètres de la Boutique</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Gérez l'identité et les informations publiques de votre marque</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Verification */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-900 shadow-lg bg-gray-100 dark:bg-gray-700 mx-auto">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Store size={48} />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-[#FF4D20] text-white rounded-full cursor-pointer hover:bg-[#e0431a] transition-colors shadow-md">
                {uploading ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{user?.storeName || 'Ma Boutique'}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Vendeur {user?.sellerStatus === 'verified' ? 'Vérifié' : 'En Attente'}</p>
            
            {user?.sellerStatus === 'verified' && (
              <div className="mt-4 flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-lg text-sm font-semibold">
                <ShieldCheck size={18} /> Boutique Officielle
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
            
            {/* Infos de Base */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Informations Générales</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nom Complet (Gérant)</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-[#FF4D20] outline-none text-gray-900 dark:text-white transition-all" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nom de la Boutique (Public)</label>
                  <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-[#FF4D20] outline-none text-gray-900 dark:text-white transition-all" required />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description (Optionnelle)</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Décrivez votre boutique..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-[#FF4D20] outline-none text-gray-900 dark:text-white transition-all resize-none"></textarea>
                </div>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-700" />

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Contact & Localisation</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"><Mail size={16} /> Email Pro</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-[#FF4D20] outline-none text-gray-900 dark:text-white transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"><Phone size={16} /> Téléphone Pro</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-[#FF4D20] outline-none text-gray-900 dark:text-white transition-all" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"><MapPin size={16} /> Adresse / Wilaya</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-[#FF4D20] outline-none text-gray-900 dark:text-white transition-all" />
                </div>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-700" />

            {/* Réseaux Sociaux */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Réseaux Sociaux</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"><LinkIcon size={16} className="text-blue-600"/> Facebook</label>
                  <input type="url" name="social_facebook" value={formData.socialLinks?.facebook} onChange={handleChange} placeholder="https://facebook.com/..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"><LinkIcon size={16} className="text-pink-600"/> Instagram</label>
                  <input type="url" name="social_instagram" value={formData.socialLinks?.instagram} onChange={handleChange} placeholder="https://instagram.com/..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-pink-500 outline-none text-gray-900 dark:text-white transition-all" />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-[#FF4D20] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#e0431a] transition-colors shadow-sm disabled:opacity-70"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
