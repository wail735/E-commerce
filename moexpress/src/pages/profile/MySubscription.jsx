import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Check, Star, Zap, Shield, Loader2 } from 'lucide-react';

export default function MySubscription() {
  const { user, token, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get('session_id');
    const planName = query.get('planName');
    const canceled = query.get('canceled');

    if (canceled) {
      alert("Paiement annulé.");
      navigate('/profile/subscription', { replace: true });
    }

    if (sessionId && planName && !initialized.current) {
      if (!token) return; // Wait for token
      initialized.current = true;
      verifySubscriptionPayment(sessionId, planName);
    }
    
    if (token) {
      fetchPlans();
    }
  }, [token, location.search]);

  const verifySubscriptionPayment = async (sessionId, planName) => {
    setVerifying(true);
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/api/v1/payments/checkout/verify-subscription', 
        { session_id: sessionId, planName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const updatedSubscription = res.data.data.subscription;
      const isProShop = res.data.data.isProShop;
      
      if (user) {
        // Mettre à jour l'utilisateur localement
        login({ 
          ...user, 
          subscription: updatedSubscription,
          isProShop: user.isProShop || isProShop,
          role: isProShop ? 'seller' : user.role
        }, token);
      }

      alert("Félicitations ! Votre abonnement est activé.");
      navigate('/profile/subscription', { replace: true });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de la vérification de l'abonnement.");
      navigate('/profile/subscription', { replace: true });
    } finally {
      setVerifying(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/v1/subscriptions/plans');
      // Filtre les plans gratuits si nécessaire, on garde tout
      setPlans(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan) => {
    if (plan.price === 0) return; // Basic plan logic could be handled differently

    setProcessingPlan(plan.name);
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/api/v1/payments/checkout/subscription', 
        { planName: plan.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de l'initialisation du paiement.");
      setProcessingPlan(null);
    }
  };

  const currentPlanName = user?.subscription?.plan?.toLowerCase() || 'basic';
  const expiryDate = user?.subscription?.expiryDate ? new Date(user.subscription.expiryDate).toLocaleDateString() : null;

  if (loading || verifying) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900 dark:text-white" />
        {verifying && <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Validation de votre abonnement en cours...</p>}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Star className="w-6 h-6 text-gray-900 dark:text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Abonnements</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Passez au niveau supérieur et débloquez la Boutique Pro.</p>
        </div>
      </div>

      {user?.subscription && user?.subscription?.plan !== 'basic' && (
        <div className="p-6 bg-gray-900 dark:bg-white rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white dark:text-gray-900">
              Abonnement actuel : <span className="uppercase text-yellow-400 dark:text-orange-500">{currentPlanName}</span>
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Valable jusqu'au {expiryDate}
            </p>
          </div>
          {user?.isProShop && (
            <div className="flex items-center gap-2 bg-gray-800 dark:bg-gray-100 px-4 py-2 rounded-xl">
              <Shield size={16} className="text-green-400 dark:text-green-600" />
              <span className="text-sm font-semibold text-white dark:text-gray-900">Boutique Pro Active</span>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = currentPlanName === plan.name.toLowerCase();
          const isPopular = plan.name.toLowerCase() === 'pro';

          return (
            <div 
              key={plan.name} 
              className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300
                ${isPopular ? 'border-gray-900 dark:border-white shadow-xl scale-105 z-10' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-950'}
                ${isCurrent ? 'bg-gray-50 dark:bg-gray-900/50' : ''}
              `}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Zap size={12} /> Recommandé
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">{plan.name}</h3>
                <div className="mt-4 flex items-baseline text-gray-900 dark:text-white">
                  <span className="text-4xl font-extrabold tracking-tight">€{plan.price}</span>
                  <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">/mois</span>
                </div>
              </div>

              <ul className="flex-1 space-y-4 mb-8">
                {plan.features?.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-gray-900 dark:text-white shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
                {plan.noAds && (
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-gray-900 dark:text-white shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Navigation sans publicités</span>
                  </li>
                )}
                {plan.coinsBonus > 0 && (
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-gray-900 dark:text-white shrink-0" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">+{plan.coinsBonus} MoCoins offerts</span>
                  </li>
                )}
              </ul>

              <button
                disabled={isCurrent || processingPlan === plan.name || plan.price === 0}
                onClick={() => handleSubscribe(plan)}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2
                  ${isCurrent 
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' 
                    : isPopular 
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                      : 'bg-white dark:bg-gray-950 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white hover:text-gray-900'
                  }
                `}
              >
                {processingPlan === plan.name ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : isCurrent ? (
                  'Plan Actuel'
                ) : plan.price === 0 ? (
                  'Plan Gratuit'
                ) : (
                  'S\'abonner'
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
