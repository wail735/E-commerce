import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import axios from 'axios';
import { ShoppingBag, Loader2, Package, Search } from 'lucide-react';

export default function SellerOrdersPage() {
  const { token } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, processing, shipped, delivered

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/v1/orders/seller-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.data || []);
    } catch (err) {
      console.error("Erreur lors de la récupération des commandes :", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="px-3 py-1 bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400 font-bold rounded-lg text-xs uppercase tracking-wider">{t('status_pending')}</span>;
      case 'processing': return <span className="px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold rounded-lg text-xs uppercase tracking-wider">{t('status_processing')}</span>;
      case 'shipped': return <span className="px-3 py-1 bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 font-bold rounded-lg text-xs uppercase tracking-wider">{t('status_shipped')}</span>;
      case 'delivered': return <span className="px-3 py-1 bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 font-bold rounded-lg text-xs uppercase tracking-wider">{t('status_delivered')}</span>;
      case 'cancelled': return <span className="px-3 py-1 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 font-bold rounded-lg text-xs uppercase tracking-wider">{t('status_cancelled')}</span>;
      default: return <span className="px-3 py-1 bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400 font-bold rounded-lg text-xs uppercase tracking-wider">{status}</span>;
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/orders/${orderId}/seller-status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh
      fetchOrders();
    } catch (err) {
      console.error("Erreur mise à jour statut", err);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t('seller_orders')}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {t('manage_orders_desc')}
          </p>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {['all', 'pending', 'processing', 'shipped', 'delivered'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                filter === f 
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
              }`}
            >
              {f === 'all' ? t('all_orders') : t(`status_${f}`)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[#FF4D20]" />
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredOrders.map(order => (
            <div key={order._id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow">
              
              {/* En-tête de la commande */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-700 mb-4">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">{t('order_id')}</p>
                    <p className="font-bold text-gray-900 dark:text-white">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">{t('date')}</p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">{t('total')}</p>
                    <p className="font-bold text-gray-900 dark:text-white">${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Contenu de la commande */}
              <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                <div className="flex items-center gap-3 overflow-x-auto max-w-full">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="relative shrink-0 group">
                      <div className="w-16 h-16 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-700">
                        <img 
                          src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/100'} 
                          alt={item.product?.name || 'Produit'} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                        {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <select 
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="px-4 py-2.5 bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 font-bold rounded-xl text-sm hover:border-[#FF4D20] dark:hover:border-[#FF4D20] transition-colors focus:outline-none cursor-pointer"
                  >
                    <option value="pending">{t('status_pending')}</option>
                    <option value="processing">{t('status_processing')}</option>
                    <option value="shipped">{t('status_shipped')}</option>
                    <option value="delivered">{t('status_delivered') || 'Livrée'}</option>
                    <option value="cancelled">{t('status_cancelled')}</option>
                  </select>
                  <button className="px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 font-bold rounded-xl text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    Détails
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package size={28} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Aucune commande</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-5">
            Vous n'avez pas de commandes {filter !== 'all' ? 'avec ce statut' : 'pour le moment'}.
          </p>
        </div>
      )}
    </div>
  );
}
