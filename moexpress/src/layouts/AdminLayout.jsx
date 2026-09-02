import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronLeft,
  Scale,
  Headphones,
  Mail,
  MessageSquare,
  Send,
  Megaphone
} from 'lucide-react';
import Loader from '../components/Loader';

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'superAdmin')) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading || !user || user.role !== 'superAdmin') {
    return <Loader />;
  }

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Tableau de bord', path: '/admin/dashboard' },
    { icon: <Users size={20} />, label: 'Utilisateurs', path: '/admin/users' },
    { icon: <Store size={20} />, label: 'Boutiques Pro', path: '/admin/pro-shops' },
    { icon: <Scale size={20} />, label: 'Litiges', path: '/admin/disputes' },
    { icon: <Headphones size={20} />, label: 'Support Client', path: '/admin/support' },
    { icon: <MessageSquare size={20} />, label: 'Contacts', path: '/admin/contact' },
    { icon: <Send size={20} />, label: 'Newsletter', path: '/admin/newsletter' },
    { icon: <Megaphone size={20} />, label: 'Publicités', path: '/admin/ads' },
    { icon: <Settings size={20} />, label: 'Paramètres', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] flex font-sans transition-colors duration-300">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white dark:bg-[#1e293b] border-r border-gray-200 dark:border-gray-800
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <Link to="/" className="text-xl font-display font-black text-gray-900 dark:text-white flex items-center gap-2">
            <span className="bg-[#FF4D20] text-white p-1.5 rounded-lg leading-none">M</span>
            Admin
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200
                ${isActive 
                  ? 'bg-[#FF4D20] text-white shadow-md shadow-orange-500/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }
              `}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 shrink-0">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mb-2">
            <ChevronLeft size={20} />
            Retour au site
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-gray-800 flex items-center px-4 shrink-0">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 mr-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-gray-900 dark:text-white">Admin Panel</span>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
