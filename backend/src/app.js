import express from "express";
import cors from "cors";
import helmet from "helmet"; // utilisé pour sécuriser les entêtes HTTP en ajoutant des headers de sécurité
import morgan from "morgan"; // utilisé pour logger les requêtes HTTP
import mongoSanitize from "express-mongo-sanitize"; // utilisé pour prévenir l'injection de code NoSQL
import rateLimit from "express-rate-limit"; // utilisé pour limiter le nombre de requêtes HTTP

import { errorHandler } from "./middlewares/error.middleware.js";
import { notFound } from "./middlewares/notFound.middleware.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", 
    credentials: true, 
  })
);
// app.use(mongoSanitize()); // Désactivé temporairement car cause un bug avec Express 5

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 300, 
  message: "Trop de requêtes depuis cette IP, veuillez réessayer plus tard.",
});
app.use("/api", limiter);
app.use(express.json({ limit: "10kb" })); 
app.use(express.urlencoded({ extended: true })); 

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "success", message: "Le serveur fonctionne parfaitement !" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
