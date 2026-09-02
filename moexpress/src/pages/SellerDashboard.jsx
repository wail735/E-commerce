import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PackagePlus,
  PackageSearch,
  ShoppingBag,
  Settings,
  TrendingUp,
  DollarSign,
  Package,
  Plus
} from 'lucide-react';

const SellerDashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B1120]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4D20]"></div>
      </div>
    );
  }

  if (!user) return null;

  const renderDashboardStats = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Aperçu de la Boutique</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="p-4 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Revenus Totaux</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">$0.00</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Commandes</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">0</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="p-4 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-xl">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Produits Actifs</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">0</h3>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddProduct = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Ajouter un Nouveau Produit</h2>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom du Produit</label>
            <input type="text" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-[#FF4D20]" placeholder="Ex: iPhone 15 Pro" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Catégorie</label>
            <select className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-[#FF4D20]">
              <option>Électronique</option>
              <option>Mode</option>
              <option>Maison</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Prix ($)</label>
            <input type="number" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-[#FF4D20]" placeholder="0.00" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Stock Initial</label>
            <input type="number" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-[#FF4D20]" placeholder="10" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description Détaillée</label>
          <textarea rows="4" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-[#FF4D20]" placeholder="Décrivez votre produit en détail..."></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Images du Produit</label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 text-[#FF4D20] rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus size={24} />
            </div>
            <p className="text-gray-900 dark:text-white font-medium">Cliquez pour uploader</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">PNG, JPG, WEBP jusqu'à 5MB</p>
            <input type="file" multiple accept="image/*" className="hidden" />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="button" className="bg-[#FF4D20] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-colors">
            Publier le Produit
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
              <div className="mb-8">
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  {user.storeName || 'Ma Boutique'}
                </h3>
                <span className="inline-block mt-1 px-2.5 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
                  Vendeur Vérifié
                </span>
              </div>

              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-[#FF4D20] text-white shadow-md shadow-orange-500/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <LayoutDashboard size={20} /> Vue d'ensemble
                </button>
                <button 
                  onClick={() => setActiveTab('products')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'products' ? 'bg-[#FF4D20] text-white shadow-md shadow-orange-500/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <PackageSearch size={20} /> Mes Produits
                </button>
                <button 
                  onClick={() => setActiveTab('add-product')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'add-product' ? 'bg-[#FF4D20] text-white shadow-md shadow-orange-500/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <PackagePlus size={20} /> Ajouter Produit
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'orders' ? 'bg-[#FF4D20] text-white shadow-md shadow-orange-500/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <ShoppingBag size={20} /> Commandes Client
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && renderDashboardStats()}
            {activeTab === 'add-product' && renderAddProduct()}
            {activeTab === 'products' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 text-center">
                <PackageSearch size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Aucun produit publié</h3>
                <p className="text-gray-500 mt-2">Commencez par ajouter votre premier produit à vendre.</p>
                <button onClick={() => setActiveTab('add-product')} className="mt-4 text-[#FF4D20] font-bold hover:underline">Ajouter maintenant</button>
              </div>
            )}
            {activeTab === 'orders' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 text-center">
                <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Aucune commande</h3>
                <p className="text-gray-500 mt-2">Vous n'avez pas encore reçu de commandes.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
