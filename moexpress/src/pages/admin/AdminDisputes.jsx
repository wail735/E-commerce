import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Scale, Loader2, Search, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminDisputes() {
  const { token } = useAuth();
  const { t } = useLanguage();
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [arbitratingId, setArbitratingId] = useState(null);
  
  const [decisionForm, setDecisionForm] = useState({
    status: 'resolved_refund',
    decision: ''
  });

  useEffect(() => {
    fetchDisputes();
  }, [token]);

  const fetchDisputes = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/v1/disputes/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDisputes(res.data.data.disputes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleArbitrate = async (disputeId) => {
    if (!decisionForm.decision) return alert("Veuillez rédiger le verdict.");
    try {
      setArbitratingId(disputeId);
      await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/disputes/admin/${disputeId}/arbitrate`, 
        decisionForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Verdict rendu avec succès !");
      setDecisionForm({ status: 'resolved_refund', decision: '' });
      fetchDisputes();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de l'arbitrage");
    } finally {
      setArbitratingId(null);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center">
          <Scale className="text-red-500" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Administration des Litiges</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Arbitrez les conflits entre acheteurs et vendeurs.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF4D20]" />
        </div>
      ) : disputes.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
          <Scale className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Aucun litige</h2>
          <p className="text-gray-500 dark:text-gray-400">La plateforme est en paix totale.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {disputes.map(dispute => (
            <div key={dispute._id} className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Litige #{dispute._id.slice(-8).toUpperCase()}</h3>
                  <p className="text-xs text-gray-500">Ouvert le {new Date(dispute.createdAt).toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                  dispute.status === 'open' ? 'bg-yellow-50 text-yellow-600' :
                  dispute.status === 'under_review' ? 'bg-blue-50 text-blue-600' :
                  'bg-green-50 text-green-600'
                }`}>
                  {dispute.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Acheteur */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Plainte de l'Acheteur</h4>
                  <p className="text-xs font-semibold text-red-500 mb-1">Motif: {t(`reason_${dispute.reason}`) || dispute.reason}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{dispute.description}"</p>
                </div>

                {/* Vendeur */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Réponse du Vendeur</h4>
                  {dispute.sellerResponse ? (
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{dispute.sellerResponse}"</p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Le vendeur n'a pas encore répondu.</p>
                  )}
                </div>
              </div>

              {/* Action Admin */}
              {dispute.status !== 'resolved_refund' && dispute.status !== 'resolved_seller_paid' && dispute.status !== 'closed' ? (
                <div className="bg-[#FF4D20]/5 dark:bg-[#FF4D20]/10 border border-[#FF4D20]/20 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Rendre le Verdict (Arbitrage)</h4>
                  <div className="flex flex-col md:flex-row gap-4">
                    <select
                      value={decisionForm.status}
                      onChange={e => setDecisionForm({...decisionForm, status: e.target.value})}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium focus:outline-none focus:border-[#FF4D20]"
                    >
                      <option value="resolved_refund">Rembourser l'Acheteur (Coins)</option>
                      <option value="resolved_seller_paid">Payer le Vendeur (Rejet)</option>
                      <option value="closed">Fermer sans suite</option>
                    </select>
                    <input 
                      type="text"
                      placeholder="Justification du verdict..."
                      value={decisionForm.decision}
                      onChange={e => setDecisionForm({...decisionForm, decision: e.target.value})}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-[#FF4D20]"
                    />
                    <button
                      onClick={() => handleArbitrate(dispute._id)}
                      disabled={arbitratingId === dispute._id || !decisionForm.decision}
                      className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl text-sm hover:opacity-80 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {arbitratingId === dispute._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scale size={16} />}
                      Trancher
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
                  <h4 className="font-bold text-green-700 dark:text-green-400 text-sm mb-1">Verdict Rendu</h4>
                  <p className="text-sm text-green-600 dark:text-green-500 mb-2">Décision : {dispute.adminDecision}</p>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
