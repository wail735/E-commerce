import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Users, ShoppingBag, DollarSign, Calendar, Download, Filter, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Dummy data for charts
const revenueData = [
  { name: 'Lun', revenue: 4000, orders: 24 },
  { name: 'Mar', revenue: 3000, orders: 18 },
  { name: 'Mer', revenue: 5000, orders: 35 },
  { name: 'Jeu', revenue: 2780, orders: 15 },
  { name: 'Ven', revenue: 8900, orders: 58 },
  { name: 'Sam', revenue: 12390, orders: 84 },
  { name: 'Dim', revenue: 10490, orders: 72 },
];

const topProducts = [
  { id: 1, name: "Montre Connectée Pro", sales: 124, revenue: 12400, stock: 45 },
  { id: 2, name: "Écouteurs Sans Fil", sales: 98, revenue: 4900, stock: 12 },
  { id: 3, name: "Sac à Dos Imperméable", sales: 85, revenue: 3400, stock: 156 },
  { id: 4, name: "Clavier Mécanique RGB", sales: 64, revenue: 5120, stock: 0 },
];

export default function SellerReportsPage() {
  const { t } = useLanguage();
  const [period, setPeriod] = useState('7days');

  const StatCard = ({ title, value, trend, isPositive, icon: Icon }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
          <Icon size={24} className="text-[#FF4D20]" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full ${
          isPositive ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' : 'text-red-600 bg-red-50 dark:bg-red-500/10'
        }`}>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Rapports & Statistiques</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Analysez vos performances de vente détaillées</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
            {['7days', '30days', 'year'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  period === p 
                  ? 'bg-[#FF4D20] text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {p === '7days' ? '7 Jours' : p === '30days' ? '30 Jours' : '1 An'}
              </button>
            ))}
          </div>
          <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Chiffre d'Affaires" value="124,500 DA" trend="+15.3%" isPositive={true} icon={DollarSign} />
        <StatCard title="Commandes" value="342" trend="+8.1%" isPositive={true} icon={ShoppingBag} />
        <StatCard title="Visiteurs" value="8,405" trend="-2.4%" isPositive={false} icon={Users} />
        <StatCard title="Taux de Conversion" value="4.1%" trend="+1.2%" isPositive={true} icon={TrendingUp} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Évolution des Ventes</h3>
            <button className="text-sm font-medium text-[#FF4D20] flex items-center gap-1 hover:underline">
              Voir détails <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4D20" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF4D20" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(value) => `${value/1000}k`} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#FF4D20" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Meilleurs Produits</h3>
          <div className="space-y-5">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-500/20 text-[#FF4D20] flex items-center justify-center font-bold text-sm shrink-0">
                  #{index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{product.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{product.sales} ventes</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{product.revenue} DA</p>
                  <p className={`text-[10px] font-medium mt-0.5 ${product.stock > 10 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {product.stock > 0 ? `Stock: ${product.stock}` : 'Rupture'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
