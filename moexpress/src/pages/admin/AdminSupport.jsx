import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Headphones, Loader2, MessageSquare, Send } from 'lucide-react';

export default function AdminSupport() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [replyingId, setReplyingId] = useState(null);
  const [responseMsg, setResponseMsg] = useState('');
  const [status, setStatus] = useState('in_progress');

  useEffect(() => {
    fetchTickets();
  }, [token]);

  const fetchTickets = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/v1/support/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(res.data.data.tickets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (ticketId) => {
    if (!responseMsg) return alert("Veuillez rédiger une réponse.");
    try {
      setReplyingId(ticketId);
      await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/support/ticket/${ticketId}/reply`, 
        { response: responseMsg, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Réponse envoyée avec succès !");
      setResponseMsg('');
      fetchTickets();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de l'envoi de la réponse");
    } finally {
      setReplyingId(null);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
          <Headphones className="text-blue-500" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Support Client (Admin)</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez les demandes d'assistance des utilisateurs.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF4D20]" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Aucun ticket</h2>
          <p className="text-gray-500 dark:text-gray-400">Toutes les demandes ont été traitées !</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {tickets.map(ticket => (
            <div key={ticket._id} className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Ticket #{ticket._id.slice(-8).toUpperCase()} - {ticket.subject}</h3>
                  <p className="text-xs text-gray-500">
                    Par {ticket.user?.name} ({ticket.user?.email}) le {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                  ticket.status === 'open' ? 'bg-yellow-50 text-yellow-600' :
                  ticket.status === 'in_progress' ? 'bg-blue-50 text-blue-600' :
                  'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {ticket.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Message du client */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Message du Client</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{ticket.message}</p>
                </div>

                {/* Réponse de l'admin existante */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <h4 className="font-bold text-blue-900 dark:text-blue-400 text-sm mb-3">Réponse du Support</h4>
                  {ticket.adminResponse ? (
                    <p className="text-sm text-blue-800 dark:text-blue-300 whitespace-pre-wrap">{ticket.adminResponse}</p>
                  ) : (
                    <p className="text-sm text-blue-400 italic">Aucune réponse apportée pour le moment.</p>
                  )}
                </div>
              </div>

              {/* Formulaire de réponse (visible si non fermé) */}
              {ticket.status !== 'closed' && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-4 flex items-center gap-2">
                    <Send size={16} className="text-[#FF4D20]" />
                    Envoyer une réponse
                  </h4>
                  <div className="flex flex-col gap-4">
                    <textarea 
                      placeholder="Tapez votre réponse ici..."
                      value={responseMsg}
                      onChange={e => setResponseMsg(e.target.value)}
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-[#FF4D20]"
                    />
                    <div className="flex gap-4 items-center justify-end">
                      <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none"
                      >
                        <option value="in_progress">En cours (Garder ouvert)</option>
                        <option value="resolved">Résolu</option>
                        <option value="closed">Clôturer le ticket</option>
                      </select>
                      <button
                        onClick={() => handleReply(ticket._id)}
                        disabled={replyingId === ticket._id || !responseMsg}
                        className="px-6 py-2.5 bg-[#FF4D20] text-white font-bold rounded-xl text-sm hover:bg-[#E6451C] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {replyingId === ticket._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={16} />}
                        Envoyer
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
