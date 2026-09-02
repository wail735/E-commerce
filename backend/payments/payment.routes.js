// ============================================================================
// FICHIER : backend/payments/payment.routes.js
// RÔLE : Définition des routes Stripe (/api/v1/payments)
// ============================================================================

import { Router } from "express";
import { protect } from "../auth/auth.middleware.js";
import { 
  createPaymentIntent, 
  createCoinsCheckoutSession, 
  verifyCheckoutSession,
  createSubscriptionCheckoutSession,
  verifySubscriptionCheckoutSession
} from "./payment.controller.js";

const router = Router();

// Route pour générer le client_secret Stripe
router.post("/create-intent", protect, createPaymentIntent);

// Routes pour Checkout Sessions Stripe (Redirection)
router.post("/checkout/coins", protect, createCoinsCheckoutSession);
router.post("/checkout/verify", protect, verifyCheckoutSession);

// Routes pour Abonnements (Stripe Checkout)
router.post("/checkout/subscription", protect, createSubscriptionCheckoutSession);
router.post("/checkout/verify-subscription", protect, verifySubscriptionCheckoutSession);

export default router;
