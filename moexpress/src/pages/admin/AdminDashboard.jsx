import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Users, Store, ShoppingBag, DollarSign, TrendingUp, Activity } from 'lucide-react';
import Loader from '../../components/Loader';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + '/api/v1/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data.data);
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return <Loader />;

  const statCards = [
    {
      title: "Utilisateurs Totaux",
      value: stats?.totalUsers || 0,
      icon: <Users size={24} className="text-blue-500" />,
      bg: "bg-blue-50 dark:bg-blue-500/10",
      trend: "Total inscrits"
    },
    {
      title: "Boutiques Pro (Vendeurs)",
      value: stats?.totalProShops || 0,
      icon: <Store size={24} className="text-purple-500" />,
      bg: "bg-purple-50 dark:bg-purple-500/10",
      trend: "Comptes vendeurs actifs"
    },
    {
      title: "Commandes Globales",
      value: stats?.totalOrders || 0,
      icon: <ShoppingBag size={24} className="text-orange-500" />,
      bg: "bg-orange-50 dark:bg-orange-500/10",
      trend: "Toutes commandes confondues"
    },
    {
      title: "Revenu Total Généré",
      value: `$${(stats?.totalRevenue || 0).toFixed(2)}`,
      icon: <TrendingUp size={24} className="text-green-500" />,
      bg: "bg-green-50 dark:bg-green-500/10",
      trend: "Chiffre d'affaires global"
    },
    {
      title: "Commissions Plateforme",
      value: `$${(stats?.totalCommissions || 0).toFixed(2)}`,
      icon: <DollarSign size={24} className="text-emerald-500" />,
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      trend: "Bénéfice net plateforme"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
          <Activity size={24} className="text-[#FF4D20]" />
          Vue d'ensemble de la plateforme
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Statistiques en temps réel et performances globales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold mb-1">{stat.title}</h3>
            <div className="text-2xl font-black text-gray-900 dark:text-white mb-2">{stat.value}</div>
            <div className="mt-auto text-xs font-medium text-gray-400 dark:text-gray-500">
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Real Recharts Sales Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Évolution des Revenus (30 derniers jours)</h2>
          <div className="h-64 w-full">
            {stats?.salesChartData && stats.salesChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.salesChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`$${value.toFixed(2)}`]}
                  />
                  <Legend iconType="circle" />
                  <Area type="monotone" dataKey="revenue" name="Revenu Brut" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="commission" name="Commissions (Plateforme)" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorCommission)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Aucune donnée de vente pour le moment.
              </div>
            )}
          </div>
        </div>
        
        {/* Real Recharts Users Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Nouvelles Inscriptions (30 derniers jours)</h2>
          <div className="h-64 w-full">
            {stats?.usersChartData && stats.usersChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.usersChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="users" name="Nouveaux Utilisateurs" fill="#FF4D20" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Aucune nouvelle inscription.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">Activité Récente</h2>
        <div className="space-y-4">
          {stats?.recentActivity && stats.recentActivity.length > 0 ? stats.recentActivity.map((activity, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${activity.color}`}></div>
              <div className="text-sm text-gray-700 dark:text-gray-300">{activity.text}</div>
              <div className="ml-auto text-xs text-gray-400">{new Date(activity.date).toLocaleString()}</div>
            </div>
          )) : (
            <div className="text-sm text-gray-500">Aucune activité récente.</div>
          )}
        </div>
      </div>
    </div>
  );
}
