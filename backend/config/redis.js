import redis from "redis";

const redisConfig = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD || "",
  // Timeout de connexion
  connectTimeout: 10000,
  // Préfixe pour éviter les collisions de clés
  prefix: "app:",
  // Rétry stratégie
  retryStrategy: (times) => {
    // Attendre avant de réessayer
    if (times > 10) {
      console.error("Impossible de se connecter à Redis");
      return null;
    }
    // Temps d'attente exponentiel
    return Math.min(times * 100, 3000);
  },
};

export const createRedisClient = () => {
  const client = redis.createClient(redisConfig);
  client.on("connect", () => {
    console.log("✅ Redis connecté avec succès");
  });
  client.on("error", (error) => {
    console.error("❌ Erreur Redis:", error.message);
  });
  client.on("ready", () => {
    console.log("🔄 Redis prêt à être utilisé");
  });
  client.on("end", () => {
    console.warn("⚠️ Redis déconnecté");
  });
  return client;
};

export const cacheData = async (client, key, data, ttl = 3600) => {
  try {
    const serializeData = JSON.stringify(data);
    await client.setEx(key, ttl, serializeData);
    return true;
  } catch (error) {
    console.error("erreur cacheData : ", error.message);
    return false;
  }
};

export const getCachedData = async (client, key) => {
  try {
    const data = await client.get(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Erreur getCachedData:", error.message);
    return null;
  }
};
export const invalidateCache = async (client, pattern) => {
  try {
    // Récupérer toutes les clés correspondant au pattern
    // client.keys : Commande Redis KEYS
    // Retourne un tableau de toutes les clés correspondant au pattern
    // ⚠️ ATTENTION : KEYS est lent sur de grandes bases de données
    // En production, utiliser SCAN à la place
    const keys = await client.keys(pattern);

    // Si des clés ont été trouvées
    if (keys.length > 0) {
      // Supprimer toutes les clés
      // client.del : Commande Redis DEL
      // Peut supprimer plusieurs clés à la fois
      await client.del(keys);
      // Exemple : si keys = ['product:1', 'product:2']
      // DEL product:1 product:2 supprime les deux clés
    }

    // Retourner true pour indiquer le succès
    return true;
  } catch (error) {
    console.error("Erreur invalidateCache:", error.message);
    return false;
  }
};

// Fonction pour incrémenter un compteur (rate limiting)
// client : Instance du client Redis
// key : Clé du compteur (ex: 'rate:user:123')
// ttl : Durée de vie du compteur en secondes
export const incrementCounter = async (client, key, ttl = 60) => {
  try {
    // client.incr : Commande Redis INCR
    // Incrémente la valeur d'une clé de 1
    // Si la clé n'existe pas, elle est créée avec la valeur 1
    const count = await client.incr(key);

    // Si c'est la première incrémentation (count === 1)
    if (count === 1) {
      // Définir l'expiration du compteur
      // client.expire : Commande Redis EXPIRE
      // Définit une durée de vie pour la clé
      // Après ttl secondes, la clé sera automatiquement supprimée
      await client.expire(key, ttl);
    }

    // Retourner le nombre d'incrémentations
    return count;
  } catch (error) {
    console.error("Erreur incrementCounter:", error.message);
    // Retourner 0 en cas d'erreur
    return 0;
  }
};

// Fonction pour le rate limiting
// client : Instance du client Redis
// key : Clé de l'utilisateur/ressource à limiter
// maxRequests : Nombre maximum de requêtes autorisées
// windowSeconds : Fenêtre de temps en secondes
export const rateLimit = async (client, key, maxRequests, windowSeconds = 60) => {
  try {
    // Incrémenter le compteur pour cette clé
    // windowSeconds : Durée de la fenêtre de temps
    const count = await incrementCounter(key, windowSeconds);

    // Vérifier si le nombre de requêtes dépasse la limite
    if (count > maxRequests) {
      // Retourner un objet indiquant que la limite est dépassée
      return {
        allowed: false, // Accès refusé
        limit: maxRequests, // Limite maximale
        remaining: 0, // Requêtes restantes dans la fenêtre
        reset: await client.ttl(key), // Temps restant avant réinitialisation
        // client.ttl : Time To Live - temps restant en secondes
      };
    }

    // La limite n'est pas atteinte
    return {
      allowed: true, // Accès autorisé
      limit: maxRequests, // Limite maximale
      remaining: maxRequests - count, // Requêtes restantes disponibles
      reset: await client.ttl(key), // Temps restant avant réinitialisation
    };
  } catch (error) {
    console.error("Erreur rateLimit:", error.message);
    // En cas d'erreur, autoriser par défaut (fallback)
    return {
      allowed: true,
      limit: maxRequests,
      remaining: maxRequests,
    };
  }
};
export default {
  // createRedisClient : Créer une instance de client Redis
  createRedisClient,
  // cacheData : Stocker des données en cache
  cacheData,
  // getCachedData : Récupérer des données du cache
  getCachedData,
  // invalidateCache : Supprimer des données du cache
  invalidateCache,
  // incrementCounter : Incrémenter un compteur
  incrementCounter,
  // rateLimit : Vérifier et appliquer le rate limiting
  rateLimit,
};
