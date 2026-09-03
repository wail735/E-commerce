import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Store, Rocket, CheckCircle, ArrowRight, ArrowLeft,
  Package, TrendingUp, ShieldCheck, Loader2, Mail, RefreshCw
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Bienvenue' },
  { id: 2, title: 'Boutique' },
  { id: 3, title: 'Vérification' },
  { id: 4, title: 'Activé !' },
];

const benefits = [
  { icon: <Package size={20} />, text: 'Publiez vos produits en quelques minutes' },
  { icon: <TrendingUp size={20} />, text: 'Accédez à des milliers d\'acheteurs' },
  { icon: <ShieldCheck size={20} />, text: 'Paiements sécurisés et garantis' },
];

export default function SellerOnboarding() {
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  const [form, setForm] = useState({
    storeName: '',
    storeDescription: '',
    category: 'Électronique',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleNextToStep2 = () => {
    if (!form.storeName.trim()) {
      setError('Le nom de la boutique est obligatoire.');
      return;
    }
    setStep(3);
    sendOtp();
  };

  const sendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + '/api/v1/users/seller/send-otp',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOtpSent(true);
      
      // Auto-fill in dev mode if email wasn't configured
      if (res.data?.devOtp) {
        const digits = res.data.devOtp.split('');
        setOtp(digits);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi du code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Entrez le code à 6 chiffres.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(
        import.meta.env.VITE_API_URL + '/api/v1/users/seller/verify-otp',
        { otp: otpCode, storeName: form.storeName, storeDescription: form.storeDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateUser(data.data);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'Code invalide ou expiré.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] flex items-center justify-center p-4">
      <div className="w-full max-w-xl">

        {/* Stepper */}
        {step < 4 && (
          <div className="flex items-center justify-center mb-10">
            {STEPS.filter(s => s.id < 4).map((s, i, arr) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                    ${step > s.id ? 'bg-[#FF4D20] text-white' : step === s.id ? 'bg-[#FF4D20] text-white ring-4 ring-orange-200 dark:ring-orange-500/30' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                    {step > s.id ? <CheckCircle size={16} /> : s.id}
                  </div>
                  <span className={`text-xs mt-1 font-semibold hidden sm:block ${step >= s.id ? 'text-[#FF4D20]' : 'text-gray-400'}`}>
                    {s.title}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div className={`flex-1 h-1 rounded-full max-w-[60px] mx-1 transition-all duration-500 ${step > s.id ? 'bg-[#FF4D20]' : 'bg-gray-200 dark:bg-gray-700'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">

          {/* ─── Étape 1 : Bienvenue ─── */}
          {step === 1 && (
            <>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-10 text-center relative overflow-hidden">
                <div className="absolute inset-0">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#FF4D20] opacity-10 blur-3xl rounded-full" />
                </div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-[#FF4D20] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-orange-500/40">
                    <Store size={36} className="text-white" />
                  </div>
                  <h1 className="text-3xl font-black text-white mb-1">Devenir Vendeur</h1>
                  <p className="text-gray-400">sur <span className="text-[#FF4D20] font-bold">MoExpress Marketplace</span></p>
                </div>
              </div>
              <div className="p-8">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 text-center">Pourquoi vendre sur MoExpress ?</h2>
                <div className="space-y-3 mb-8">
                  {benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-[#FF4D20]/10 rounded-xl">
                      <div className="text-[#FF4D20]">{b.icon}</div>
                      <span className="text-gray-800 dark:text-gray-200 font-medium text-sm">{b.text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => navigate(-1)} className="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Retour
                  </button>
                  <button onClick={() => setStep(2)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FF4D20] text-white font-bold shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-colors">
                    Commencer <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ─── Étape 2 : Infos Boutique ─── */}
          {step === 2 && (
            <div className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Créez votre boutique</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Ces infos seront visibles par vos acheteurs</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nom de la boutique <span className="text-red-500">*</span></label>
                  <input type="text" name="storeName" value={form.storeName} onChange={handleChange}
                    placeholder="Ex: TechZone Store, Fashion Boutique..."
                    className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-[#FF4D20] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Catégorie principale</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-[#FF4D20] transition-colors">
                    {['Électronique','Mode & Vêtements','Maison & Décoration','Sport & Loisirs','Beauté & Santé','Alimentation','Autre'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description (optionnel)</label>
                  <textarea name="storeDescription" value={form.storeDescription} onChange={handleChange} rows="3"
                    placeholder="Décrivez ce que vous vendez..."
                    className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-[#FF4D20] transition-colors resize-none" />
                </div>
                {error && <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm">{error}</div>}
              </div>
              <div className="flex gap-3 mt-7">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <ArrowLeft size={18} />
                </button>
                <button onClick={handleNextToStep2} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FF4D20] text-white font-bold shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-colors">
                  Envoyer le code <Mail size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ─── Étape 3 : Vérification Email ─── */}
          {step === 3 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-500/20 text-[#FF4D20] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={28} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Vérifiez votre email</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  Un code à 6 chiffres a été envoyé à<br />
                  <span className="font-bold text-gray-900 dark:text-white">{user?.email}</span>
                </p>
              </div>

              {loading && !otpSent ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={32} className="animate-spin text-[#FF4D20]" />
                </div>
              ) : (
                <>
                  {/* OTP Input */}
                  <div className="flex justify-center gap-3 mb-6">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => otpRefs.current[i] = el}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        className="w-12 h-14 text-center text-2xl font-black border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-[#FF4D20] transition-colors"
                      />
                    ))}
                  </div>

                  {error && <div className="p-3 mb-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm text-center">{error}</div>}

                  <button onClick={handleVerify} disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FF4D20] text-white font-bold shadow-lg shadow-orange-500/30 hover:bg-orange-600 disabled:opacity-60 transition-colors mb-4">
                    {loading ? <><Loader2 size={18} className="animate-spin" /> Vérification...</> : <><Rocket size={18} /> Activer ma boutique</>}
                  </button>

                  <button onClick={sendOtp} disabled={loading} className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-[#FF4D20] transition-colors">
                    <RefreshCw size={14} /> Renvoyer le code
                  </button>
                </>
              )}
            </div>
          )}

          {/* ─── Étape 4 : Succès ─── */}
          {step === 4 && (
            <div className="p-10 text-center">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle size={48} className="text-green-500" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">🎉 Félicitations !</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                Votre boutique <span className="text-[#FF4D20] font-bold">"{form.storeName}"</span> est active !
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-8">
                Commencez à ajouter vos produits et générez vos premières ventes.
              </p>
              <button onClick={() => navigate('/seller/dashboard')}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#FF4D20] text-white font-black text-lg shadow-xl shadow-orange-500/30 hover:bg-orange-600 transition-colors">
                <Store size={22} /> Accéder à mon Seller Center
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
