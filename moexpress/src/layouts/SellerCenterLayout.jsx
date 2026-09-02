import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard, Package, ShoppingBag, TrendingUp,
  MessageSquare, Store, Megaphone, BarChart2, Settings, LogOut, Scale, Headphones, Coins, Crown, Truck
} from 'lucide-react';

export default function SellerCenterLayout() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const navItems = [
    { label: t('seller_dashboard'), path: '/seller/dashboard', icon: LayoutDashboard },
    { label: t('seller_products'), path: '/seller/products', icon: Package },
    { label: t('seller_orders'), path: '/seller/orders', icon: ShoppingBag },
    { label: t('seller_sales'), path: '/seller/sales', icon: TrendingUp },
    { label: t('seller_messages'), path: '/seller/messages', icon: MessageSquare },
    { label: t('seller_store'), path: '/seller/store', icon: Store },
    { label: t('seller_marketing'), path: '/seller/marketing', icon: Megaphone },
    { label: t('seller_reports'), path: '/seller/reports', icon: BarChart2 },
    { label: t('my_disputes') || 'Litiges', path: '/seller/disputes', icon: Scale },
    { label: 'Support Client', path: '/seller/support', icon: Headphones },
    { label: 'Livraison', path: '/seller/shipping', icon: Truck },
    { label: 'Mon Portefeuille', path: '/profile/wallet', icon: Coins },
    { label: 'Abonnement', path: '/profile/subscription', icon: Crown },
    { label: t('seller_settings'), path: '/seller/settings', icon: Settings },
  ];

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate('/login');
  }, [isAuthenticated, loading, navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B1120]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4D20]" />
    </div>
  );

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0B1120] overflow-hidden font-sans">

      {/* Sidebar */}
      <aside className="w-52 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-800">
          <h1 className="text-base font-black text-gray-900 dark:text-white">{t('seller_center')}</h1>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{user.storeName || user.name}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/seller/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors mb-0.5
                ${isActive
                  ? 'text-[#FF4D20] bg-orange-50 dark:bg-[#FF4D20]/10'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                }`
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Store size={17} /> {t('seller_view_store')}
          </button>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={17} /> {t('seller_logout')}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#0B1120]">
        <Outlet />
      </main>
    </div>
  );
}
