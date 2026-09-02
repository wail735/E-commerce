// server.js - Point d'entrée de l'application
import express from "express";
import {
  corsMiddleware,
  morganMiddleware,
  helmetMiddleware,
  compressionMiddleware,
  sessionMiddleware,
  passport,
  configurePassport,
  swaggerDocs,
  connectDB,
  createRedisClient,
} from "./config/index.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { stripeWebhook } from "./payments/payment.controller.js";
import { initSocket } from "./config/socket.js";
import { registerChatSocketHandlers } from "./chat/chat.socket.js";
const app = express();

// 1. Connecter la base de données
connectDB();

// 2. Connecter Redis
const redisClient = createRedisClient();

app.use((req, res, next) => {
  console.log(`[INCOMING] ${req.method} ${req.url}`);
  next();
});

// 3. Middlewares de sécurité
app.use(helmetMiddleware);
app.use(corsMiddleware);

// 4. Compression
app.use(compressionMiddleware);

// 5. Logging
app.use(morganMiddleware.dev);

// 5.5 Stripe Webhook (Doit être avant express.json pour express.raw)
app.post("/api/v1/payments/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// 6. Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 7. Sessions
app.use(sessionMiddleware);

// 8. Passport
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// 9. Documentation Swagger
swaggerDocs(app);

// 10. Routes

app.use("/api/v1", routes);

// 11. Gestion des erreurs

app.use(errorHandler);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
const httpServer = app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📚 Documentation: http://localhost:${PORT}/api/docs`);
});

// Initialiser Socket.io et les gestionnaires de chat
const io = initSocket(httpServer);
registerChatSocketHandlers(io);
