import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

connectDB();

const server = app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé en mode ${process.env.NODE_ENV} sur le port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("💥 UNHANDLED REJECTION! Extinction du serveur...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
