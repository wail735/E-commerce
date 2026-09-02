import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
  TrendingUp, ShoppingBag, Users, BarChart2,
  ArrowUpRight, Clock, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import Loader from '../../components/Loader';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SellerDashboardPage() {
  const { user, token } = useAuth();
  const { t } = useLanguage();
  
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + '/api/v1/orders/seller/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardStats(res.data.data);
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques du vendeur:", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchStats();
    }
  }, [token]);

  if (loading) return <div className="p-8 flex justify-center"><Loader /></div>;

  const statsCards = [
    { label: t('total_sales'), value: `$${(dashboardStats?.totalSales || 0).toFixed(2)}`, change: '+0%', positive: true, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-500/10' },
    { label: t('seller_orders'), value: dashboardStats?.totalOrders || 0, change: '+0%', positive: true, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: t('visitors'), value: dashboardStats?.visitors || 0, change: '+0%', positive: true, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-500/10' },
    { label: t('conversion_rate'), value: `${dashboardStats?.conversionRate || 0}%`, change: '+0%', positive: true, icon: BarChart2, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-500/10' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">
          {t('welcome_back').replace('{name}', user?.storeName || user?.name || '')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {t('heres_what_happening')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={14} />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white mb-1">{stat.value}</div>
            <div className={`flex items-center gap-1 text-xs font-bold ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
              <ArrowUpRight size={12} /> {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Real Recharts Sales Overview */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white">{t('sales_overview')}</h2>
            <select className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 outline-none">
              <option>{t('this_month')}</option>
            </select>
          </div>
          
          <div className="h-64 w-full flex-1">
            {dashboardStats?.salesChartData && dashboardStats.salesChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardStats.salesChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF4D20" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FF4D20" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Ventes']}
                  />
                  <Area type="monotone" dataKey="sales" name="Ventes" stroke="#FF4D20" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Aucune donnée de vente pour le moment.
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-900 dark:text-white">{t('recent_orders')}</h2>
            <Link to="/seller/orders" className="text-xs font-semibold text-[#FF4D20] hover:underline flex items-center gap-1">
              {t('view_all')} <ChevronRight size={14} />
            </Link>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 text-center">Consultez l'onglet Commandes pour voir les dernières activités.</p>
            <Link to="/seller/products" className="mt-3 flex items-center justify-center gap-1 text-xs font-bold text-[#FF4D20] hover:underline">
              Gérer vos produits <ChevronRight size={12} />
            </Link>
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-black text-white text-lg">Prêt à vendre plus ?</h3>
          <p className="text-gray-400 text-sm">Ajoutez de nouveaux produits et touchez de nouveaux clients.</p>
        </div>
        <Link to="/seller/products/new"
          className="shrink-0 flex items-center gap-2 px-6 py-3 bg-[#FF4D20] text-white font-bold rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-colors">
          + Ajouter un produit
        </Link>
      </div>

    </div>
  );
}
