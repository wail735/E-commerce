import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Mail, ArrowRight, Loader } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const VerifyOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const { t } = useLanguage();
  const { login } = useAuth();

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
    inputRefs.current[0]?.focus();
  }, [email, navigate]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return; // Seuls les chiffres sont autorisés

    const newOtp = [...otp];
    // Permet de coller le code complet (6 chiffres d'un coup)
    if (value.length > 1) {
      const pastedData = value.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || '';
      }
      setOtp(newOtp);
      // Focus le dernier input rempli ou le premier vide
      const lastIndex = pastedData.length < 6 ? pastedData.length : 5;
      inputRefs.current[lastIndex]?.focus();
      return;
    }

    // Gestion caractère par caractère
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus sur l'input suivant s'il y a une valeur
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Si on appuie sur Backspace et que la case est vide, on recule
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Veuillez entrer les 6 chiffres');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email,
        otp: otpCode
      });

      if (response.data.success) {
        // Succès ! On sauvegarde le token et on connecte l'utilisateur
        login(response.data.user, response.data.token);
        
        navigate('/'); // Rediriger vers l'accueil
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
            <Mail size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Vérifiez votre email</h1>
          <p className="text-gray-500 dark:text-gray-400 text-center mt-2 text-sm">
            Nous avons envoyé un code à 6 chiffres à<br/>
            <span className="font-semibold text-gray-700 dark:text-gray-200">{email}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 text-red-500 text-sm p-3 rounded-xl mb-6 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength={6} // Permet le collage de 6 chiffres d'un coup
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF4D20] focus:bg-white dark:focus:bg-gray-800 transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF4D20] hover:bg-orange-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : 'Vérifier'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          Vous n'avez pas reçu le code ?{' '}
          <button className="text-[#FF4D20] font-bold hover:underline">
            Renvoyer
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
