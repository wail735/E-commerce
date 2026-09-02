// ============================================================================
// FICHIER : backend/payments/payment.controller.js
// RÔLE : Contrôleur pour l'intégration de Stripe
// ============================================================================

import Stripe from "stripe";
import dotenv from "dotenv";
import * as coinService from "../coins/coin.service.js";
import * as subscriptionService from "../subscriptions/subscription.service.js";
import Settings from "../config/settings.model.js";

dotenv.config();

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

/**
 * Créer un PaymentIntent
 * Méthode: POST /api/v1/payments/create-intent
 */
export const createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency = "usd" } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Montant invalide" });
    }

    // Créer le PaymentIntent
    // Stripe prend le montant en centimes (amount * 100)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: {
        userId: req.user._id.toString(),
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Erreur création PaymentIntent:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Créer une Checkout Session Stripe (Redirection)
 * Méthode: POST /api/v1/payments/checkout/coins
 */
export const createCoinsCheckoutSession = async (req, res) => {
  try {
    const { packageId } = req.body;
    
    // Récupérer le pack
    const settings = await Settings.getSettings();
    const pkg = settings.coinPackages.find(p => p.id === packageId);
    
    if (!pkg) {
      return res.status(400).json({ success: false, message: "Pack introuvable." });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${pkg.coins} MoCoins`,
              description: "Recharge de votre portefeuille MoExpress",
              images: ['https://cdn-icons-png.flaticon.com/512/5772/5772242.png'],
            },
            unit_amount: Math.round(pkg.priceEuros * 100), // en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/profile/wallet?session_id={CHECKOUT_SESSION_ID}&packageId=${pkg.id}`,
      cancel_url: `${process.env.FRONTEND_URL}/profile/wallet?canceled=true`,
      metadata: {
        userId: req.user._id.toString(),
        packageId: pkg.id,
        type: 'coin_purchase'
      },
    });

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    console.error("Erreur Checkout Session:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Vérifier une Checkout Session Stripe
 * Méthode: POST /api/v1/payments/checkout/verify
 */
export const verifyCheckoutSession = async (req, res) => {
  try {
    const { session_id, packageId } = req.body;
    if (!session_id || !packageId) {
      return res.status(400).json({ success: false, message: "Données manquantes." });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      // Éviter le double crédit (vérifier si on a déjà traité cette session via le webhook par exemple)
      // Pour une simple validation locale (demo), on va juste créditer les coins
      // Note: Dans un environnement de prod strict, il faut marquer la session en BDD
      const result = await coinService.buyCoins(req.user._id, packageId);
      
      return res.status(200).json({ 
        success: true, 
        message: "Paiement validé avec succès !",
        data: result
      });
    } else {
      return res.status(400).json({ success: false, message: "Paiement non finalisé." });
    }
  } catch (error) {
    console.error("Erreur Verification Session:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Créer une Checkout Session Stripe pour un Abonnement
 * Méthode: POST /api/v1/payments/checkout/subscription
 */
export const createSubscriptionCheckoutSession = async (req, res) => {
  try {
    const { planName } = req.body;
    
    // Récupérer les détails du plan
    const settings = await Settings.getSettings();
    const plan = settings.subscriptionPlans.find(
      (p) => p.name.toLowerCase() === planName.toLowerCase()
    );
    
    if (!plan) {
      return res.status(400).json({ success: false, message: "Plan invalide." });
    }

    // Créer la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Abonnement ${plan.name.toUpperCase()}`,
              description: "Accès Premium & Avantages Vendeur (30 Jours)",
              images: ['https://cdn-icons-png.flaticon.com/512/5772/5772242.png'],
            },
            unit_amount: Math.round(plan.price * 100), // en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/profile/subscription?session_id={CHECKOUT_SESSION_ID}&planName=${plan.name}`,
      cancel_url: `${process.env.FRONTEND_URL}/profile/subscription?canceled=true`,
      metadata: {
        userId: req.user._id.toString(),
        planName: plan.name,
        type: 'subscription'
      },
    });

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    console.error("Erreur Checkout Session Abonnement:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Vérifier une Checkout Session Stripe pour un abonnement
 * Méthode: POST /api/v1/payments/checkout/verify-subscription
 */
export const verifySubscriptionCheckoutSession = async (req, res) => {
  try {
    const { session_id, planName } = req.body;
    if (!session_id || !planName) {
      return res.status(400).json({ success: false, message: "Données manquantes." });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      // Activer l'abonnement
      const result = await subscriptionService.subscribeToPlan(req.user._id, planName);
      
      return res.status(200).json({ 
        success: true, 
        message: "Abonnement validé avec succès !",
        data: result
      });
    } else {
      return res.status(400).json({ success: false, message: "Paiement non finalisé." });
    }
  } catch (error) {
    console.error("Erreur Verification Session Abonnement:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Stripe Webhook pour traiter les événements de paiement asynchrones
 * Méthode: POST /api/v1/payments/stripe/webhook
 */
export const stripeWebhook = async (request, response) => {
  const sig = request.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } else {
      event = request.body;
    }
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      console.log('PaymentIntent was successful!');
      // TODO: Update order status to completed
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
};
