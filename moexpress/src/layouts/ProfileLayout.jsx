import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  MessageSquare, 
  Heart, 
  MapPin, 
  CreditCard, 
  Settings, 
  LogOut,
  Store,
  Scale,
  Headphones,
  Coins,
  Crown
} from 'lucide-react';
import logo from '../assets/logos/logo.png';
import logoF from '../assets/logos/logof.png';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const ProfileLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/profile/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Orders', path: '/profile/orders', icon: <ShoppingBag size={20} /> },
    { name: t('my_disputes'), path: '/profile/disputes', icon: <Scale size={20} /> },
    { name: 'Messages', path: '/profile/messages', icon: <MessageSquare size={20} /> },
    { name: 'Wishlist', path: '/profile/wishlist', icon: <Heart size={20} /> },
    { name: 'Addresses', path: '/profile/addresses', icon: <MapPin size={20} /> },
    { name: 'Payment Methods', path: '/profile/payments', icon: <CreditCard size={20} /> },
    { name: 'Mon Portefeuille', path: '/profile/wallet', icon: <Coins size={20} /> },
    { name: 'Abonnement', path: '/profile/subscription', icon: <Crown size={20} /> },
    { name: 'Support Client', path: '/profile/support', icon: <Headphones size={20} /> },
    { name: 'Account Settings', path: '/profile/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-white dark:bg-[#0B1120] overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full shrink-0">
        
        {/* Logo */}
        <div className="h-20 flex items-center px-6">
          <img 
            src={theme === 'dark' ? logoF : logo} 
            alt="MoExpress" 
            className="h-8 w-auto cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
          
          {/* User info + badge */}
          <div className="px-4 py-3 mb-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div className="flex items-center gap-3">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-9 h-9 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF4D20] to-orange-400 flex items-center justify-center text-white font-black text-sm shrink-0">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {user?.role === 'seller' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black bg-[#FF4D20] text-white px-2 py-0.5 rounded-full">
                      🛍️ VENDEUR
                    </span>
                  ) : user?.role === 'superAdmin' || user?.role === 'admin' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full">
                      🛡️ ADMIN
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-400 font-medium">Client Standard</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <h3 className="px-4 text-sm font-bold text-gray-900 dark:text-white mb-4 mt-2">
            My Account
          </h3>
          
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                    isActive
                      ? 'bg-orange-50 dark:bg-[#FF4D20]/10 text-[#FF4D20]'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Espace Vendeur - caché si déjà vendeur ou admin */}
        {(user?.role !== 'seller' && user?.role !== 'superAdmin' && user?.role !== 'admin') && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={() => navigate('/seller/onboarding')}
              className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-[#FF4D20] bg-orange-50 dark:bg-[#FF4D20]/10 hover:bg-orange-100 dark:hover:bg-[#FF4D20]/20 transition-colors"
            >
              <Store size={20} />
              Devenir Vendeur
            </button>
          </div>
        )}

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto bg-[#F8F9FA] dark:bg-[#0B1120]">
        <div className="p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default ProfileLayout;
