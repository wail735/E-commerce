import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Headphones, Plus, MessageSquare, Loader2, Send } from 'lucide-react';

export default function SupportPage() {
  const { token } = useAuth();
  const { t } = useLanguage();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', priority: 'medium', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [token]);

  const fetchTickets = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/v1/support/my-tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/api/v1/support/ticket', newTicket, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets([res.data.data, ...tickets]);
      setShowModal(false);
      setNewTicket({ subject: '', priority: 'medium', message: '' });
      alert("Ticket créé avec succès !");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de la création du ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#FF4D20]/10 to-transparent rounded-full -mr-32 -mt-32 blur-2xl pointer-events-none"></div>
        <div className="relative">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-3 rounded-xl bg-orange-50 dark:bg-[#FF4D20]/10">
              <Headphones className="text-[#FF4D20]" size={24} />
            </div>
            Support Client
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Besoin d'aide ? Notre équipe est là pour vous assister.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="relative bg-gradient-to-r from-[#FF4D20] to-[#FF7A00] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#FF4D20]/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Nouveau Ticket</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-[#FF4D20]" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-16 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aucun ticket en cours</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">Vous n'avez aucune demande d'assistance. Si vous rencontrez un problème, n'hésitez pas à nous contacter.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {tickets.map(ticket => (
            <div key={ticket._id} className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md group relative overflow-hidden">
              {/* Highlight bar based on status */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  ticket.status === 'open' ? 'bg-yellow-400' :
                  ticket.status === 'in_progress' ? 'bg-blue-500' :
                  ticket.status === 'resolved' ? 'bg-green-500' :
                  'bg-gray-300 dark:bg-gray-700'
                }`}></div>

              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div className="pl-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-[#FF4D20] transition-colors">{ticket.subject}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-medium">
                    <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-gray-600 dark:text-gray-300">#{ticket._id.slice(-8).toUpperCase()}</span>
                    <span>Ouvert le {new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 ${
                  ticket.status === 'open' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200 dark:border-yellow-900/50 dark:bg-yellow-500/10 dark:text-yellow-400' :
                  ticket.status === 'in_progress' ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:border-blue-900/50 dark:bg-blue-500/10 dark:text-blue-400' :
                  ticket.status === 'resolved' ? 'bg-green-50 text-green-600 border border-green-200 dark:border-green-900/50 dark:bg-green-500/10 dark:text-green-400' :
                  'bg-gray-50 text-gray-500 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {ticket.status}
                </span>
              </div>
              
              <div className="space-y-4 pl-2">
                <div className="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 text-sm text-gray-700 dark:text-gray-300 leading-relaxed shadow-inner">
                  <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Votre Message</div>
                  {ticket.message}
                </div>
                
                {ticket.adminResponse && (
                  <div className="bg-orange-50/50 dark:bg-[#FF4D20]/5 p-5 rounded-2xl border border-orange-100 dark:border-[#FF4D20]/20 text-sm text-gray-800 dark:text-gray-200 leading-relaxed shadow-sm">
                    <div className="text-xs font-bold text-[#FF4D20] mb-2 uppercase tracking-wider flex items-center gap-2">
                      <Headphones size={14} /> 
                      Réponse de l'Équipe
                    </div>
                    {ticket.adminResponse}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Création Ticket */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111827] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
              <h3 className="font-black text-xl text-gray-900 dark:text-white flex items-center gap-2">
                <Headphones size={20} className="text-[#FF4D20]" />
                Ouvrir un ticket
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleCreateTicket} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Sujet de la demande</label>
                <input 
                  type="text" 
                  required
                  value={newTicket.subject}
                  onChange={e => setNewTicket({...newTicket, subject: e.target.value})}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:border-[#FF4D20] focus:ring-4 focus:ring-[#FF4D20]/10 transition-all font-medium"
                  placeholder="Ex: Problème de connexion, Question sur ma commande..."
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Priorité</label>
                  <select 
                    value={newTicket.priority}
                    onChange={e => setNewTicket({...newTicket, priority: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:border-[#FF4D20] focus:ring-4 focus:ring-[#FF4D20]/10 transition-all font-medium cursor-pointer"
                  >
                    <option value="low">🟢 Faible (Question générale)</option>
                    <option value="medium">🟡 Moyenne (Besoin d'aide)</option>
                    <option value="high">🔴 Haute (Problème bloquant)</option>
                    <option value="urgent">🚨 Urgent (Critique)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Message détaillé</label>
                <textarea 
                  required
                  rows="5"
                  value={newTicket.message}
                  onChange={e => setNewTicket({...newTicket, message: e.target.value})}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:border-[#FF4D20] focus:ring-4 focus:ring-[#FF4D20]/10 transition-all resize-none"
                  placeholder="Expliquez-nous votre problème en détail pour que nous puissions vous aider efficacement..."
                ></textarea>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-[#FF4D20] to-[#FF7A00] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#FF4D20]/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 text-lg"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={20} />}
                  Envoyer la demande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
