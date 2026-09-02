import { Router } from "express";

import adminRoutes from "../admin/admin.routes.js";
import adRoutes from "../ads/ad.routes.js";
import authRoutes from "../auth/auth.routes.js";
import chatRoutes from "../chat/chat.routes.js";
import coinRoutes from "../coins/coin.routes.js";
import contactRoutes from "../contact/contact.routes.js";
import disputeRoutes from "../disputes/dispute.routes.js";
import newsletterRoutes from "../newsletter/newsletter.routes.js";
import notificationRoutes from "../notifications/notification.routes.js";
import orderRoutes from "../orders/order.routes.js";
import paymentRoutes from "../payments/payment.routes.js";
import productRoutes from "../products/product.routes.js";
import socialRoutes from "../social/social.routes.js";
import subscriptionRoutes from "../subscriptions/subscription.routes.js";
import supportRoutes from "../support/support.routes.js";
import userRoutes from "../users/user.routes.js";

const router = Router();

router.use("/admin", adminRoutes);
router.use("/ads", adRoutes);
router.use("/auth", authRoutes);
router.use("/chat", chatRoutes);
router.use("/coins", coinRoutes);
router.use("/contact", contactRoutes);
router.use("/disputes", disputeRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/notifications", notificationRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/products", productRoutes);
router.use("/social", socialRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/support", supportRoutes);
router.use("/users", userRoutes);

export default router;
