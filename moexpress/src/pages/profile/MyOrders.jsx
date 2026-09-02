import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Scale, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const MyOrders = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();
  const [disputeModal, setDisputeModal] = useState({ open: false, orderId: null });
  const [disputeForm, setDisputeForm] = useState({ reason: 'non_delivery', description: '' });
  const [submittingDispute, setSubmittingDispute] = useState(false);

  const handleOpenDispute = (orderId) => {
    setDisputeModal({ open: true, orderId });
    setDisputeForm({ reason: 'non_delivery', description: '' });
  };

  const submitDispute = async (e) => {
    e.preventDefault();
    try {
      setSubmittingDispute(true);
      await axios.post(import.meta.env.VITE_API_URL + '/api/v1/disputes', {
        orderId: disputeModal.orderId,
        reason: disputeForm.reason,
        description: disputeForm.description
      }, { headers: { Authorization: `Bearer ${token}` } });
      setDisputeModal({ open: false, orderId: null });
      alert(t('dispute_opened') || 'Litige ouvert avec succès.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de l'ouverture du litige");
    } finally {
      setSubmittingDispute(false);
    }
  };
  
  const tabs = ['All', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(import.meta.env.VITE_API_URL + '/api/v1/orders/my-orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(data.data);
      } catch (err) {
        console.error(err);
        setError('Impossible de récupérer vos commandes.');
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30';
      case 'shipped':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30';
      case 'processing':
        return 'text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30';
      case 'cancelled':
        return 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30';
      default: // pending
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      processing: 'En préparation',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return labels[status] || status;
  };

  const filteredOrders = activeTab === 'All' 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-[#FF4D20]" size={40} /></div>;
  }

  if (error) {
    return <div className="text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</div>;
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">My Orders</h1>
      
      {/* Tabs */}
      <div className="flex space-x-8 border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
              activeTab === tab
                ? 'text-[#FF4D20]'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF4D20] rounded-t-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Aucune commande trouvée.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div 
              key={order._id} 
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 transition-shadow hover:shadow-sm"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Commande #{order.trackingNumber || order._id.slice(-8).toUpperCase()}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Total: {order.totalAmount.toFixed(2)} €</span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              {/* Body */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 overflow-x-auto hide-scrollbar flex-1">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 pr-4 border-r border-gray-100 dark:border-gray-800 last:border-0 shrink-0">
                      <div className="w-16 h-16 rounded-lg bg-gray-50 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                        <img 
                          src={item.product?.image || item.product?.images?.[0]?.url || 'https://via.placeholder.com/150'} 
                          alt="Product" 
                          className="w-full h-full object-contain p-1 mix-blend-multiply" 
                        />
                      </div>
                      <div className="flex flex-col max-w-[150px]">
                        <span className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.product?.name || "Produit supprimé"}</span>
                        <span className="text-xs text-gray-500">Qté: {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                  <button className="px-5 py-2.5 w-full sm:w-auto rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Détails
                  </button>
                  {(order.status === 'delivered' || order.status === 'shipped') && (
                    <button 
                      onClick={() => handleOpenDispute(order._id)}
                      className="px-5 py-2.5 w-full sm:w-auto bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-sm font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <Scale size={16} />
                      {t('open_dispute') || 'Ouvrir un Litige'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    
      {disputeModal.open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Scale className="text-[#FF4D20]" />
                {t('open_dispute') || 'Ouvrir un Litige'}
              </h3>
              <button 
                onClick={() => setDisputeModal({ open: false, orderId: null })}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={submitDispute} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t('dispute_reason') || 'Motif'}</label>
                <select 
                  value={disputeForm.reason}
                  onChange={(e) => setDisputeForm({...disputeForm, reason: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#FF4D20]"
                >
                  <option value="non_delivery">{t('reason_non_delivery') || 'Article non reçu'}</option>
                  <option value="damaged">{t('reason_damaged') || 'Article endommagé'}</option>
                  <option value="wrong_item">{t('reason_wrong_item') || 'Mauvais article reçu'}</option>
                  <option value="defective">{t('reason_defective') || 'Article défectueux'}</option>
                  <option value="fraud">{t('reason_fraud') || 'Fraude / Activité suspecte'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t('dispute_description') || 'Description du problème'}</label>
                <textarea 
                  required
                  rows="4"
                  value={disputeForm.description}
                  onChange={(e) => setDisputeForm({...disputeForm, description: e.target.value})}
                  placeholder="Expliquez le problème en détail..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#FF4D20]"
                ></textarea>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setDisputeModal({ open: false, orderId: null })}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('cancel_dispute') || 'Annuler'}
                </button>
                <button 
                  type="submit"
                  disabled={submittingDispute}
                  className="flex-1 px-4 py-3 bg-[#FF4D20] text-white font-bold rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submittingDispute && <Loader2 size={18} className="animate-spin" />}
                  {t('submit_dispute') || 'Soumettre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
