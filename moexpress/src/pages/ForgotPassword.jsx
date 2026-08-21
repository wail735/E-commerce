import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, ArrowRight, Loader } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });

      if (response.data.success) {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
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
    <div className="min-h-[calc(100vh-70px)] bg-gray-50 dark:bg-[#0B1120] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1e293b] rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center mb-4 text-[#FF4D20]">
            <Mail size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Mot de passe oublié ?</h1>
          <p className="text-gray-500 dark:text-gray-400 text-center mt-2 text-sm">
            Entrez l'adresse email associée à votre compte et nous vous enverrons un code pour réinitialiser votre mot de passe.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 text-red-500 text-sm p-3 rounded-xl mb-6 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Adresse Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="votre@email.com"
              className="appearance-none block w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF4D20]/20 focus:border-[#FF4D20] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF4D20] hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : 'Envoyer le code'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          Vous vous souvenez de votre mot de passe ?{' '}
          <Link to="/login" className="text-[#FF4D20] font-bold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
