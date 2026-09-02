import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Store, CheckCircle, XCircle, Search, Loader2 } from 'lucide-react';
import Loader from '../../components/Loader';

export default function AdminProShops() {
  const { token } = useAuth();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending'); // pending, approved, rejected
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const [rejectModal, setRejectModal] = useState({ open: false, userId: null, reason: '' });

  const fetchShops = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/admin/pro-shops?status=${statusFilter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShops(res.data.data);
    } catch (error) {
      console.error("Erreur chargement boutiques pro", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, [token, statusFilter]);

  const handleReview = async (targetUserId, action, rejectionReason = '') => {
    setActionLoading(`${action}-${targetUserId}`);
    try {
      await axios.put(import.meta.env.VITE_API_URL + '/api/v1/admin/pro-shops/review', 
        { targetUserId, action, rejectionReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (action === 'reject') {
        setRejectModal({ open: false, userId: null, reason: '' });
      }
      await fetchShops();
    } catch (error) {
      alert(error.response?.data?.message || "Erreur de révision");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredShops = shops.filter(s => 
    s.proShopDetails?.shopName?.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Store size={24} className="text-[#FF4D20]" />
            Candidatures Boutiques Pro
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Modérez les demandes d'ouverture de boutiques professionnelles.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-700 dark:text-gray-300 outline-none focus:border-[#FF4D20]"
          >
            <option value="pending">En attente</option>
            <option value="approved">Approuvées</option>
            <option value="rejected">Rejetées</option>
          </select>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:border-[#FF4D20] outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 size={32} className="animate-spin text-[#FF4D20]" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map(shop => (
            <div key={shop._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col relative overflow-hidden">
              {/* Status Ribbon */}
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                shop.proShopDetails?.status === 'approved' ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400' :
                shop.proShopDetails?.status === 'rejected' ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
                'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400'
              }`}>
                {shop.proShopDetails?.status === 'approved' ? <CheckCircle size={12} /> :
                 shop.proShopDetails?.status === 'rejected' ? <XCircle size={12} /> : <Loader2 size={12} className="animate-spin" />}
                {shop.proShopDetails?.status.charAt(0).toUpperCase() + shop.proShopDetails?.status.slice(1)}
              </div>

              <div className="mb-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white pr-24">
                  {shop.proShopDetails?.shopName || 'Boutique sans nom'}
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">{shop.email}</div>
              </div>

              <div className="space-y-3 mb-6 flex-1 text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs">Propriétaire</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{shop.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs">Description / Catégorie</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300 line-clamp-2">
                    {shop.proShopDetails?.description || 'Non renseignée'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs">Date de candidature</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {new Date(shop.proShopDetails?.appliedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {shop.proShopDetails?.status === 'pending' && (
                <div className="flex items-center gap-3 mt-auto">
                  <button 
                    disabled={actionLoading === `reject-${shop._id}`}
                    onClick={() => setRejectModal({ open: true, userId: shop._id, reason: '' })}
                    className="flex-1 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl transition-colors"
                  >
                    Refuser
                  </button>
                  <button 
                    disabled={actionLoading === `approve-${shop._id}`}
                    onClick={() => handleReview(shop._id, 'approve')}
                    className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {actionLoading === `approve-${shop._id}` ? <Loader2 size={16} className="animate-spin" /> : 'Approuver'}
                  </button>
                </div>
              )}
            </div>
          ))}

          {filteredShops.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
              Aucune candidature trouvée.
            </div>
          )}
        </div>
      )}

      {/* Modal de refus */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Motif du refus</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Veuillez expliquer pourquoi cette candidature est refusée. Ce motif sera envoyé au candidat par email/notification.
            </p>
            <textarea 
              value={rejectModal.reason}
              onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              placeholder="Ex: Le nom de votre boutique ne respecte pas nos conditions d'utilisation..."
              className="w-full h-32 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm text-gray-900 dark:text-white outline-none focus:border-[#FF4D20] resize-none mb-6"
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setRejectModal({ open: false, userId: null, reason: '' })}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={() => handleReview(rejectModal.userId, 'reject', rejectModal.reason)}
                disabled={!rejectModal.reason.trim() || actionLoading === `reject-${rejectModal.userId}`}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading === `reject-${rejectModal.userId}` ? <Loader2 size={16} className="animate-spin" /> : 'Confirmer le refus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
