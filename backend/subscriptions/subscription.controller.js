// ============================================================================
// FICHIER : backend 2/subscriptions/subscription.controller.js
// RÔLE : Contrôleur gérant les endpoints d'abonnements
// ============================================================================

import * as subscriptionService from "./subscription.service.js";
import { subscribeDTO } from "./subscription.dto.js";

/**
 * Consulter les forfaits d'abonnement disponibles
 */
export const getPlans = async (req, res) => {
  try {
    const plans = await subscriptionService.getAvailablePlans();
    return res.status(200).json({ success: true, data: plans });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Souscrire à un plan d'abonnement
 */
export const subscribe = async (req, res) => {
  try {
    const { error, value } = subscribeDTO.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const result = await subscriptionService.subscribeToPlan(
      req.user._id,
      value.planName,
    );
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
