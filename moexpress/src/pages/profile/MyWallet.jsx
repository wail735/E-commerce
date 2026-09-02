import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Coins, CreditCard, ArrowUpRight, ArrowDownRight, Clock, Loader2, PlusCircle, CheckCircle } from 'lucide-react';

export default function MyWallet() {
  const { user, token, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [packages, setPackages] = useState([]);
  const [history, setHistory] = useState([]);
  const [balance, setBalance] = useState(user?.coins || 0);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    // Vérifier s'il y a un retour de Stripe
    const query = new URLSearchParams(location.search);
    const sessionId = query.get('session_id');
    const packageId = query.get('packageId');
    const canceled = query.get('canceled');

    if (canceled) {
      alert("Paiement annulé.");
      // Nettoyer l'URL
      navigate('/profile/wallet', { replace: true });
    }

    if (sessionId && packageId && !initialized.current) {
      if (!token) return; // Wait until token is loaded from Context
      initialized.current = true;
      verifyPayment(sessionId, packageId);
    }
    
    if (token) {
      fetchWalletData();
    }
  }, [token, location.search]);

  const verifyPayment = async (sessionId, packageId) => {
    setVerifying(true);
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/api/v1/payments/checkout/verify', 
        { session_id: sessionId, packageId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const newBalance = res.data.data.newBalance;
      setBalance(newBalance);
      
      if (user) {
        login({ ...user, coins: newBalance }, token);
      }

      alert("Paiement Stripe validé ! Vos MoCoins ont été ajoutés.");
      fetchWalletData(); // Refresh history
      
      // Nettoyer l'URL
      navigate('/profile/wallet', { replace: true });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de la vérification du paiement.");
      navigate('/profile/wallet', { replace: true });
    } finally {
      setVerifying(false);
    }
  };

  const fetchWalletData = async () => {
    try {
      const [pkgsRes, histRes] = await Promise.all([
        axios.get(import.meta.env.VITE_API_URL + '/api/v1/coins/packages'),
        axios.get(import.meta.env.VITE_API_URL + '/api/v1/coins/history', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setPackages(pkgsRes.data.data || []);
      setHistory(histRes.data.data || []);
      
      // Update local balance if backend history provides a more recent view, 
      // but actually we'll rely on the backend /auth/me if we had it. 
      // For now, we update it dynamically when buying.
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (pkg) => {
    setProcessingId(pkg.id);
    try {
      // Demander la création de la session Stripe
      const res = await axios.post(import.meta.env.VITE_API_URL + '/api/v1/payments/checkout/coins', 
        { packageId: pkg.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Redirection vers Stripe
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de l'initialisation du paiement.");
      setProcessingId(null);
    }
  };

  if (loading || verifying) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF4D20]" />
        {verifying && <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Validation du paiement Stripe en cours...</p>}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* En-tête minimalist */}
      <div className="bg-white dark:bg-[#0B1120] rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Solde de MoCoins</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tight">{balance}</span>
            <span className="text-xl font-bold text-gray-400">Coins</span>
          </div>
        </div>
        <button 
          onClick={() => document.getElementById('packages').scrollIntoView({ behavior: 'smooth' })}
          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors"
        >
          <PlusCircle size={18} />
          Recharger
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Packs d'achat */}
        <div id="packages" className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#0B1120] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Acheter des Coins</h3>
              <p className="text-sm text-gray-500 mt-1">Utilisez vos coins pour booster vos annonces et obtenir plus de visibilité.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packages.map(pkg => (
                <div key={pkg.id} className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[#FF4D20] dark:hover:border-[#FF4D20] transition-colors group bg-gray-50/50 dark:bg-[#111827]">
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-10 h-10 bg-orange-50 dark:bg-[#FF4D20]/10 rounded-full flex items-center justify-center text-[#FF4D20]">
                      <Coins size={20} />
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{pkg.priceEuros} €</span>
                  </div>
                  
                  <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-4">{pkg.coins} Coins</h4>
                  
                  <button 
                    onClick={() => handleBuy(pkg)}
                    disabled={processingId !== null}
                    className="w-full bg-white dark:bg-[#0B1120] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {processingId === pkg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Acheter"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Historique */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#0B1120] rounded-2xl border border-gray-100 dark:border-gray-800 h-full max-h-[600px] flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Transactions</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {history.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <p className="text-sm">Aucune transaction.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {history.map(tx => (
                    <div key={tx._id} className="p-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        tx.type === 'buy' || tx.type === 'bonus' 
                          ? 'bg-green-50 text-green-600 dark:bg-green-500/10' 
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800'
                      }`}>
                        {tx.type === 'buy' || tx.type === 'bonus' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {tx.type === 'buy' ? 'Recharge' : tx.type === 'spend' ? 'Dépense' : 'Bonus'}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{new Date(tx.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className={`text-sm font-bold ${
                        tx.type === 'buy' || tx.type === 'bonus' ? 'text-green-600 dark:text-green-500' : 'text-gray-900 dark:text-white'
                      }`}>
                        {tx.type === 'buy' || tx.type === 'bonus' ? '+' : '-'}{tx.amount}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
