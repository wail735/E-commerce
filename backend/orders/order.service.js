// ============================================================================
// FICHIER : backend 2/orders/order.service.js
// RÔLE : Logique métier des commandes (Paiement Coins/Carte, Réductions Abonnement, Stock & Suivi)
// ============================================================================

import Order from "./order.model.js";
import { User } from "../auth/auth.model.js";
import Product from "../products/product.model.js";
import { sendEmail } from "../config/email.js";
import mongoose from "mongoose";

/**
 * Créer une commande à partir du panier de l'utilisateur.
 */
export const createOrder = async (
  userId,
  { paymentMethod, shippingAddress },
) => {
  const user = await User.findById(userId).populate({
    path: "cart.product",
    select: "name price isPublished quantity createdBy"
  });

  if (!user.cart || user.cart.length === 0) {
    throw new Error("Votre panier d'achat est vide.");
  }

  // 1. Group cart items by seller
  const ordersBySeller = {};
  
  for (let cartItem of user.cart) {
    const product = cartItem.product;
    if (!product || !product.isPublished) {
      throw new Error(`Le produit [${product?.name || "Inconnu"}] n'est plus disponible.`);
    }
    if (product.quantity < cartItem.quantity) {
      throw new Error(`Stock insuffisant pour le produit [${product.name}]. Restant : ${product.quantity}`);
    }

    const sellerId = product.createdBy ? product.createdBy.toString() : 'admin';
    if (!ordersBySeller[sellerId]) {
      ordersBySeller[sellerId] = {
        subtotal: 0,
        items: []
      };
    }

    ordersBySeller[sellerId].subtotal += product.price * cartItem.quantity;
    ordersBySeller[sellerId].items.push({
      product: product._id,
      seller: product.createdBy,
      quantity: cartItem.quantity,
      price: product.price,
    });
  }

  // Calculate total across all orders for payment verification
  let globalSubtotal = Object.values(ordersBySeller).reduce((sum, order) => sum + order.subtotal, 0);
  let discountRate = user.subscription?.discountRate || 0;
  let globalDiscountAmount = (globalSubtotal * discountRate) / 100;
  let globalShippingFee = 10; // Frais de livraison fixe (ex: 10$)
  
  let globalTotalAmount = globalSubtotal - globalDiscountAmount + globalShippingFee;

  // 2. Traitement du paiement global
  if (paymentMethod === "coins") {
    if (user.coinsBalance < globalTotalAmount) {
      throw new Error("Solde MoCoins insuffisant pour couvrir l'ensemble des commandes.");
    }
    user.coinsBalance -= globalTotalAmount;
  } else if (paymentMethod === "stripe") {
    // Intégration Stripe (simulation : on valide que Stripe a traité le paiement en amont)
  }

  // 3. Create an order for EACH seller
  const createdOrders = [];
  
  for (const [sellerId, orderData] of Object.entries(ordersBySeller)) {
    // Calcul de la commission de la plateforme (10%) sur le sous-total de CE vendeur
    const platformCommission = orderData.subtotal * 0.10;
    
    // Frais de livraison (on pourrait diviser par le nombre de vendeurs ou facturer par colis)
    // Pour simplifier, on applique les 10$ uniquement au premier vendeur, ou on divise
    const shippingFee = createdOrders.length === 0 ? globalShippingFee : 0;
    
    // Remise répartie proportionnellement
    const discountAmount = (orderData.subtotal / globalSubtotal) * globalDiscountAmount;
    
    const totalAmount = orderData.subtotal - discountAmount + shippingFee;

    const newOrder = new Order({
      customer: user._id,
      seller: sellerId === 'admin' ? null : sellerId,
      items: orderData.items,
      subtotal: orderData.subtotal,
      discountAmount,
      shippingFee,
      totalAmount,
      platformCommission,
      shippingAddress,
      paymentMethod,
      paymentStatus: "completed",
    });

    await newOrder.save();
    createdOrders.push(newOrder);

    // Mettre à jour le stock de chaque produit
    for (let item of orderData.items) {
      const p = await Product.findById(item.product);
      p.quantity -= item.quantity;
      p.salesCount = (p.salesCount || 0) + item.quantity;
      await p.save();
    }
  }

  // 4. Vider le panier de l'utilisateur
  user.cart = [];
  await user.save();

  return createdOrders;
};

/**
 * Obtenir toutes les commandes de l'utilisateur avec infos des produits.
 */
export const getUserOrders = async (userId) => {
  return await Order.find({ customer: userId })
    .populate("items.product", "name price images")
    .sort({ createdAt: -1 });
};

/**
 * Obtenir toutes les commandes d'un vendeur (filtre sur `seller`).
 */
export const getSellerOrders = async (sellerId) => {
  return await Order.find({ seller: sellerId })
    .populate("customer", "name email")
    .populate("items.product", "name price images")
    .sort({ createdAt: -1 });
};

/**
 * Mettre à jour le statut d'une commande (par le Vendeur).
 */
export const updateOrderStatus = async (orderId, sellerId, status, trackingNumber) => {
  const order = await Order.findOne({ _id: orderId, seller: sellerId });
  if (!order) throw new Error("Commande non trouvée ou non autorisée.");

  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled", "disputed"];
  if (!validStatuses.includes(status)) {
    throw new Error("Statut invalide.");
  }

  order.orderStatus = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;

  if (status === "delivered") order.deliveredAt = new Date();

  await order.save();
  return order;
};

/**
 * SuperAdmin : Obtenir toutes les commandes du site
 */
export const getAllOrders = async () => {
  return await Order.find()
    .populate("customer", "name email")
    .populate("seller", "storeName name email")
    .populate("items.product", "name price")
    .sort({ createdAt: -1 });
};

/**
 * Vendeur : Obtenir les statistiques du vendeur
 */
export const getSellerStats = async (sellerId) => {
  const totalOrders = await Order.countDocuments({ seller: sellerId });
  
  const salesResult = await Order.aggregate([
    { $match: { seller: new mongoose.Types.ObjectId(sellerId), paymentStatus: "completed" } },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalAmount" },
      },
    },
  ]);
  
  const totalSales = salesResult.length > 0 ? salesResult[0].totalSales : 0;

  // Data for Sales Chart
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const salesDataAggregation = await Order.aggregate([
    { $match: { seller: new mongoose.Types.ObjectId(sellerId), paymentStatus: "completed", createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        sales: { $sum: "$totalAmount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const salesChartData = salesDataAggregation.map((d) => ({
    name: d._id,
    sales: d.sales,
  }));

  return {
    totalSales,
    totalOrders,
    visitors: 1250, // Mock for now
    conversionRate: "4.2", // Mock for now
    salesChartData
  };
};
