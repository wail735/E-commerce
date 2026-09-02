import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function CheckoutForm({ onSuccess, isProcessing, setIsProcessing }) {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useLanguage();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message);
        setIsProcessing(false);
        return;
      }

      // We don't confirm here because we want to create the order first in Checkout.jsx
      // then confirm the payment if order creation succeeds.
      // But Stripe requires confirming with `confirmPayment`.
      // So the flow should be: 
      // 1. Checkout.jsx creates the order with paymentStatus: "pending"
      // 2. CheckoutForm calls stripe.confirmPayment
      // 3. Backend webhook updates order to "completed" OR CheckoutForm tells Checkout.jsx it succeeded.
      
      onSuccess(stripe, elements);
    } catch (err) {
      setError(err.message || "Une erreur est survenue");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PaymentElement className="mb-6" />
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full h-12 bg-[#FF4D20] text-white rounded-xl font-bold text-[15px] hover:bg-orange-600 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isProcessing && <Loader2 size={20} className="animate-spin" />}
        Payer maintenant
      </button>
    </form>
  );
}
