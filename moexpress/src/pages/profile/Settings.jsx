import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Lock, Camera, Save, MapPin } from 'lucide-react';
import axios from 'axios';

const Settings = () => {
  const { user, token, updateUser } = useAuth();
  const nameParts = user?.name ? user.name.split(' ') : [];
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || nameParts[0] || '',
    lastName: user?.lastName || nameParts.slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append('profilePicture', file);

    setIsUploadingImage(true);
    setMessage(null);
    try {
      const response = await axios.put(import.meta.env.VITE_API_URL + '/api/v1/users/profile-picture', formDataObj, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      updateUser(response.data.data);
      setMessage({ type: 'success', text: 'Photo de profil mise à jour avec succès.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || "Erreur lors de l'upload de l'image." });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      // Call the API to update profile
      const response = await axios.put(import.meta.env.VITE_API_URL + '/api/v1/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local context
      updateUser(response.data.data);
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès.' });
    } catch (err) {
      setMessage({ type: 'error', text: "Erreur lors de la mise à jour du profil." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Account Settings</h1>

      {message && (
        <div className={`p-4 rounded-xl mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-600 dark:bg-green-900/20' : 'bg-red-50 text-red-600 dark:bg-red-900/20'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-8">
        {/* Profile Picture Section */}
        <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Photo de profil</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover shadow-lg border-2 border-white dark:border-gray-800" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#FF4D20] to-[#FF8A00] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <button 
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 p-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-lg hover:scale-110 transition-transform"
                disabled={isUploadingImage}
              >
                <Camera size={16} />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Télécharger une nouvelle photo</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3">JPG, GIF ou PNG. Taille max 5MB.</p>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageChange}
              />
              <button 
                onClick={() => fileInputRef.current.click()}
                disabled={isUploadingImage}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isUploadingImage ? 'Upload en cours...' : 'Choisir un fichier'}
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information Form */}
        <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Informations personnelles</h2>
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Prénom</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF4D20] focus:border-transparent text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nom</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF4D20] focus:border-transparent text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF4D20] focus:border-transparent text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Téléphone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF4D20] focus:border-transparent text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-8 py-3 bg-[#FF4D20] hover:bg-[#E63D10] text-white font-bold rounded-xl transition-all disabled:opacity-70 shadow-lg shadow-orange-500/30"
              >
                <Save size={18} />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Section */}
        <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Sécurité et Mot de passe</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Mot de passe actuel</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF4D20] focus:border-transparent text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nouveau mot de passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF4D20] focus:border-transparent text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirmer le mot de passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF4D20] focus:border-transparent text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Mettre à jour le mot de passe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
