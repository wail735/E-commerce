import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Megaphone, Plus, Link as LinkIcon, Image as ImageIcon, Loader2, Coins, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function SellerMarketingPage() {
  const { token, user } = useAuth();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');

  const AD_COST = 500;

  useEffect(() => {
    fetchAds();
  }, [token]);

  const fetchAds = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/v1/ads/my-ads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAds(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.coins < AD_COST) {
      alert(`Fonds insuffisants. Vous avez besoin de ${AD_COST} MoCoins.`);
      return;
    }

    if (!window.confirm(`Cette action déduira ${AD_COST} MoCoins de votre portefeuille. Continuer ?`)) return;

    setSubmitting(true);
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/api/v1/ads/request-boutique-ad', {
        title,
        mediaType: 'image',
        mediaUrl,
        targetUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Demande de publicité soumise avec succès !');
      setShowForm(false);
      setTitle('');
      setMediaUrl('');
      setTargetUrl('');
      fetchAds();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Erreur lors de la soumission de la publicité.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-semibold"><CheckCircle size={14} /> Actif</span>;
      case 'pending_approval':
        return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs font-semibold"><Clock size={14} /> En attente</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-semibold"><XCircle size={14} /> Refusé</span>;
      default:
        return <span className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-1 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-gray-900 dark:text-white" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Megaphone className="w-6 h-6 text-gray-900 dark:text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marketing</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Boostez votre visibilité sur la page d'accueil.</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          {showForm ? 'Annuler' : <><Plus size={18} /> Nouvelle Campagne</>}
        </button>
      </div>

      {/* Formulaire de création */}
      {showForm && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
          <div className="mb-6 pb-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Créer une campagne publicitaire</h2>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#FF4D20] bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-lg">
              <Coins size={16} /> Coût : {AD_COST} MoCoins
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre de la campagne</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Super Promo d'été !"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4D20] focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <ImageIcon size={16} /> Lien de l'image (Bannière)
                </label>
                <input
                  type="url"
                  required
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://mon-image.com/banniere.jpg"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4D20] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <LinkIcon size={16} /> Lien de redirection
                </label>
                <input
                  type="url"
                  required
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://moexpress.com/shop/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4D20] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-3 bg-[#FF4D20] hover:bg-[#E63D10] text-white font-bold rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Lancer la campagne'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des campagnes */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Vos campagnes</h2>
        </div>
        
        {ads.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Vous n'avez pas encore lancé de campagne publicitaire.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Titre & Image</th>
                  <th className="px-6 py-4 font-medium">Statut</th>
                  <th className="px-6 py-4 font-medium">Coût</th>
                  <th className="px-6 py-4 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {ads.map((ad) => (
                  <tr key={ad._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={ad.mediaUrl || 'https://via.placeholder.com/150'} alt={ad.title} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{ad.title}</p>
                          <a href={ad.targetUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">Voir le lien</a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(ad.status)}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">
                      {ad.pricePaid} Coins
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500">
                      {new Date(ad.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
