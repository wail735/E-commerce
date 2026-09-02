import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Mail, MessageSquare, Loader2, Reply, CheckCircle } from 'lucide-react';

export default function AdminContact() {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/v1/contact/admin/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.data.messages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (msgId) => {
    if (!replyText) return alert("Veuillez rédiger une réponse.");
    try {
      setReplyingId(msgId);
      await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/contact/admin/${msgId}/reply`, 
        { adminResponse: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Réponse envoyée avec succès par email !");
      setReplyText('');
      fetchMessages(); // Refresh
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
        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center">
          <MessageSquare className="text-indigo-500" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Messages de Contact</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez les demandes reçues via la page de contact publique.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF4D20]" />
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-16 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Boîte de réception vide</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">Vous n'avez reçu aucun message pour le moment.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {messages.map(msg => (
            <div key={msg._id} className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${msg.status === 'replied' ? 'bg-green-500' : 'bg-yellow-400'}`}></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="pl-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{msg.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail size={14} />
                    <a href={`mailto:${msg.email}`} className="hover:text-[#FF4D20] transition-colors">{msg.email}</a>
                    <span className="text-gray-300 dark:text-gray-700">•</span>
                    <span>Reçu le {new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 ${
                  msg.status === 'replied' ? 'bg-green-50 text-green-600 border border-green-200 dark:border-green-900/50' :
                  'bg-yellow-50 text-yellow-600 border border-yellow-200 dark:border-yellow-900/50'
                }`}>
                  {msg.status === 'replied' ? 'Répondu' : 'En attente'}
                </span>
              </div>

              <div className="pl-2 space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 text-sm text-gray-700 dark:text-gray-300 leading-relaxed shadow-inner">
                  {msg.message}
                </div>

                {msg.status === 'replied' ? (
                  <div className="bg-green-50/50 dark:bg-green-500/5 p-5 rounded-2xl border border-green-100 dark:border-green-500/20 text-sm text-gray-800 dark:text-gray-200 shadow-sm">
                    <div className="text-xs font-bold text-green-600 dark:text-green-500 mb-2 uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle size={14} /> 
                      Votre Réponse
                    </div>
                    {msg.adminResponse}
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-4 flex items-center gap-2">
                      <Reply size={16} className="text-indigo-500" />
                      Répondre par email
                    </h4>
                    <div className="flex flex-col gap-4">
                      <textarea 
                        placeholder="Rédigez votre réponse. Elle sera envoyée directement par email au client..."
                        value={replyingId === msg._id ? replyText : ''}
                        onChange={e => {
                          if (replyingId !== msg._id) setReplyingId(msg._id);
                          setReplyText(e.target.value);
                        }}
                        rows="4"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleReply(msg._id)}
                          disabled={replyingId === msg._id && loading}
                          className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-md"
                        >
                          {replyingId === msg._id && loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={16} />}
                          Envoyer la réponse
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
