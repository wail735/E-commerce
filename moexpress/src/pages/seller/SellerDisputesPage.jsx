import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import axios from 'axios';
import { Scale, Loader2, AlertCircle, CheckCircle, Search, MessageSquare } from 'lucide-react';

export default function SellerDisputesPage() {
  const { token } = useAuth();
  const { t, language } = useLanguage();
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  useEffect(() => {
    fetchDisputes();
  }, [token]);

  const fetchDisputes = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/v1/disputes/my-disputes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDisputes(res.data.data || []);
    } catch (err) {
      console.error("Erreur lors de la récupération des litiges:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <span className="px-3 py-1 bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400 font-bold rounded-lg text-xs uppercase tracking-wider flex items-center gap-1 w-max"><AlertCircle size={12}/> {t('status_open') || 'Ouvert'}</span>;
      case 'under_review':
        return <span className="px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold rounded-lg text-xs uppercase tracking-wider flex items-center gap-1 w-max"><Loader2 size={12} className="animate-spin"/> En révision</span>;
      case 'resolved_refund':
      case 'resolved_seller_paid':
        return <span className="px-3 py-1 bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 font-bold rounded-lg text-xs uppercase tracking-wider flex items-center gap-1 w-max"><CheckCircle size={12}/> Résolu</span>;
      case 'closed':
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 font-bold rounded-lg text-xs uppercase tracking-wider flex items-center gap-1 w-max">Fermé</span>;
      default:
        return null;
    }
  };

  const handleReplySubmit = async (disputeId) => {
    if (!replyText[disputeId] || !replyText[disputeId].trim()) return;
    
    try {
      setSubmittingId(disputeId);
      await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/disputes/${disputeId}/seller-response`, 
        { responseText: replyText[disputeId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setReplyText(prev => ({...prev, [disputeId]: ''}));
      fetchDisputes();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Erreur');
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF4D20]" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center">
          <Scale className="text-red-500" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Centre de Litiges</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez les réclamations de vos clients et apportez vos preuves.</p>
        </div>
      </div>

      {disputes.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Scale className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Aucun litige en cours</h3>
          <p className="text-gray-500 dark:text-gray-400">Tout se passe à merveille pour vos commandes !</p>
        </div>
      ) : (
        <div className="space-y-6">
          {disputes.map((dispute) => (
            <div key={dispute._id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">ID Commande : #{ (dispute.order?._id || dispute.order)?.toString().slice(-8).toUpperCase() }</span>
                  <span className="text-xs text-gray-400">{new Date(dispute.createdAt).toLocaleString()}</span>
                </div>
                {getStatusBadge(dispute.status)}
              </div>
              
              <div className="mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border-l-4 border-red-500">
                  <p className="font-bold text-gray-900 dark:text-white mb-1">Motif: {t(`reason_${dispute.reason}`) || dispute.reason}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{dispute.description}</p>
                </div>
              </div>

              {dispute.sellerResponse ? (
                <div className="mb-6">
                  <div className="bg-orange-50 dark:bg-orange-500/10 rounded-xl p-4 border-l-4 border-[#FF4D20]">
                    <p className="font-bold text-[#FF4D20] text-xs uppercase tracking-wider mb-1">Votre Réponse</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{dispute.sellerResponse}</p>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Apporter une réponse ou une preuve :</label>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      value={replyText[dispute._id] || ''}
                      onChange={(e) => setReplyText({...replyText, [dispute._id]: e.target.value})}
                      placeholder="Expliquez la situation de votre point de vue..."
                      className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#FF4D20]"
                    />
                    <button 
                      onClick={() => handleReplySubmit(dispute._id)}
                      disabled={submittingId === dispute._id || !replyText[dispute._id]}
                      className="px-6 py-2.5 bg-[#FF4D20] text-white font-bold rounded-xl text-sm hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {submittingId === dispute._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare size={16} />}
                      Répondre
                    </button>
                  </div>
                </div>
              )}

              {dispute.adminDecision && (
                <div className="bg-gray-900 dark:bg-black rounded-xl p-4 border-l-4 border-blue-500 text-white">
                  <p className="font-bold text-blue-400 text-xs uppercase tracking-wider mb-1">Verdict de l'Admin</p>
                  <p className="text-sm">{dispute.adminDecision}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
