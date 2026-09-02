import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Megaphone, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

export default function AdminAds() {
  const { token } = useAuth();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds();
  }, [token]);

  const fetchAds = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/v1/ads/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAds(res.data.data?.ads || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id, status) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir ${status === 'active' ? 'accepter' : 'refuser'} cette publicité ?`)) return;

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/ads/admin/${id}/review`, {
        status
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAds();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la modération de la publicité.');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-gray-900" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Megaphone className="w-6 h-6 text-gray-900 dark:text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Modération Publicités</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Gérez les demandes de publicité des Vendeurs Pro.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        {ads.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Aucune publicité à afficher.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Boutique & Pub</th>
                  <th className="px-6 py-4 font-medium">Prix payé</th>
                  <th className="px-6 py-4 font-medium">Statut</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {ads.map((ad) => (
                  <tr key={ad._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={ad.mediaUrl || 'https://via.placeholder.com/150'} alt="" className="w-16 h-10 rounded object-cover bg-gray-100" />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{ad.title}</p>
                          <p className="text-xs text-gray-500">Par: {ad.advertiser?.name || 'Inconnu'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-orange-500">
                      {ad.pricePaid} Coins
                    </td>
                    <td className="px-6 py-4">
                      {ad.status === 'pending_approval' && <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs font-semibold">En attente</span>}
                      {ad.status === 'active' && <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-semibold">Actif</span>}
                      {ad.status === 'rejected' && <span className="text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-semibold">Refusé</span>}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {ad.status === 'pending_approval' && (
                        <>
                          <button onClick={() => handleReview(ad._id, 'active')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Accepter">
                            <CheckCircle size={20} />
                          </button>
                          <button onClick={() => handleReview(ad._id, 'rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Refuser">
                            <XCircle size={20} />
                          </button>
                        </>
                      )}
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
