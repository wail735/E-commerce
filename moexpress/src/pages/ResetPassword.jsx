import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Lock, ArrowRight, Loader } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ResetPassword = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const { t } = useLanguage();

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
    inputRefs.current[0]?.focus();
  }, [email, navigate]);

  const handleChangeOtp = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    if (value.length > 1) {
      const pastedData = value.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || '';
      }
      setOtp(newOtp);
      const lastIndex = pastedData.length < 6 ? pastedData.length : 5;
      inputRefs.current[lastIndex]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDownOtp = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Veuillez entrer les 6 chiffres du code');
      return;
    }

    if (newPassword.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email,
        otp: otpCode,
        newPassword
      });

      if (response.data.success) {
        // Rediriger vers la page de login après le succès
        navigate('/login?reset=success');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Erreur de connexion au serveur');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1e293b] rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center mb-4 text-[#FF4D20]">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Nouveau mot de passe</h1>
          <p className="text-gray-500 dark:text-gray-400 text-center mt-2 text-sm">
            Entrez le code à 6 chiffres reçu sur <span className="font-semibold text-gray-700 dark:text-gray-200">{email}</span> et choisissez votre nouveau mot de passe.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 text-red-500 text-sm p-3 rounded-xl mb-6 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
              Code de vérification (OTP)
            </label>
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleChangeOtp(index, e)}
                  onKeyDown={(e) => handleKeyDownOtp(index, e)}
                  className="w-12 h-14 text-center text-xl font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF4D20] focus:bg-white dark:focus:bg-gray-800 transition-all"
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Minimum 6 caractères"
              className="appearance-none block w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF4D20]/20 focus:border-[#FF4D20] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF4D20] hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : 'Réinitialiser'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
