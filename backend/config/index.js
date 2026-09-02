// Point d'entrée du dossier config
// Exporte toutes les configurations

export * from "./auth.js";
export * from "./database.js";
export * from "./cloudinary.js";
export * from "./email.js";
export * from "./redis.js";
export * from "./constants.js";
export * from "./cors.js";
export * from "./morgan.js";
export * from "./multer.js";
export * from "./rateLimit.js";
export * from "./helmet.js";
export * from "./compression.js";
export * from "./passport.js";
export * from "./session.js";
export * from "./validation.js";
export * from "./swagger.js";

// Export par défaut de toutes les configurations
export default {
  auth: await import("./auth.js"),
  database: await import("./database.js"),
  cloudinary: await import("./cloudinary.js"),
  email: await import("./email.js"),
  redis: await import("./redis.js"),
  constants: await import("./constants.js"),
  cors: await import("./cors.js"),
  morgan: await import("./morgan.js"),
  multer: await import("./multer.js"),
  rateLimit: await import("./rateLimit.js"),
  helmet: await import("./helmet.js"),
  compression: await import("./compression.js"),
  passport: await import("./passport.js"),
  session: await import("./session.js"),
  validation: await import("./validation.js"),
  swagger: await import("./swagger.js"),
};
