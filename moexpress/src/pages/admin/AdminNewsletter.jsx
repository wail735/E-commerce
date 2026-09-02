import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Mail, Users, Send, Loader2, Search } from 'lucide-react';

export default function AdminNewsletter() {
  const { token } = useAuth();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, [token]);

  const fetchSubscribers = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/v1/newsletter/admin/subscribers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscribers(res.data.data.subscribers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCampaign = async (e) => {
    e.preventDefault();
    if (!subject || !content) return alert("Veuillez remplir le sujet et le message.");
    
    if (!window.confirm(`Êtes-vous sûr de vouloir envoyer cet email à ${subscribers.length} abonnés ?`)) return;

    setSending(true);
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/api/v1/newsletter/admin/send-campaign', 
        { subject, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Campagne envoyée avec succès !");
      setSubject('');
      setContent('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de l'envoi de la campagne");
    } finally {
      setSending(false);
    }
  };

  const filteredSubs = subscribers.filter(sub => sub.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-pink-50 dark:bg-pink-500/10 rounded-xl flex items-center justify-center">
          <Mail className="text-pink-500" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Newsletter & Abonnés</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez votre base d'abonnés et envoyez des campagnes email.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Abonnés (Left Column) */}
        <div className="lg:col-span-1 bg-white dark:bg-[#111827] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col max-h-[600px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users size={20} className="text-gray-400" />
              Abonnés ({subscribers.length})
            </h2>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher un email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-pink-500" /></div>
            ) : filteredSubs.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-10">Aucun abonné trouvé.</p>
            ) : (
              filteredSubs.map(sub => (
                <div key={sub._id} className="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700 flex justify-between items-center group">
                  <div className="truncate">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{sub.email}</p>
                    <p className="text-xs text-gray-500">Inscrit le {new Date(sub.createdAt).toLocaleDateString()}</p>
                  </div>
                  {sub.isActive ? (
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Campagne (Right Column) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-500/10 to-transparent rounded-full -mr-32 -mt-32 blur-2xl pointer-events-none"></div>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 relative">
            <Send size={20} className="text-pink-500" />
            Envoyer une Campagne Email
          </h2>

          <form onSubmit={handleSendCampaign} className="space-y-6 relative">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Sujet de l'email</label>
              <input 
                type="text" 
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all font-medium"
                placeholder="Ex: Soldes d'Été : Jusqu'à -50% !"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Contenu de l'email (HTML autorisé)</label>
              <textarea 
                required
                rows="10"
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all font-mono text-sm resize-y"
                placeholder="<h1>Bonjour,</h1><p>Voici nos dernières offres...</p>"
              ></textarea>
              <p className="text-xs text-gray-500 mt-2">Vous pouvez utiliser des balises HTML basiques pour formater votre email.</p>
            </div>

            <button 
              type="submit" 
              disabled={sending || subscribers.length === 0}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-pink-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 text-lg"
            >
              {sending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send size={20} />}
              Envoyer à {subscribers.length} abonnés
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
