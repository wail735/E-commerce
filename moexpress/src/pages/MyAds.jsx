import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Megaphone, Plus, Loader2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyAds = () => {
  const { token, user } = useAuth();
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setIsLoading(true);
        // Fallback to empty array if endpoint doesn't exist yet for standard users
        const { data } = await axios.get(import.meta.env.VITE_API_URL + '/api/v1/ads/my-ads', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAds(data.data || []);
      } catch (err) {
        console.error(err);
        setAds([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) {
      fetchAds();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[#FF4D20]" size={40} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-50 dark:bg-orange-500/10 rounded-2xl">
            <Megaphone className="w-8 h-8 text-[#FF4D20]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mes Annonces</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Gérez vos campagnes publicitaires et annonces.</p>
          </div>
        </div>
        <Link 
          to={user?.role === 'seller' ? '/seller/marketing' : '/contact'}
          className="flex items-center gap-2 bg-[#FF4D20] text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
        >
          <Plus size={20} />
          Créer une annonce
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl">
          {error}
        </div>
      )}

      {ads.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-gray-800 p-12 text-center shadow-xl shadow-gray-200/20 dark:shadow-none">
          <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Megaphone className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Aucune annonce trouvée</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
            Vous n'avez pas encore créé de campagnes publicitaires ou d'annonces. 
            Commencez dès maintenant pour booster votre visibilité.
          </p>
          <Link 
            to={user?.role === 'seller' ? '/seller/marketing' : '/contact'}
            className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            <Plus size={20} />
            Créer ma première annonce
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div key={ad._id} className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/20 dark:shadow-none transition-transform hover:-translate-y-1 duration-300">
              <div className="h-48 bg-gray-100 dark:bg-gray-800 relative overflow-hidden group">
                {ad.mediaUrl ? (
                  <img src={ad.mediaUrl} alt={ad.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                    ad.status === 'active' ? 'bg-green-500/90 text-white' : 
                    ad.status === 'pending_approval' ? 'bg-yellow-500/90 text-white' : 
                    'bg-gray-500/90 text-white'
                  }`}>
                    {ad.status === 'active' ? 'Actif' : ad.status === 'pending_approval' ? 'En attente' : ad.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{ad.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <LinkIcon size={14} />
                  <a href={ad.targetUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#FF4D20] truncate transition-colors">
                    {ad.targetUrl}
                  </a>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Coût: </span>
                    <span className="font-bold text-gray-900 dark:text-white">{ad.pricePaid} Coins</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(ad.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAds;
