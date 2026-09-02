import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import axios from 'axios';
import { Scale, Loader2, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyDisputes() {
  const { token } = useAuth();
  const { t, language } = useLanguage();
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchDisputes();
  }, [token]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <span className="px-3 py-1 bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400 font-bold rounded-lg text-xs uppercase tracking-wider flex items-center gap-1 w-max"><AlertCircle size={12}/> {t('status_open')}</span>;
      case 'under_review':
        return <span className="px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold rounded-lg text-xs uppercase tracking-wider flex items-center gap-1 w-max"><Loader2 size={12} className="animate-spin"/> {t('status_under_review')}</span>;
      case 'resolved_refund':
      case 'resolved_seller_paid':
        return <span className="px-3 py-1 bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 font-bold rounded-lg text-xs uppercase tracking-wider flex items-center gap-1 w-max"><CheckCircle size={12}/> {status === 'resolved_refund' ? t('status_resolved_refund') : t('status_resolved_seller_paid')}</span>;
      case 'closed':
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 font-bold rounded-lg text-xs uppercase tracking-wider flex items-center gap-1 w-max">{t('status_closed')}</span>;
      default:
        return null;
    }
  };

  const getReasonLabel = (reason) => {
    return t(`reason_${reason}`) || reason;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF4D20]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
          <Scale className="text-[#FF4D20]" />
          {t('my_disputes')}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Suivez l'état d'avancement de vos litiges ouverts avec les vendeurs.
        </p>
      </div>

      {disputes.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Scale className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('no_disputes')}</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map((dispute) => (
            <div key={dispute._id} className="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4 transition-all hover:border-[#FF4D20]/30 hover:shadow-lg hover:shadow-[#FF4D20]/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date: {new Date(dispute.createdAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</p>
                  <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Commande #{dispute.order?._id?.slice(-8).toUpperCase() || dispute.order?.slice(-8).toUpperCase()}
                  </p>
                </div>
                {getStatusBadge(dispute.status)}
              </div>
              
              <div>
                <p className="font-bold text-red-500 mb-1">{getReasonLabel(dispute.reason)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{dispute.description}</p>
              </div>

              {(dispute.sellerResponse || dispute.adminDecision) && (
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl mt-2 space-y-4">
                  {dispute.sellerResponse && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('seller_response')}</p>
                      <p className="text-sm text-gray-800 dark:text-gray-300">{dispute.sellerResponse}</p>
                    </div>
                  )}
                  {dispute.adminDecision && (
                    <div className="border-t border-gray-200 dark:border-gray-800 pt-3">
                      <p className="text-xs font-bold text-[#FF4D20] uppercase tracking-wider mb-1 flex items-center gap-1"><Scale size={12}/> {t('admin_decision')}</p>
                      <p className="text-sm text-gray-800 dark:text-gray-300 font-medium">{dispute.adminDecision}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
