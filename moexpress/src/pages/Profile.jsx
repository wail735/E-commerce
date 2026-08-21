import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogOut, User, Mail, Shield, Settings } from 'lucide-react';

const Profile = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    // Si on a fini de charger et que l'utilisateur n'est pas connecté, on redirige
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-70px)] flex items-center justify-center bg-gray-50 dark:bg-[#0B1120]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-70px)] bg-gray-50 dark:bg-[#0B1120] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Profile */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-orange-100 to-red-50 dark:from-orange-900/20 dark:to-red-900/10"></div>
          
          <div className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden shrink-0 mt-8 md:mt-0">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl sm:text-5xl font-bold text-gray-400 dark:text-gray-500">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          
          <div className="relative z-10 flex-1 text-center md:text-left pt-4 md:pt-12">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400">
                <Shield size={12} />
                {user.role === 'admin' ? 'Administrateur' : 'Client Standard'}
              </span>
            </div>
          </div>
          
          <div className="relative z-10 mt-6 md:mt-12 flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm">
              <Settings size={18} />
              Modifier
            </button>
          </div>
        </div>

        {/* Détails et Paramètres */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Menu latéral */}
          <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
            <nav className="space-y-2">
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-primary bg-orange-50 dark:bg-orange-500/10 rounded-xl font-medium transition-colors">
                <User size={20} />
                Mes Informations
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl font-medium transition-colors">
                <Settings size={20} />
                Paramètres
              </a>
              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl font-medium transition-colors"
                >
                  <LogOut size={20} />
                  Se déconnecter
                </button>
              </div>
            </nav>
          </div>

          {/* Contenu principal */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Mes Informations</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                  Nom complet
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                  <User size={18} className="text-gray-400" />
                  <span className="text-gray-900 dark:text-white font-medium">{user.name}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                  Adresse Email
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                  <Mail size={18} className="text-gray-400" />
                  <span className="text-gray-900 dark:text-white font-medium">{user.email}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                  Statut du compte
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                  <Shield size={18} className="text-gray-400" />
                  <span className="text-green-600 dark:text-green-400 font-bold">Vérifié et Actif</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
