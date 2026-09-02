import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Store, Star, MessageSquare, MapPin, Calendar, Package } from 'lucide-react';

export default function SellerStorePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    fetchStoreData();
  }, [id]);

  const fetchStoreData = async () => {
    setLoading(true);
    try {
      // 1. Fetch store profile
      const storeRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users/store/${id}`);
      setStore(storeRes.data.data);

      // 2. Fetch store products
      const productsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/products?seller=${id}&limit=50`);
      setProducts(productsRes.data.data || []);
    } catch (err) {
      console.error("Erreur chargement boutique", err);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user._id === id || user.id === id) {
      alert("C'est votre propre boutique !");
      return;
    }
    
    setChatLoading(true);
    try {
      if (products.length === 0) {
        alert("Ce vendeur n'a pas encore de produits à discuter.");
        return;
      }
      
      const res = await axios.post(import.meta.env.VITE_API_URL + '/api/v1/chat/initiate-product-chat', 
        { productId: products[0]._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const roomId = res.data.data.roomId;
      navigate(`/profile/messages?room=${roomId}`);
    } catch (error) {
      console.error("Erreur d'initialisation du chat:", error);
      alert(error.response?.data?.message || "Impossible de contacter le vendeur pour le moment.");
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!store) return <div className="text-center py-20 font-bold text-xl">Boutique introuvable</div>;

  const isOwnStore = user && (user._id === id || user.id === id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] pb-20">
      {/* Store Banner */}
      <div className="h-64 sm:h-80 w-full bg-gradient-to-r from-[#FF4D20] to-orange-400 relative">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl -mt-24 relative z-10">
        
        {/* Store Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-100 dark:border-gray-700 mb-12 flex flex-col sm:flex-row gap-8 items-start sm:items-center">
          
          {/* Avatar / Logo */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white dark:bg-gray-900 rounded-2xl shadow-md border-4 border-white dark:border-gray-800 flex items-center justify-center shrink-0">
            {store.proShopDetails?.logo ? (
              <img src={store.proShopDetails.logo} alt={store.storeName} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <Store size={64} className="text-[#FF4D20]" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2">
                  {store.storeName || store.name}
                </h1>
                {store.isProShop && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs rounded-lg uppercase tracking-wider">
                    Boutique Officielle Pro
                  </span>
                )}
              </div>
              
              {!isOwnStore && (
                <button 
                  onClick={handleContactSeller}
                  disabled={chatLoading}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm"
                >
                  {chatLoading ? <Loader className="animate-spin w-5 h-5" /> : <MessageSquare size={20} />}
                  Contacter le vendeur
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Star size={18} className="text-[#FFB800] fill-[#FFB800]" />
                <span className="font-bold text-gray-900 dark:text-white">4.8</span>
                <span>(124 avis)</span>
              </div>
              <div className="flex items-center gap-2">
                <Package size={18} />
                <span>{products.length} Produits</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>Membre depuis {new Date(store.createdAt).getFullYear()}</span>
              </div>
            </div>
            
            {store.proShopDetails?.description && (
              <p className="mt-6 text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
                {store.proShopDetails.description}
              </p>
            )}
          </div>
        </div>

        {/* Store Products */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              Tous les produits de {store.storeName || store.name}
            </h2>
            {/* Filters placeholder */}
            <select className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-[#FF4D20] focus:border-[#FF4D20] block p-2.5 outline-none font-medium">
              <option>Plus récents</option>
              <option>Prix croissant</option>
              <option>Prix décroissant</option>
            </select>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Aucun produit</h3>
              <p className="text-gray-500 mt-2">Cette boutique n'a pas encore publié de produits.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
