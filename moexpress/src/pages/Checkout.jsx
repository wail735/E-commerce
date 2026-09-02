import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CreditCard, Wallet, Lock, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';

// Initialize Stripe
const stripePromise = loadStripe("pk_test_51U2t8g2LJF94QbJAnBVTOOjy6vkCw2atDrIP1G9hLGo9OFhYWmtWv7QcPf7IbZdegHl8Rlg6YcyQvE6X3Tm8cl0900GDaeqTzi");

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { token, user } = useAuth();
  const { t } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [clientSecret, setClientSecret] = useState("");
  
  const shippingCost = cartTotal > 0 ? 15.00 : 0;
  const finalTotal = cartTotal + shippingCost;

  React.useEffect(() => {
    if (finalTotal > 0 && token) {
      axios.post(import.meta.env.VITE_API_URL + "/api/v1/payments/create-intent", 
        { amount: finalTotal },
        { headers: { Authorization: `Bearer ${token}` } }
      ).then(res => {
        setClientSecret(res.data.clientSecret);
      }).catch(err => {
        console.error("Error creating payment intent", err);
      });
    }
  }, [finalTotal, token]);
  
  const [data, setData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    cardNumber: "",
    expirationDate: "",
    securityCode: "",
    nameOnCard: "",
    offers: false,
  });

  const handleChange = (e)=>{
    const {name, value, type, checked} = e.target;
    setData(prev => ({...prev, [name]: type === "checkbox" ? checked : value}));
    // Clear error for the field being typed in
    if(errors[name]) setErrors(prev => ({...prev, [name]: null}));
  }



  // Handle successful Stripe payment
  const handleStripeSuccess = async (stripe, elements) => {
    // 0. Validate Form
    const newErrors = {};
    if (!data.email) newErrors.email = "Email is required";
    if (!data.firstName) newErrors.firstName = "First name is required";
    if (!data.lastName) newErrors.lastName = "Last name is required";
    if (!data.address) newErrors.address = "Address is required";
    if (!data.city) newErrors.city = "City is required";
    if (!data.postalCode) newErrors.postalCode = "Postal code is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsProcessing(false); // Stop processing state
      return;
    }

    try {
      // 1. Create Order in backend
      const orderPayload = {
        paymentMethod: 'card',
        shippingAddress: {
          street: data.address,
          city: data.city,
          zipCode: data.postalCode,
          country: 'FR'
        }
      };

      const orderResponse = await axios.post(import.meta.env.VITE_API_URL + "/api/v1/orders", orderPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 2. Confirm payment with Stripe
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/profile/orders`, // Redirection after 3D Secure
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        setErrors({ general: confirmError.message });
        setIsProcessing(false);
        return;
      }

      setIsSuccess(true);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error(err);
      setErrors({ general: err.response?.data?.message || err.message });
      setIsProcessing(false);
    }
  };

  const handleCheckout = () => {
    // Basic Validation
    const newErrors = {};
    if (!data.email) newErrors.email = "Email is required";
    if (!data.firstName) newErrors.firstName = "First name is required";
    if (!data.lastName) newErrors.lastName = "Last name is required";
    if (!data.address) newErrors.address = "Address is required";
    if (!data.city) newErrors.city = "City is required";
    if (!data.postalCode) newErrors.postalCode = "Postal code is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const processCheckout = async () => {
      try {
        setIsProcessing(true);
        // If payment method is credit card, we let the CheckoutForm handle the stripe elements.submit()
        // Here we only validate the form.
        if (paymentMethod === 'credit-card') {
          // Trigger form submission via CheckoutForm (which handles Elements)
          // Actually, we moved the Stripe submit logic inside CheckoutForm.
          // So if they click the button in CheckoutForm, handleStripeSuccess will be called.
          // This handleCheckout is for other methods (like paypal).
        } else {
          // PayPal or others
          const orderPayload = {
            paymentMethod: paymentMethod,
            shippingAddress: {
              street: data.address,
              city: data.city,
              zipCode: data.postalCode,
              country: 'FR' // Default country
            }
          };

          await axios.post(import.meta.env.VITE_API_URL + "/api/v1/orders", orderPayload, {
            headers: { Authorization: `Bearer ${token}` }
          });

          setIsSuccess(true);
          clearCart();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (err) {
        console.error(err);
        setErrors({ general: err.response?.data?.message || err.message });
      } finally {
        setIsProcessing(false);
      }
    };

    if (paymentMethod !== 'credit-card') {
      processCheckout();
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0B1120] transition-colors duration-300 px-4 py-20">
        <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">{t('order_confirmed')}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            {t('thank_you_purchase')}, {data.firstName}. {t('order_placed_success')} 
            {t('email_confirmation')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/profile/orders" className="px-8 py-3.5 bg-gray-900 dark:bg-gray-700 text-white font-bold rounded-xl hover:bg-black dark:hover:bg-gray-600 transition-colors">
              {t('view_order')}
            </Link>
            <Link to="/" className="px-8 py-3.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              {t('continue_shopping')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] transition-colors duration-300 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/cart" className="hover:text-[#FF4D20] transition-colors">{t('my_cart')}</Link>
          <ChevronRight size={16} />
          <span className="text-gray-900 dark:text-white font-medium">{t('checkout')}</span>
        </nav>

        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8">{t('checkout')}</h1>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <div className="w-full lg:w-2/3 space-y-6">
            
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl flex items-start gap-3">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm mb-1">{t('fix_errors')}</p>
                  <ul className="list-disc list-inside text-xs space-y-1">
                    {Object.values(errors).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('contact_info')}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t('email_address')}</label>
                  <input 
                    type="email" 
                    name='email'
                    onChange={handleChange}
                    value={data.email}
                    placeholder={t('enter_email')}
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 transition-all ${errors.email ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200 dark:border-gray-700 focus:border-[#FF4D20] focus:ring-orange-500/10'}`}
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer w-max mt-2">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#FF4D20] focus:ring-[#FF4D20]" 
                  name='offers'
                  onChange={handleChange}
                  checked={data.offers}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('email_news_offers')}</span>
                </label>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('shipping_address')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t('first_name')}</label>
                  <input 
                    name='firstName'
                    onChange={handleChange}
                    value={data.firstName}
                    type="text" 
                    placeholder={t('enter_first_name')}
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 transition-all ${errors.firstName ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200 dark:border-gray-700 focus:border-[#FF4D20] focus:ring-orange-500/10'}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t('last_name')}</label>
                  <input 
                    name='lastName'
                    onChange={handleChange}
                    value={data.lastName}
                    type="text" 
                    placeholder={t('enter_last_name')}
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 transition-all ${errors.lastName ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200 dark:border-gray-700 focus:border-[#FF4D20] focus:ring-orange-500/10'}`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t('address')}</label>
                  <input 
                    name='address'
                    onChange={handleChange}
                    value={data.address}
                    type="text" 
                    placeholder={t('enter_address')}
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 transition-all ${errors.address ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200 dark:border-gray-700 focus:border-[#FF4D20] focus:ring-orange-500/10'}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t('city')}</label>
                  <input 
                    name='city'
                    onChange={handleChange}
                    value={data.city}
                    type="text" 
                    placeholder={t('enter_city')}
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 transition-all ${errors.city ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200 dark:border-gray-700 focus:border-[#FF4D20] focus:ring-orange-500/10'}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t('postal_code')}</label>
                  <input 
                    name='postalCode'
                    onChange={handleChange}
                    value={data.postalCode}
                    type="text" 
                    placeholder={t('enter_postal_code')}
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 transition-all ${errors.postalCode ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200 dark:border-gray-700 focus:border-[#FF4D20] focus:ring-orange-500/10'}`}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('payment')}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('secure_transactions')}</p>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                {errors.general && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium border-b border-red-100 dark:border-red-800">
                    {errors.general}
                  </div>
                )}
                
                <div 
                  className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${paymentMethod === 'credit-card' ? 'bg-orange-50/50 dark:bg-orange-500/10' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                  onClick={() => setPaymentMethod('credit-card')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'credit-card' ? 'border-[#FF4D20]' : 'border-gray-300 dark:border-gray-600'}`}>
                      {paymentMethod === 'credit-card' && <div className="w-2.5 h-2.5 bg-[#FF4D20] rounded-full"></div>}
                    </div>
                    <CreditCard size={20} className={paymentMethod === 'credit-card' ? 'text-[#FF4D20]' : 'text-gray-500 dark:text-gray-400'} />
                    <span className={`font-semibold ${paymentMethod === 'credit-card' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{t('credit_card')}</span>
                  </div>
                </div>
                
                {paymentMethod === 'credit-card' && (
                  <div className="p-6 bg-white dark:bg-gray-800 space-y-4">
                    <div className="flex justify-center space-x-3 mb-6">
                      <div className="w-10 h-6 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-[10px] font-bold text-gray-800 dark:text-gray-200">VISA</div>
                      <div className="w-10 h-6 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-[10px] font-bold text-gray-800 dark:text-gray-200">MC</div>
                      <div className="w-10 h-6 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-[10px] font-bold text-gray-800 dark:text-gray-200">AMEX</div>
                    </div>
                    {clientSecret ? (
                      <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                        <CheckoutForm 
                          onSuccess={handleStripeSuccess} 
                          isProcessing={isProcessing} 
                          setIsProcessing={setIsProcessing}
                        />
                      </Elements>
                    ) : (
                      <div className="flex justify-center items-center py-8">
                        <Loader2 className="w-8 h-8 text-[#FF4D20] animate-spin" />
                      </div>
                    )}
                  </div>
                )}

                <div 
                  className={`p-4 cursor-pointer transition-colors ${paymentMethod === 'paypal' ? 'bg-orange-50/50 dark:bg-orange-500/10' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'paypal' ? 'border-[#FF4D20]' : 'border-gray-300 dark:border-gray-600'}`}>
                      {paymentMethod === 'paypal' && <div className="w-2.5 h-2.5 bg-[#FF4D20] rounded-full"></div>}
                    </div>
                    <Wallet size={20} className={paymentMethod === 'paypal' ? 'text-[#FF4D20]' : 'text-gray-500 dark:text-gray-400'} />
                    <span className={`font-semibold ${paymentMethod === 'paypal' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{t('paypal')}</span>
                  </div>
                </div>

                {paymentMethod === 'paypal' && (
                  <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-center">
                    <svg className="w-16 h-auto mx-auto mb-3" viewBox="0 0 124 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M46.216 11.233c-.768-3.414-3.328-5.328-7.733-5.328h-9.986c-.722 0-1.341.527-1.458 1.239l-4.225 25.132c-.085.503.298.948.81.948h5.305c.606 0 1.135-.436 1.233-1.036l1.206-7.387c.1-.599.627-1.036 1.233-1.036h2.518c5.297 0 9.176-2.181 10.155-8.318.428-2.673-.131-4.708-1.503-6.195H46.216z" fill="#253B80"/>
                      <path d="M112.57 11.233c-.767-3.414-3.327-5.328-7.732-5.328h-9.987c-.722 0-1.34.527-1.458 1.239l-4.225 25.132c-.085.503.297.948.81.948h5.305c.605 0 1.134-.436 1.233-1.036l1.206-7.387c.1-.599.627-1.036 1.232-1.036h2.519c5.297 0 9.176-2.181 10.155-8.318.428-2.673-.131-4.708-1.502-6.195h2.444z" fill="#253B80"/>
                      <path d="M62.607 10.97l-3.354 13.568c-.201.815-.935 1.391-1.776 1.391h-4.321c-.604 0-1.056-.569-.92-1.157l2.884-12.44c.159-.683.771-1.171 1.472-1.171h4.636c.553 0 .976.471.868 1.014-1.19-2.909-3.905-4.838-8.192-4.838H41.874l-2.028 12.06c2.404-.766 5.215-1.116 8.163-.799 4.316.465 7.025 2.872 7.749 7.087.652 3.791-.986 7.404-4.218 8.948-2.158 1.031-4.779 1.411-7.464 1.218h16.294c.722 0 1.341-.527 1.458-1.238l4.493-26.74c.085-.503-.298-.948-.81-.948h-5.263c.489 1.63.784 3.447.36 5.045M89.702 24.343l-6.273-12.879c-.279-.572-.857-.935-1.493-.935h-5.834c-.815 0-1.282.935-.794 1.583l9.043 11.996-3.834 5.378c-.461.646.002 1.545.794 1.545h5.51c.604 0 1.157-.306 1.476-.816l7.463-11.968c.394-.633-.06-1.464-.81-1.464h-5.466c-.606 0-1.161.31-1.479.824l-1.397 2.375-1.844-3.522c-.663 3.659-1.921 5.922-3.864 7.214-1.745 1.159-4.254 1.159-4.254 1.159h3.69c.553 0 .976-.471.868-1.014.288 3.524 2.83 5.485 6.786 5.485h1.905c1.459 0 2.274-1.685 1.353-2.825l-.782-1.042-3.778-5.093z" fill="#179BD7"/>
                    </svg>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('paypal_redirect')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Disable original button if payment method is credit card, because Stripe Elements has its own button */}
            {paymentMethod !== 'credit-card' && (
              <div className="hidden lg:block">
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full bg-[#FF4D20] text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-all shadow-[0_8px_20px_rgba(255,77,32,0.25)] flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      {t('processing')}
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      {t('pay')} ${finalTotal.toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            )}
            
          </div>

          <div className="w-full lg:w-1/3 space-y-6 lg:sticky lg:top-28">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('order_summary')}</h2>
              
              
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">{t('empty_cart')}</p>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.cartId} className="flex gap-4">
                      <div className="relative w-16 h-16 rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F7F7F8] flex-shrink-0">
                        <img src={item.image || item.images?.[0]?.url || 'https://via.placeholder.com/150'} alt={item.name || "Product"} className="w-full h-full object-contain p-2 mix-blend-multiply" />
                        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-500 dark:bg-gray-400 text-white flex items-center justify-center text-[10px] font-bold z-10 border border-white dark:border-gray-800">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{item.name ? t(item.name) : (item.slug ? t(`prod_${item.slug.replace(/-/g, '_')}`) : "Product")}</h4>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {item.color && <span>Color: {item.color} </span>}
                          {item.size && <span>Size: {item.size}</span>}
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-end">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2 mb-6 border-y border-gray-100 dark:border-gray-700 py-6">
                <input 
                  type="text" 
                  name='discountCode'
                  onChange={handleChange}
                  value={data.discountCode}
                  placeholder={t('discount_code')}
                  className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-[#FF4D20] focus:ring-2 focus:ring-orange-500/10 transition-all"
                />
                <button className="px-5 py-2.5 bg-gray-900 dark:bg-gray-700 text-white font-semibold text-sm rounded-xl hover:bg-black dark:hover:bg-gray-600 transition-colors">
                  {t('apply')}
                </button>
              </div>

              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex justify-between">
                  <span>{t('subtotal')}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('shipping')}</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-500 font-semibold">{t('free')}</span>
                  ) : (
                    <span className="font-semibold text-gray-900 dark:text-white">${shippingCost.toFixed(2)}</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-gray-100 dark:border-gray-700 pt-4 mb-2">
                <span className="text-base font-bold text-gray-900 dark:text-white">{t('total')}</span>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block mb-0.5">USD</span>
                  <span className="text-2xl font-bold text-[#FF4D20]">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

            </div>

            <div className="lg:hidden">
              <button 
                onClick={handleCheckout}
                disabled={isProcessing || cartItems.length === 0}
                className="w-full bg-[#FF4D20] text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-all shadow-[0_8px_20px_rgba(255,77,32,0.25)] flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    {t('processing')}
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    {t('pay')} ${finalTotal.toFixed(2)}
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <CheckCircle2 size={14} className="text-green-500" />
              <span>{t('safe_checkout')}</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
