# Architecture Backend — MoExpress

**API REST Node.js / Express / MongoDB (Pattern Service + DTO)**
**Documentation Technique — Mise à jour Août 2026**

> Ce document intègre l'architecture backend initiale de MoExpress **et** les manques identifiés
> après comparaison avec le fonctionnement d'un vrai marketplace multi-vendeurs (type AliExpress).
> Les nouvelles sections sont marquées `🆕`.

---

## Table des matières

1. Introduction
2. Stack Technologique Backend
3. Structure des Dossiers (server/) 🆕 *mise à jour*
4. Modèles de Données — Core
5. Modèles de Données — 🆕 Nouveaux modules
6. DTO (Data Transfer Objects)
7. Couche Repository
8. Couche Service — logique métier
9. Couche Controller
10. Couche Routes
11. Middlewares
12. Configuration Express (app.js)
13. Endpoints API — Vue d'ensemble 🆕 *mise à jour*
14. Format de Réponse Standardisé
15. Sécurité
16. Intégration avec le Frontend Existant
17. 🆕 Analyse des manques vs AliExpress (priorisation)
18. 🆕 Roadmap recommandée (contexte freelance / marché algérien)
19. Prochaines Étapes Suggérées

---

## 1. Introduction

Ce document décrit l'architecture backend de l'application e-commerce **MoExpress**, conçue pour
s'intégrer avec le frontend React/Vite existant (Tailwind CSS, React Router, Context API pour Auth,
Cart, Wishlist, Theme, Language).

L'objectif est de fournir une API REST robuste, maintenable et testable, en appliquant une
architecture en couches (layered architecture) avec séparation stricte des responsabilités :

```
Client (React)
   │
   ▼
Routes → Middlewares → Controllers → Services → Repositories/Models
   ▲                                     │
   └──────────── DTO (Data Transfer Object) ─┘
```

- **Routes** : définissent les endpoints HTTP et les rattachent aux controllers.
- **Middlewares** : authentification, validation, gestion des erreurs, upload de fichiers.
- **Controllers** : reçoivent la requête HTTP, orchestrent l'appel au service, renvoient la réponse (aucune logique métier ici).
- **DTO** : valident les données entrantes (Request DTO) et façonnent les données sortantes (Response DTO), afin de ne jamais exposer directement les documents Mongoose.
- **Services** : contiennent toute la logique métier (règles de gestion, calculs, orchestration entre modèles).
- **Models / Repositories** : accès aux données MongoDB via Mongoose.

---

## 2. Stack Technologique Backend

| Catégorie | Technologie | Rôle |
|---|---|---|
| Runtime | Node.js (v20 LTS) | Environnement d'exécution serveur |
| Framework | Express.js (v4) | Routing, middlewares, serveur HTTP |
| Base de données | MongoDB (Atlas ou local) | Base NoSQL orientée documents |
| ODM | Mongoose (v8) | Modélisation des schémas, validation, hooks |
| Authentification | JWT (jsonwebtoken) + bcryptjs | Génération de tokens, hashage des mots de passe |
| Validation | Zod (ou Joi) | Validation des DTO entrants |
| Upload fichiers | Multer + Cloudinary | Gestion des images produits / avis |
| Sécurité | Helmet, cors, express-rate-limit, express-mongo-sanitize | Durcissement de l'API |
| Logs | Morgan + Winston | Journalisation des requêtes et erreurs |
| Tests | Jest + Supertest | Tests unitaires et d'intégration |
| Documentation API | Swagger (OpenAPI 3) | Documentation interactive `/api-docs` |
| Variables d'env. | dotenv | Configuration par environnement |
| Paiement | Stripe / CIB / Chargily (marché algérien) | Paiement en ligne + webhooks 🆕 |
| 🆕 Temps réel | Socket.io | Messagerie acheteur-vendeur, notifications live |
| 🆕 Files/Jobs | node-cron (ou BullMQ + Redis) | Expiration coupons, remboursement auto litiges, alertes prix |

---

## 3. Structure des Dossiers (server/) — mise à jour 🆕

```
server/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   ├── env.js
│   │   ├── cloudinary.js
│   │   ├── swagger.js
│   │   └── socket.js                      # 🆕 init Socket.io
│   │
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Product.model.js
│   │   ├── Category.js
│   │   ├── Order.model.js                 # 🆕 statusHistory ajouté
│   │   ├── Cart.model.js
│   │   ├── Wishlist.model.js
│   │   ├── Review.model.js                # 🆕 enrichi
│   │   ├── Shop.model.js                  # 🆕
│   │   ├── Shipment.model.js              # 🆕
│   │   ├── Dispute.model.js               # 🆕
│   │   ├── Coupon.model.js                # 🆕
│   │   ├── Conversation.model.js          # 🆕
│   │   ├── Message.model.js               # 🆕
│   │   ├── Notification.model.js          # 🆕
│   │   ├── RecentlyViewed.model.js        # 🆕
│   │   └── index.js
│   │
│   ├── dto/
│   │   ├── request/
│   │   │   ├── auth/ ...
│   │   │   ├── product/ ...
│   │   │   ├── order/ ...
│   │   │   ├── cart/ ...
│   │   │   ├── shop/                      # 🆕
│   │   │   │   └── CreateShopRequestDTO.js
│   │   │   ├── coupon/                    # 🆕
│   │   │   │   └── CreateCouponRequestDTO.js
│   │   │   ├── dispute/                   # 🆕
│   │   │   │   └── OpenDisputeRequestDTO.js
│   │   │   ├── message/                   # 🆕
│   │   │   │   └── SendMessageRequestDTO.js
│   │   │   └── review/                    # 🆕
│   │   │       └── CreateReviewRequestDTO.js
│   │   └── response/
│   │       ├── UserResponseDTO.js
│   │       ├── ProductResponseDTO.js
│   │       ├── OrderResponseDTO.js
│   │       ├── CartResponseDTO.js
│   │       ├── ShopResponseDTO.js          # 🆕
│   │       ├── ShipmentResponseDTO.js      # 🆕
│   │       ├── DisputeResponseDTO.js       # 🆕
│   │       ├── CouponResponseDTO.js        # 🆕
│   │       └── NotificationResponseDTO.js  # 🆕
│   │
│   ├── repositories/
│   │   ├── user.repository.js
│   │   ├── product.repository.js
│   │   ├── order.repository.js
│   │   ├── cart.repository.js
│   │   ├── category.repository.js
│   │   ├── shop.repository.js              # 🆕
│   │   ├── coupon.repository.js            # 🆕
│   │   ├── dispute.repository.js           # 🆕
│   │   └── notification.repository.js      # 🆕
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── product.service.js
│   │   ├── category.service.js
│   │   ├── cart.service.js
│   │   ├── wishlist.service.js
│   │   ├── order.service.js
│   │   ├── review.service.js
│   │   ├── upload.service.js
│   │   ├── payment.service.js              # 🆕 détaillé + webhooks
│   │   ├── refund.service.js               # 🆕
│   │   ├── shop.service.js                 # 🆕
│   │   ├── shipping.service.js             # 🆕
│   │   ├── dispute.service.js              # 🆕
│   │   ├── promotion.service.js            # 🆕 (coupons)
│   │   ├── message.service.js              # 🆕
│   │   ├── notification.service.js         # 🆕
│   │   └── recommendation.service.js       # 🆕
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── product.controller.js
│   │   ├── category.controller.js
│   │   ├── cart.controller.js
│   │   ├── wishlist.controller.js
│   │   ├── order.controller.js
│   │   ├── review.controller.js
│   │   ├── seller.controller.js
│   │   ├── shop.controller.js              # 🆕
│   │   ├── shipping.controller.js          # 🆕
│   │   ├── dispute.controller.js           # 🆕
│   │   ├── coupon.controller.js            # 🆕
│   │   ├── message.controller.js           # 🆕
│   │   └── notification.controller.js      # 🆕
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── product.routes.js
│   │   ├── category.routes.js
│   │   ├── cart.routes.js
│   │   ├── wishlist.routes.js
│   │   ├── order.routes.js
│   │   ├── review.routes.js
│   │   ├── seller.routes.js
│   │   ├── shop.routes.js                  # 🆕
│   │   ├── shipping.routes.js              # 🆕
│   │   ├── dispute.routes.js               # 🆕
│   │   ├── coupon.routes.js                # 🆕
│   │   ├── message.routes.js               # 🆕
│   │   ├── notification.routes.js          # 🆕
│   │   └── index.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── validate.middleware.js
│   │   ├── error.middleware.js
│   │   ├── notFound.middleware.js
│   │   ├── upload.middleware.js
│   │   └── rateLimiter.middleware.js
│   │
│   ├── sockets/
│   │   └── chat.socket.js                  # 🆕 gestion des events Socket.io (messages, notifs)
│   │
│   ├── jobs/                                # 🆕
│   │   ├── couponExpiration.job.js
│   │   ├── autoRefundDispute.job.js
│   │   └── priceDropAlert.job.js
│   │
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   ├── generateToken.js
│   │   ├── logger.js
│   │   └── constants.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── unit/
│   │   ├── product.service.test.js
│   │   ├── coupon.service.test.js          # 🆕
│   │   └── dispute.service.test.js         # 🆕
│   └── integration/
│       ├── auth.routes.test.js
│       └── order.routes.test.js            # 🆕
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 4. Modèles de Données — Core

### 4.1 User.model.js

```js
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  label: String,
  wilaya: String,
  commune: String,
  street: String,
  isDefault: { type: Boolean, default: false },
}, { _id: true });

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    phone: { type: String },
    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },
    addresses: [addressSchema],
    avatarUrl: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
```

### 4.2 Product.model.js — 🆕 modération admin ajoutée

```js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: null },
    stock: { type: Number, required: true, default: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [{ url: String, publicId: String }],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" }, // 🆕 lien boutique
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFlashDeal: { type: Boolean, default: false },
    flashDealEndsAt: { type: Date },
    isActive: { type: Boolean, default: true },
    // 🆕 modération admin avant publication
    moderationStatus: {
      type: String,
      enum: ["pending_review", "approved", "rejected"],
      default: "pending_review",
    },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });

export default mongoose.model("Product", productSchema);
```

### 4.3 Order.model.js — 🆕 historique d'étapes + statut de paiement distinct

```js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" }, // 🆕
  name: String,
  image: String,
  price: Number,
  quantity: { type: Number, required: true, min: 1 },
});

// 🆕 historique horodaté des statuts (au lieu d'un simple champ status)
const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["pending", "confirmed", "preparing", "shipped", "in_transit", "customs", "delivered", "cancelled"],
  },
  changedAt: { type: Date, default: Date.now },
  note: String,
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    shippingAddress: {
      wilaya: String,
      commune: String,
      street: String,
      phone: String,
    },
    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery", "cib", "chargily", "stripe"],
      default: "cash_on_delivery",
    },
    // 🆕 statut de paiement distinct du statut de la commande
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "partially_refunded"],
      default: "pending",
    },
    itemsPrice: Number,
    shippingPrice: Number,
    totalPrice: Number,
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "shipped", "in_transit", "customs", "delivered", "cancelled"],
      default: "pending",
    },
    statusHistory: [statusHistorySchema], // 🆕
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    deliveredAt: Date,
    coupon: {                              // 🆕 coupon appliqué
      code: String,
      discountAmount: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
```

### 4.4 Autres modèles (résumé)

| Modèle | Champs clés |
|---|---|
| Category.js | name, slug, parentCategory, image |
| Cart.model.js | user, items[{product, quantity}], updatedAt |
| Wishlist.model.js | user, products[ObjectId] |

---

## 5. Modèles de Données — Nouveaux modules 🆕

### 5.1 Shop.model.js — Multi-vendeurs

```js
import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    logoUrl: { type: String, default: "" },
    bannerUrl: { type: String, default: "" },
    description: { type: String },
    rating: { type: Number, default: 0 },
    responseRate: { type: Number, default: 0 }, // % de messages répondus
    commissionRate: { type: Number, default: 8 }, // % prélevé par la plateforme
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    stats: {
      totalSales: { type: Number, default: 0 },
      totalOrders: { type: Number, default: 0 },
      totalProductViews: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Shop", shopSchema);
```

### 5.2 Shipment.model.js — Suivi de commande / logistique

```js
import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    carrier: { type: String, required: true }, // ex: Yalidine, ZR Express, Anderson...
    trackingNumber: { type: String, required: true },
    method: { type: String, enum: ["standard", "express"], default: "standard" },
    cost: { type: Number, required: true },
    status: {
      type: String,
      enum: ["preparing", "shipped", "in_transit", "customs", "delivered", "returned"],
      default: "preparing",
    },
    estimatedDelivery: Date,
    history: [{
      status: String,
      location: String,
      timestamp: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

export default mongoose.model("Shipment", shipmentSchema);
```

### 5.3 Review.model.js — Système d'avis enrichi

```js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }, // 🆕 lien commande
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    images: [{ type: String }],        // 🆕 photos jointes
    video: { type: String },            // 🆕 vidéo jointe
    verifiedPurchase: { type: Boolean, default: false }, // 🆕 avis vérifié
    criteriaRatings: {                  // 🆕 notes par critère
      conformity: { type: Number, min: 1, max: 5 },
      quality: { type: Number, min: 1, max: 5 },
      delivery: { type: Number, min: 1, max: 5 },
    },
    sellerReply: {                      // 🆕 réponse du vendeur
      comment: String,
      repliedAt: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
```

### 5.4 Dispute.model.js — Protection acheteur / Litiges

```js
import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    reason: {
      type: String,
      enum: ["not_delivered", "not_as_described", "damaged", "wrong_item", "other"],
      required: true,
    },
    description: { type: String, required: true },
    evidence: [{ type: String }], // URLs photos/vidéos
    status: {
      type: String,
      enum: ["open", "seller_responded", "under_admin_review", "resolved_refund", "resolved_rejected"],
      default: "open",
    },
    sellerResponse: { comment: String, respondedAt: Date },
    adminDecision: { comment: String, decidedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, decidedAt: Date },
    refundAmount: { type: Number, default: 0 },
    autoRefundDeadline: { type: Date }, // 🆕 fenêtre de protection (remboursement auto si non livré après X jours)
  },
  { timestamps: true }
);

export default mongoose.model("Dispute", disputeSchema);
```

### 5.5 Coupon.model.js — Coupons & Promotions

```js
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    scope: { type: String, enum: ["platform", "shop"], default: "platform" },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" }, // requis si scope = "shop"
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue: { type: Number, required: true },
    minPurchaseAmount: { type: Number, default: 0 },
    maxDiscountAmount: { type: Number },
    usageLimit: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1 },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
```

### 5.6 Conversation.model.js / Message.model.js — Messagerie acheteur-vendeur

```js
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // contexte optionnel
    lastMessage: { type: String },
    lastMessageAt: { type: Date },
  },
  { timestamps: true }
);

const messageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    attachments: [{ type: String }],
    readAt: { type: Date },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
export const Message = mongoose.model("Message", messageSchema);
```

### 5.7 Notification.model.js

```js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["order_shipped", "order_delivered", "seller_reply", "wishlist_price_drop", "review_received", "dispute_update", "coupon_available", "message_received"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String }, // deep-link frontend, ex: /orders/:id
    isRead: { type: Boolean, default: false },
    meta: { type: mongoose.Schema.Types.Mixed }, // payload libre (orderId, productId...)
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
```

### 5.8 RecentlyViewed.model.js — Recommandation / historique de navigation

```js
import mongoose from "mongoose";

const recentlyViewedSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    viewedAt: { type: Date, default: Date.now },
  }
);

recentlyViewedSchema.index({ user: 1, viewedAt: -1 });

export default mongoose.model("RecentlyViewed", recentlyViewedSchema);
```

---

## 6. DTO (Data Transfer Objects)

Les DTO isolent la couche HTTP de la couche métier : ils valident les données entrantes et
façonnent les données sortantes (évite d'exposer `password`, `__v`, champs internes…).

### 6.1 Request DTO — Validation avec Zod

```js
// dto/request/product/CreateProductRequestDTO.js
import { z } from "zod";

export const CreateProductRequestDTO = z.object({
  name: z.string().min(3).max(150),
  description: z.string().min(10),
  price: z.number().positive(),
  discountPrice: z.number().positive().optional(),
  stock: z.number().int().min(0),
  category: z.string().length(24),
  isFlashDeal: z.boolean().optional().default(false),
});
```

```js
// dto/request/coupon/CreateCouponRequestDTO.js 🆕
import { z } from "zod";

export const CreateCouponRequestDTO = z.object({
  code: z.string().min(4).max(20),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().positive(),
  minPurchaseAmount: z.number().min(0).optional(),
  usageLimit: z.number().int().positive().optional(),
  expiresAt: z.string().datetime(),
});
```

```js
// dto/request/dispute/OpenDisputeRequestDTO.js 🆕
import { z } from "zod";

export const OpenDisputeRequestDTO = z.object({
  order: z.string().length(24),
  reason: z.enum(["not_delivered", "not_as_described", "damaged", "wrong_item", "other"]),
  description: z.string().min(10),
  evidence: z.array(z.string()).optional(),
});
```

```js
// dto/request/review/CreateReviewRequestDTO.js 🆕
import { z } from "zod";

export const CreateReviewRequestDTO = z.object({
  product: z.string().length(24),
  order: z.string().length(24),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  images: z.array(z.string()).max(5).optional(),
  criteriaRatings: z.object({
    conformity: z.number().min(1).max(5).optional(),
    quality: z.number().min(1).max(5).optional(),
    delivery: z.number().min(1).max(5).optional(),
  }).optional(),
});
```

### 6.2 Response DTO — Façonnage des données de sortie

```js
// dto/response/ProductResponseDTO.js
export const toProductResponseDTO = (product) => ({
  id: product._id,
  name: product.name,
  slug: product.slug,
  description: product.description,
  price: product.price,
  discountPrice: product.discountPrice,
  finalPrice: product.discountPrice ?? product.price,
  stock: product.stock,
  images: product.images?.map((img) => img.url) ?? [],
  category: product.category?.name ?? product.category,
  rating: product.rating,
  numReviews: product.numReviews,
  isFlashDeal: product.isFlashDeal,
  moderationStatus: product.moderationStatus, // 🆕
  createdAt: product.createdAt,
});

export const toProductListResponseDTO = (products) =>
  products.map(toProductResponseDTO);
```

```js
// dto/response/ShopResponseDTO.js 🆕
export const toShopResponseDTO = (shop) => ({
  id: shop._id,
  name: shop.name,
  slug: shop.slug,
  logoUrl: shop.logoUrl,
  bannerUrl: shop.bannerUrl,
  description: shop.description,
  rating: shop.rating,
  responseRate: shop.responseRate,
  isVerified: shop.isVerified,
  stats: shop.stats,
});
```

```js
// dto/response/UserResponseDTO.js
export const toUserResponseDTO = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  avatarUrl: user.avatarUrl,
  addresses: user.addresses ?? [],
  createdAt: user.createdAt,
  // password, __v volontairement exclus
});
```

---

## 7. Couche Repository (accès aux données)

```js
// repositories/product.repository.js
import Product from "../models/Product.model.js";

export const productRepository = {
  create: (data) => Product.create(data),
  findById: (id) => Product.findById(id).populate("category seller shop"),
  findAll: (filter = {}, options = {}) => {
    const { skip = 0, limit = 20, sort = "-createdAt" } = options;
    return Product.find(filter)
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit);
  },
  count: (filter = {}) => Product.countDocuments(filter),
  updateById: (id, data) =>
    Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  deleteById: (id) => Product.findByIdAndDelete(id),
  search: (query) =>
    Product.find({ $text: { $search: query }, isActive: true, moderationStatus: "approved" }),
};
```

```js
// repositories/coupon.repository.js 🆕
import Coupon from "../models/Coupon.model.js";

export const couponRepository = {
  findByCode: (code) => Coupon.findOne({ code: code.toUpperCase(), isActive: true }),
  create: (data) => Coupon.create(data),
  incrementUsage: (id) => Coupon.findByIdAndUpdate(id, { $inc: { usedCount: 1 } }),
};
```

```js
// repositories/dispute.repository.js 🆕
import Dispute from "../models/Dispute.model.js";

export const disputeRepository = {
  create: (data) => Dispute.create(data),
  findById: (id) => Dispute.findById(id).populate("order buyer shop"),
  findByStatus: (status) => Dispute.find({ status }),
  updateById: (id, data) => Dispute.findByIdAndUpdate(id, data, { new: true }),
};
```

---

## 8. Couche Service (logique métier)

### 8.1 product.service.js

```js
import { productRepository } from "../repositories/product.repository.js";
import { toProductResponseDTO, toProductListResponseDTO } from "../dto/response/ProductResponseDTO.js";
import { ApiError } from "../utils/ApiError.js";
import slugify from "slugify";

export const productService = {
  async createProduct(sellerId, dto) {
    const slug = slugify(dto.name, { lower: true });
    const existing = await productRepository.findAll({ slug });
    if (existing.length) throw new ApiError(409, "Un produit avec ce nom existe déjà");

    const product = await productRepository.create({
      ...dto,
      slug,
      seller: sellerId,
      moderationStatus: "pending_review", // 🆕 modération admin avant publication
    });
    return toProductResponseDTO(product);
  },

  async getProducts({ page = 1, limit = 20, category, minPrice, maxPrice, sort, freeShipping, minRating, verifiedSellerOnly }) {
    const filter = { isActive: true, moderationStatus: "approved" };
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minRating) filter.rating = { $gte: Number(minRating) };       // 🆕 filtre avancé
    if (freeShipping) filter.freeShipping = true;                     // 🆕 filtre avancé

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      productRepository.findAll(filter, { skip, limit, sort }),
      productRepository.count(filter),
    ]);

    return {
      data: toProductListResponseDTO(products),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) throw new ApiError(404, "Produit introuvable");
    return toProductResponseDTO(product);
  },
};
```

### 8.2 🆕 shop.service.js — Multi-vendeurs

```js
import { shopRepository } from "../repositories/shop.repository.js";
import { toShopResponseDTO } from "../dto/response/ShopResponseDTO.js";
import { ApiError } from "../utils/ApiError.js";
import slugify from "slugify";

export const shopService = {
  async createShop(ownerId, dto) {
    const slug = slugify(dto.name, { lower: true });
    const shop = await shopRepository.create({ ...dto, slug, owner: ownerId });
    return toShopResponseDTO(shop);
  },

  async getShopAnalytics(shopId) {
    // Agrège ventes, vues, taux de conversion sur la période demandée
    return shopRepository.getAnalytics(shopId);
  },

  async applyCommission(shopId, saleAmount) {
    const shop = await shopRepository.findById(shopId);
    const commission = (saleAmount * shop.commissionRate) / 100;
    return { commission, netAmount: saleAmount - commission };
  },
};
```

### 8.3 🆕 shipping.service.js — Suivi de commande

```js
import Shipment from "../models/Shipment.model.js";
import { ApiError } from "../utils/ApiError.js";

const RATE_TABLE = {
  standard: { base: 400, perKg: 100 },
  express: { base: 800, perKg: 180 },
};

export const shippingService = {
  calculateShippingCost({ weightKg, destinationWilaya, method = "standard" }) {
    const rate = RATE_TABLE[method];
    if (!rate) throw new ApiError(400, "Méthode de livraison invalide");
    return rate.base + weightKg * rate.perKg; // + majoration wilaya éloignée si besoin
  },

  async createShipment(orderId, { carrier, trackingNumber, method, cost }) {
    return Shipment.create({ order: orderId, carrier, trackingNumber, method, cost });
  },

  async updateStatus(shipmentId, status, location) {
    return Shipment.findByIdAndUpdate(
      shipmentId,
      { status, $push: { history: { status, location, timestamp: new Date() } } },
      { new: true }
    );
  },
};
```

### 8.4 🆕 dispute.service.js — Protection acheteur / Litiges

```js
import { disputeRepository } from "../repositories/dispute.repository.js";
import { toDisputeResponseDTO } from "../dto/response/DisputeResponseDTO.js";
import { ApiError } from "../utils/ApiError.js";
import { notificationService } from "./notification.service.js";

const AUTO_REFUND_WINDOW_DAYS = 15;

export const disputeService = {
  async openDispute(buyerId, dto) {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + AUTO_REFUND_WINDOW_DAYS);

    const dispute = await disputeRepository.create({
      ...dto,
      buyer: buyerId,
      status: "open",
      autoRefundDeadline: deadline,
    });

    await notificationService.notify(dto.shopOwnerId, {
      type: "dispute_update",
      title: "Nouveau litige ouvert",
      message: "Un acheteur a ouvert un litige sur une de vos commandes.",
    });
    return toDisputeResponseDTO(dispute);
  },

  async respondAsSeller(disputeId, sellerId, comment) {
    const dispute = await disputeRepository.updateById(disputeId, {
      status: "seller_responded",
      sellerResponse: { comment, respondedAt: new Date() },
    });
    return toDisputeResponseDTO(dispute);
  },

  async resolveByAdmin(disputeId, adminId, { decision, refundAmount, comment }) {
    if (!["resolved_refund", "resolved_rejected"].includes(decision))
      throw new ApiError(400, "Décision invalide");

    const dispute = await disputeRepository.updateById(disputeId, {
      status: decision,
      refundAmount: decision === "resolved_refund" ? refundAmount : 0,
      adminDecision: { comment, decidedBy: adminId, decidedAt: new Date() },
    });
    return toDisputeResponseDTO(dispute);
  },
};
```

### 8.5 🆕 promotion.service.js — Coupons

```js
import { couponRepository } from "../repositories/coupon.repository.js";
import { ApiError } from "../utils/ApiError.js";

export const promotionService = {
  async validateAndApply(code, { cartTotal, userId }) {
    const coupon = await couponRepository.findByCode(code);
    if (!coupon) throw new ApiError(404, "Coupon invalide");
    if (coupon.expiresAt < new Date()) throw new ApiError(400, "Coupon expiré");
    if (coupon.usedCount >= coupon.usageLimit) throw new ApiError(400, "Coupon épuisé");
    if (cartTotal < coupon.minPurchaseAmount)
      throw new ApiError(400, `Montant minimum requis : ${coupon.minPurchaseAmount} DA`);

    let discount = coupon.discountType === "percentage"
      ? (cartTotal * coupon.discountValue) / 100
      : coupon.discountValue;

    if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);

    await couponRepository.incrementUsage(coupon._id);
    return { discount, code: coupon.code };
  },
};
```

### 8.6 🆕 notification.service.js

```js
import Notification from "../models/Notification.model.js";
import { getIO } from "../config/socket.js";

export const notificationService = {
  async notify(userId, { type, title, message, link, meta }) {
    const notification = await Notification.create({ user: userId, type, title, message, link, meta });
    getIO().to(`user:${userId}`).emit("notification:new", notification); // 🆕 push temps réel
    return notification;
  },

  async markAsRead(notificationId, userId) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true }
    );
  },

  async listForUser(userId, { unreadOnly = false } = {}) {
    const filter = { user: userId };
    if (unreadOnly) filter.isRead = false;
    return Notification.find(filter).sort("-createdAt").limit(50);
  },
};
```

### 8.7 🆕 message.service.js — Messagerie acheteur-vendeur

```js
import { Conversation, Message } from "../models/Conversation.model.js";
import { getIO } from "../config/socket.js";
import { notificationService } from "./notification.service.js";

export const messageService = {
  async getOrCreateConversation(buyerId, shopId, productId) {
    let conversation = await Conversation.findOne({ participants: buyerId, shop: shopId });
    if (!conversation) {
      conversation = await Conversation.create({ participants: [buyerId], shop: shopId, product: productId });
    }
    return conversation;
  },

  async sendMessage(conversationId, senderId, content, attachments = []) {
    const message = await Message.create({ conversation: conversationId, sender: senderId, content, attachments });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content,
      lastMessageAt: new Date(),
    });

    getIO().to(`conversation:${conversationId}`).emit("message:new", message);
    return message;
  },
};
```

### 8.8 🆕 refund.service.js — Remboursements

```js
import { ApiError } from "../utils/ApiError.js";

export const refundService = {
  async processRefund(order, amount, reason) {
    // Appel à la passerelle (Stripe/Chargily) selon paymentMethod de la commande
    if (amount > order.totalPrice) throw new ApiError(400, "Montant de remboursement invalide");

    // ... intégration API du prestataire de paiement ici

    order.paymentStatus = amount === order.totalPrice ? "refunded" : "partially_refunded";
    await order.save();
    return { success: true, amount, reason };
  },
};
```

---

## 9. Couche Controller (fine, sans logique métier)

```js
// controllers/dispute.controller.js 🆕
import { disputeService } from "../services/dispute.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const openDispute = asyncHandler(async (req, res) => {
  const dispute = await disputeService.openDispute(req.user._id, req.validatedBody);
  return res.status(201).json(new ApiResponse(201, dispute, "Litige ouvert"));
});

export const respondAsSeller = asyncHandler(async (req, res) => {
  const dispute = await disputeService.respondAsSeller(req.params.id, req.user._id, req.body.comment);
  return res.status(200).json(new ApiResponse(200, dispute, "Réponse enregistrée"));
});

export const resolveDispute = asyncHandler(async (req, res) => {
  const dispute = await disputeService.resolveByAdmin(req.params.id, req.user._id, req.body);
  return res.status(200).json(new ApiResponse(200, dispute, "Litige résolu"));
});
```

```js
// controllers/coupon.controller.js 🆕
import { promotionService } from "../services/promotion.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const applyCoupon = asyncHandler(async (req, res) => {
  const result = await promotionService.validateAndApply(req.body.code, {
    cartTotal: req.body.cartTotal,
    userId: req.user._id,
  });
  return res.status(200).json(new ApiResponse(200, result, "Coupon appliqué"));
});
```

---

## 10. Couche Routes

```js
// routes/dispute.routes.js 🆕
import { Router } from "express";
import * as disputeController from "../controllers/dispute.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { OpenDisputeRequestDTO } from "../dto/request/dispute/OpenDisputeRequestDTO.js";

const router = Router();

router.post("/", protect, validate(OpenDisputeRequestDTO), disputeController.openDispute);
router.put("/:id/seller-response", protect, restrictTo("seller"), disputeController.respondAsSeller);
router.put("/:id/resolve", protect, restrictTo("admin"), disputeController.resolveDispute);

export default router;
```

```js
// routes/index.js — mise à jour 🆕
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import productRoutes from "./product.routes.js";
import categoryRoutes from "./category.routes.js";
import cartRoutes from "./cart.routes.js";
import wishlistRoutes from "./wishlist.routes.js";
import orderRoutes from "./order.routes.js";
import reviewRoutes from "./review.routes.js";
import sellerRoutes from "./seller.routes.js";
import shopRoutes from "./shop.routes.js";                 // 🆕
import shippingRoutes from "./shipping.routes.js";          // 🆕
import disputeRoutes from "./dispute.routes.js";            // 🆕
import couponRoutes from "./coupon.routes.js";               // 🆕
import messageRoutes from "./message.routes.js";            // 🆕
import notificationRoutes from "./notification.routes.js";  // 🆕

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/cart", cartRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/orders", orderRoutes);
router.use("/reviews", reviewRoutes);
router.use("/seller", sellerRoutes);
router.use("/shops", shopRoutes);                 // 🆕
router.use("/shipments", shippingRoutes);         // 🆕
router.use("/disputes", disputeRoutes);           // 🆕
router.use("/coupons", couponRoutes);             // 🆕
router.use("/messages", messageRoutes);           // 🆕
router.use("/notifications", notificationRoutes); // 🆕

export default router;
```

---

## 11. Middlewares

### 11.1 Authentification (auth.middleware.js)

```js
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.startsWith("Bearer")
    ? req.headers.authorization.split(" ")[1]
    : null;
  if (!token) throw new ApiError(401, "Non authentifié");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) throw new ApiError(401, "Utilisateur invalide");

  req.user = user;
  next();
});

export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ApiError(403, "Accès refusé pour ce rôle");
  }
  next();
};
```

### 11.2 Validation des DTO (validate.middleware.js)

```js
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Erreur de validation",
      errors: result.error.flatten().fieldErrors,
    });
  }
  req.validatedBody = result.data;
  next();
};
```

### 11.3 Gestion centralisée des erreurs (error.middleware.js)

```js
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Erreur interne du serveur",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
```

---

## 12. Configuration Express (app.js)

```js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { notFound } from "./middlewares/notFound.middleware.js";
import { initSocket } from "./config/socket.js"; // 🆕

const app = express();
const httpServer = createServer(app); // 🆕 requis pour Socket.io
initSocket(httpServer);               // 🆕

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.use("/api/v1", routes);

app.use(notFound);
app.use(errorHandler);

export { app, httpServer };
```

---

## 13. Endpoints API — Vue d'ensemble (mise à jour 🆕)

| Ressource | Méthode | Endpoint | Accès | Correspond à (frontend) |
|---|---|---|---|---|
| Auth | POST | `/api/v1/auth/register` | Public | Register.jsx |
| Auth | POST | `/api/v1/auth/login` | Public | Login.jsx |
| Auth | POST | `/api/v1/auth/logout` | Privé | AuthContext |
| Users | GET/PUT | `/api/v1/users/me` | Privé | Profile.jsx |
| Products | GET | `/api/v1/products` | Public | Products.jsx, Home.jsx |
| Products | GET | `/api/v1/products/:id` | Public | ProductDetails.jsx |
| Products | POST/PUT/DELETE | `/api/v1/products/:id` | Seller/Admin | SellerDashboard.jsx |
| Categories | GET | `/api/v1/categories` | Public | CategoryBar.jsx |
| Cart | GET/POST/DELETE | `/api/v1/cart` | Privé | CartContext, Cart.jsx |
| Wishlist | GET/POST/DELETE | `/api/v1/wishlist` | Privé | WishlistContext |
| Orders | POST/GET | `/api/v1/orders` | Privé | Checkout.jsx, Orders.jsx |
| Reviews | POST/GET | `/api/v1/reviews/:productId` | Privé/Public | Rating.jsx |
| Search | GET | `/api/v1/products/search?q=` | Public | SearchBar.jsx |
| Flash Deals | GET | `/api/v1/products?isFlashDeal=true` | Public | FlashDeals.jsx |
| 🆕 Shops | GET/POST/PUT | `/api/v1/shops`, `/api/v1/shops/:id` | Public/Seller | ShopPage.jsx |
| 🆕 Shop Analytics | GET | `/api/v1/shops/:id/analytics` | Seller | SellerDashboard.jsx |
| 🆕 Shipments | GET/PUT | `/api/v1/shipments/:orderId` | Privé/Seller | OrderTracking.jsx |
| 🆕 Disputes | POST/GET/PUT | `/api/v1/disputes` | Privé/Seller/Admin | DisputeCenter.jsx |
| 🆕 Coupons | POST/GET | `/api/v1/coupons`, `/api/v1/coupons/apply` | Seller/Admin, Privé | Checkout.jsx |
| 🆕 Messages | GET/POST | `/api/v1/messages/:conversationId` | Privé | ChatWidget.jsx |
| 🆕 Notifications | GET/PUT | `/api/v1/notifications` | Privé | NotificationBell.jsx |
| 🆕 Recently Viewed | GET | `/api/v1/products/recently-viewed` | Privé | RecommendedProducts.jsx |

---

## 14. Format de Réponse Standardisé

```js
// utils/ApiResponse.js
export class ApiResponse {
  constructor(statusCode, data, message = "Succès") {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}
```

Exemple de réponse JSON :

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Liste des produits",
  "data": {
    "data": [ { "id": "...", "name": "Casque Bluetooth", "finalPrice": 3500 } ],
    "pagination": { "page": 1, "limit": 20, "total": 87, "totalPages": 5 }
  }
}
```

---

## 15. Sécurité

- **Hashage des mots de passe** : bcryptjs (salt rounds ≥ 10), jamais de mot de passe en clair en base.
- **JWT** : token d'accès court (15 min) + refresh token (7 jours) stocké en cookie httpOnly.
- **Helmet** : en-têtes HTTP sécurisés par défaut.
- **CORS** : restreint à l'origine du frontend (`CLIENT_URL`).
- **Rate limiting** : protection contre le brute-force sur `/auth/login`.
- **Validation stricte des DTO** : aucune donnée non validée n'atteint la couche service.
- **express-mongo-sanitize** : protection contre les injections NoSQL.
- **Autorisations par rôle** : `customer`, `seller`, `admin` via `restrictTo()`.
- 🆕 **Webhooks de paiement** : vérification de signature (Stripe/Chargily) avant traitement.
- 🆕 **Socket.io** : authentification par JWT sur la connexion (`handshake.auth.token`), rooms isolées par utilisateur/conversation.

---

## 16. Intégration avec le Frontend Existant

| Élément Frontend | Élément Backend correspondant |
|---|---|
| AuthContext.jsx | `/api/v1/auth/*` + JWT stocké côté client |
| CartContext.jsx | `/api/v1/cart` |
| WishlistContext.jsx | `/api/v1/wishlist` |
| data/products.js (mock) | GET `/api/v1/products` |
| data/categories.js (mock) | GET `/api/v1/categories` |
| SellerDashboard.jsx | Routes `restrictTo("seller")` sur `/products`, `/orders`, 🆕 `/shops/:id/analytics` |
| 🆕 OrderTracking.jsx | GET `/api/v1/shipments/:orderId` |
| 🆕 ChatWidget.jsx | `/api/v1/messages/*` + Socket.io |
| 🆕 NotificationBell.jsx | `/api/v1/notifications` + Socket.io |
| 🆕 DisputeCenter.jsx | `/api/v1/disputes/*` |
| translations.js / LanguageContext | Reste géré côté frontend (i18n statique) |

---

## 17. 🆕 Analyse des manques vs AliExpress (priorisation)

### 🔴 Manques critiques (fonctionnalités cœur d'un vrai marketplace)

1. **Multi-vendeurs** — `Shop.model.js`, commissions, dashboard vendeur avec analytics.
2. **Suivi de commande & logistique** — `Shipment.model.js`, `shipping.service.js`, historique de statuts horodaté sur `Order`.
3. **Système d'avis enrichi** — photos/vidéos, avis vérifiés après achat, réponse vendeur, notes par critère.
4. **Protection acheteur / Litiges** — `Dispute.model.js`, workflow ouverture → réponse vendeur → arbitrage admin → remboursement, fenêtre de protection.

### 🟠 Manques importants (expérience utilisateur attendue)

5. **Coupons & Promotions** — `Coupon.model.js`, `promotion.service.js`.
6. **Messagerie acheteur-vendeur** — `Conversation.model.js` / `Message.model.js`, Socket.io.
7. **Notifications** — `Notification.model.js` + service, push temps réel.
8. **Recommandation** — historique de navigation (`RecentlyViewed`), produits similaires.
9. **Paiement réellement intégré** — `payment.service.js` avec webhooks, `refund.service.js`, `paymentStatus` distinct du `status`.

### 🟡 Manques secondaires (utiles mais non bloquants pour un premier MVP)

| Fonctionnalité AliExpress | Statut dans l'architecture mise à jour |
|---|---|
| Multi-devises / conversion automatique | Absent — non prioritaire pour le marché algérien |
| Programme de fidélité (coins, cashback) | Absent |
| Comparateur de produits | Absent |
| Filtres avancés (livraison gratuite, note ≥4★, vendeurs vérifiés) | 🆕 Ajoutés dans `product.service.js` (`freeShipping`, `minRating`) |
| Historique de prix / alertes de baisse | Partiel — `wishlist_price_drop` prévu via `notification.service.js` |
| Retours produit (workflow distinct du litige) | Absent — à envisager en V2 comme extension de `Dispute` |
| Modération des produits par l'admin avant publication | 🆕 Ajouté (`moderationStatus` sur `Product`) |
| Analytics vendeur (top produits, taux de conversion) | 🆕 Ajouté (`shop.service.js#getShopAnalytics`) |

---

## 18. 🆕 Roadmap recommandée (contexte freelance / marché algérien)

Le projet MoExpress est plus proche d'un **e-commerce mono ou multi-boutique local** que d'un
marketplace international comme AliExpress. Il n'est donc pas nécessaire de tout reproduire à
l'identique. Priorité aux 4 fonctionnalités à plus fort impact perçu pour l'effort de développement
le plus raisonnable :

1. **Tracking de commande simple** (`Shipment.model.js` + statuts horodatés sur `Order`) — rassure l'acheteur sans nécessiter d'intégration transporteur complexe au démarrage (statut mis à jour manuellement par le vendeur/admin).
2. **Coupons** (`Coupon.model.js` + `promotion.service.js`) — levier marketing simple à forte valeur perçue.
3. **Avis avec photos** (`Review.model.js` enrichi) — renforce la confiance, différenciateur fort en e-commerce local.
4. **Notifications** (`Notification.model.js` + Socket.io) — améliore la rétention (commande expédiée, réponse vendeur, baisse de prix).

Le multi-vendeurs complet, les litiges formalisés, la messagerie temps réel et le moteur de
recommandation restent pertinents mais peuvent être traités en **V2**, une fois le socle
(auth, produits, commandes, paiement) stabilisé en production.

---

## 19. Prochaines Étapes Suggérées

1. Initialiser le projet (`npm init`, structure ci-dessus) et connecter MongoDB Atlas.
2. Implémenter l'auth (register/login/JWT) — bloc fondateur pour toutes les routes protégées.
3. Implémenter products + categories (lecture publique), avec `moderationStatus` dès le départ.
4. Implémenter cart et wishlist, puis brancher les Contexts React dessus.
5. Implémenter orders + checkout, avec `statusHistory` et `paymentStatus` dès le départ.
6. 🆕 Implémenter le tracking de commande simple (`Shipment.model.js`, mise à jour manuelle des statuts).
7. 🆕 Implémenter les coupons (`Coupon.model.js`, `promotion.service.js`) et les brancher au checkout.
8. 🆕 Enrichir les avis (photos, `verifiedPurchase`, réponse vendeur).
9. 🆕 Implémenter les notifications (in-app d'abord, Socket.io ensuite pour le temps réel).
10. Ajouter Swagger (`/api-docs`) et les tests Jest/Supertest.
11. 🆕 Une fois le MVP stable : multi-vendeurs complet (Shop + commissions + analytics), litiges, messagerie temps réel, recommandations.
12. Déployer (Render/Railway pour l'API, MongoDB Atlas pour la base).