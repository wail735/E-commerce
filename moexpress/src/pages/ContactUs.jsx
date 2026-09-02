import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Send, Loader2, MapPin, Phone, MessageSquare } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/api/v1/contact', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de l'envoi du message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">Contactez-nous</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Une question ? Un problème ? N'hésitez pas à nous écrire. Notre équipe vous répondra dans les plus brefs délais.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-[#111827] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-[#FF4D20]/10 flex items-center justify-center shrink-0">
                <Mail className="text-[#FF4D20]" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Email</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">support@moexpress.com</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">contact@moexpress.com</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#111827] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                <Phone className="text-blue-500" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Téléphone</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">+213 554 52 02 34</p>
                <p className="text-xs text-gray-400 mt-1">Lun-Sam, 9h-21h</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#111827] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center shrink-0">
                <MapPin className="text-green-500" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Adresse</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">12, Rue Larbi Ben M'hidi</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">31000, Oran, Algérie</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#111827] p-8 md:p-12 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#FF4D20]/10 to-transparent rounded-full -mr-32 -mt-32 blur-2xl pointer-events-none"></div>
              
              <div className="flex items-center gap-3 mb-8 relative">
                <MessageSquare className="text-[#FF4D20]" size={28} />
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Envoyez-nous un message</h2>
              </div>

              {success ? (
                <div className="bg-green-50 border border-green-200 text-green-700 dark:bg-green-500/10 dark:border-green-500/30 dark:text-green-400 p-6 rounded-2xl flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <Send className="text-green-500" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Message Envoyé !</h3>
                  <p>Merci de nous avoir contacté. Nous reviendrons vers vous rapidement.</p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="mt-6 px-6 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Votre Nom</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-[#FF4D20] focus:ring-4 focus:ring-[#FF4D20]/10 transition-all font-medium"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Adresse Email</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-[#FF4D20] focus:ring-4 focus:ring-[#FF4D20]/10 transition-all font-medium"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Votre Message</label>
                    <textarea 
                      required
                      rows="6"
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-[#FF4D20] focus:ring-4 focus:ring-[#FF4D20]/10 transition-all resize-none"
                      placeholder="Comment pouvons-nous vous aider ?"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#FF4D20] to-[#FF7A00] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#FF4D20]/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 text-lg"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send size={20} />}
                    Envoyer le message
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
