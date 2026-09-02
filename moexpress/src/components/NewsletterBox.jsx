import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Send, Loader2, CheckCircle } from 'lucide-react';

export default function NewsletterBox() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error', null
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/api/v1/newsletter/subscribe', { email });
      setStatus('success');
      setMessage(res.data.message || 'Inscription réussie !');
      setEmail('');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage(err.response?.data?.message || 'Erreur lors de l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#FF4D20] to-[#FF7A00] rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm font-bold backdrop-blur-sm mb-4">
            <Mail size={16} />
            Restez Connecté
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">Ne manquez aucune de nos offres exclusives !</h2>
          <p className="text-white/80 text-lg">Inscrivez-vous à notre newsletter pour recevoir nos promotions, nouveautés et conseils directement dans votre boîte mail.</p>
        </div>

        <div>
          {status === 'success' ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20">
              <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Merci pour votre inscription !</h3>
              <p className="text-white/80">{message}</p>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20">
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-2">Votre adresse email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="text-gray-400" size={20} />
                    </div>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-4 rounded-xl border-none bg-white text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all font-medium placeholder:text-gray-400"
                      placeholder="vous@exemple.com"
                    />
                  </div>
                </div>
                
                {status === 'error' && (
                  <p className="text-sm font-bold text-red-200 bg-red-900/30 px-4 py-2 rounded-lg">{message}</p>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-95 shadow-lg disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={20} />}
                  Je m'abonne
                </button>
                <p className="text-xs text-center text-white/60 mt-4">
                  En vous inscrivant, vous acceptez notre politique de confidentialité. Vous pouvez vous désabonner à tout moment.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
