// Configuration de Morgan pour le logging HTTP
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Morgan : Middleware de logging pour Node.js
 * Permet de tracer toutes les requêtes HTTP
 *
 * Niveaux de log :
 * - combined : Standard Apache combined log format
 * - common : Standard Apache common log format
 * - dev : Format coloré pour le développement
 * - short : Format court
 * - tiny : Format minimal
 *
 * Cas d'utilisation :
 * 1. Débogage des requêtes API
 * 2. Audit de sécurité
 * 3. Analyse des performances
 * 4. Monitoring des erreurs
 * 5. Analytics des utilisateurs
 */

// Récupérer le chemin du fichier actuel (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Créer le dossier logs s'il n'existe pas
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Configuration des streams de logging
export const logStream = {
  // Stream pour les logs d'accès
  access: fs.createWriteStream(
    path.join(logsDir, "access.log"),
    { flags: "a" }, // Append
  ),
  // Stream pour les logs d'erreur
  error: fs.createWriteStream(path.join(logsDir, "error.log"), { flags: "a" }),
  // Stream pour les logs des requêtes HTTP
  http: fs.createWriteStream(path.join(logsDir, "http.log"), { flags: "a" }),
};

// Format personnalisé pour les logs
const customFormat = (tokens, req, res) => {
  const status = res.statusCode;
  const color =
    status >= 500
      ? "\x1b[31m" // Rouge
      : status >= 400
        ? "\x1b[33m" // Jaune
        : status >= 300
          ? "\x1b[36m" // Cyan
          : status >= 200
            ? "\x1b[32m" // Vert
            : "\x1b[0m"; // Par défaut

  return [
    "\x1b[36m", // Cyan
    new Date().toISOString(),
    "\x1b[0m", // Reset
    "\x1b[33m", // Jaune
    tokens.method(req, res),
    "\x1b[0m",
    tokens.url(req, res),
    color,
    tokens.status(req, res),
    "\x1b[0m",
    tokens.res(req, res, "content-length") || "0",
    "B -",
    "\x1b[35m", // Magenta
    tokens["response-time"](req, res),
    "ms",
    "\x1b[0m",
    "-",
    "\x1b[32m", // Vert
    tokens["user-agent"](req, res) || "No User-Agent",
    "\x1b[0m",
    "-",
    tokens["referrer"](req, res) || "No Referrer",
    "-",
    tokens["remote-addr"](req, res),
  ].join(" ");
};

// Configuration des formats de logging
export const morganFormats = {
  // Format pour le développement (coloré)
  dev: (tokens, req, res) => {
    const status = res.statusCode;
    const color =
      status >= 500
        ? "\x1b[31m"
        : status >= 400
          ? "\x1b[33m"
          : status >= 300
            ? "\x1b[36m"
            : status >= 200
              ? "\x1b[32m"
              : "\x1b[0m";

    return [
      "\x1b[90m", // Gris
      `[${new Date().toLocaleTimeString()}]`,
      "\x1b[0m",
      tokens.method(req, res).padEnd(8),
      "\x1b[33m",
      tokens.url(req, res),
      "\x1b[0m",
      color,
      tokens.status(req, res),
      "\x1b[0m",
      tokens.res(req, res, "content-length") || "0",
      "B -",
      "\x1b[90m",
      tokens["response-time"](req, res),
      "ms",
      "\x1b[0m",
    ].join(" ");
  },

  // Format pour l'API (JSON)
  json: (tokens, req, res) => {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: parseInt(tokens.status(req, res)),
      responseTime: parseInt(tokens["response-time"](req, res)),
      contentLength: parseInt(tokens.res(req, res, "content-length")) || 0,
      userAgent: tokens["user-agent"](req, res),
      ip: tokens["remote-addr"](req, res),
    });
  },

  // Format pour la sécurité (IP, méthode, URL)
  security: (tokens, req, res) => {
    return [
      `[${new Date().toISOString()}]`,
      `[${tokens["remote-addr"](req, res)}]`,
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      `"${tokens["user-agent"](req, res)}"`,
    ].join(" ");
  },
};

// Middlewares de logging
export const morganMiddleware = {
  // Log des accès API
  api: morgan(customFormat, {
    stream: logStream.access,
  }),

  // Log des erreurs
  error: morgan("combined", {
    stream: logStream.error,
    skip: (req, res) => res.statusCode < 400, // Ne log que les erreurs
  }),

  // Log des requêtes HTTP (développement)
  dev: morgan(morganFormats.dev),

  // Log des requêtes HTTP (production)
  combined: morgan("combined", {
    stream: logStream.http,
  }),

  // Log des requêtes HTTP (format JSON)
  json: morgan(morganFormats.json, {
    stream: logStream.access,
  }),

  // Log de sécurité
  security: morgan(morganFormats.security, {
    stream: fs.createWriteStream(path.join(logsDir, "security.log"), {
      flags: "a",
    }),
    // Ne log que les requêtes potentiellement dangereuses
    skip: (req) => {
      const url = req.url;
      // Log des requêtes suspectes
      const suspicious = [
        "/admin",
        "/config",
        "/.env",
        "/wp-admin",
        "sql",
        "exec",
        "cmd",
      ];
      return !suspicious.some((pattern) => url.includes(pattern));
    },
  }),

  // Middleware personnalisé pour le logging
  custom: (options = {}) => {
    const format = options.format || "dev";
    const stream = options.stream || process.stdout;

    return morgan(format, {
      stream: stream,
      skip: options.skip || (() => false),
    });
  },
};

// Fonction de logging d'application (hors HTTP)
export const appLogger = {
  info: (message, data = null) => {
    const log = {
      level: "INFO",
      timestamp: new Date().toISOString(),
      message,
      data,
    };
    console.log(JSON.stringify(log));

    // Écrire dans le fichier de log
    fs.appendFileSync(
      path.join(logsDir, "app.log"),
      JSON.stringify(log) + "\n",
    );
  },

  error: (message, error = null) => {
    const log = {
      level: "ERROR",
      timestamp: new Date().toISOString(),
      message,
      error: error
        ? {
            message: error.message,
            stack: error.stack,
          }
        : null,
    };
    console.error(JSON.stringify(log));

    fs.appendFileSync(
      path.join(logsDir, "error.log"),
      JSON.stringify(log) + "\n",
    );
  },

  warn: (message, data = null) => {
    const log = {
      level: "WARN",
      timestamp: new Date().toISOString(),
      message,
      data,
    };
    console.warn(JSON.stringify(log));

    fs.appendFileSync(
      path.join(logsDir, "app.log"),
      JSON.stringify(log) + "\n",
    );
  },

  debug: (message, data = null) => {
    if (process.env.NODE_ENV === "development") {
      const log = {
        level: "DEBUG",
        timestamp: new Date().toISOString(),
        message,
        data,
      };
      console.debug(JSON.stringify(log));

      fs.appendFileSync(
        path.join(logsDir, "debug.log"),
        JSON.stringify(log) + "\n",
      );
    }
  },
};

export default {
  morganMiddleware,
  appLogger,
  logStream,
  logsDir,
};
