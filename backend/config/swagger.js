// Configuration de Swagger pour la documentation de l'API
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

/**
 * Swagger : Outil de documentation d'API
 * Génère une documentation interactive à partir des annotations
 *
 * Cas d'utilisation :
 * 1. Documentation d'API REST
 * 2. Tests d'API
 * 3. Intégration avec les clients
 * 4. Génération de code client
 */

// Options de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API E-commerce Platform",
      version: "1.0.0",
      description: "Documentation de l'API de la plateforme e-commerce",
      termsOfService: "http://example.com/terms/",
      contact: {
        name: "Support API",
        email: "api@example.com",
        url: "http://example.com/contact",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:5000",
        description: "Serveur de développement",
      },
      {
        url: process.env.PRODUCTION_API_URL || "https://api.example.com",
        description: "Serveur de production",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        sessionAuth: {
          type: "apiKey",
          in: "cookie",
          name: "sessionId",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            role: {
              type: "string",
              enum: ["user", "admin", "superAdmin"],
            },
            coins: { type: "number" },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Product: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            comparePrice: { type: "number" },
            quantity: { type: "number" },
            category: { type: "string" },
            images: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  url: { type: "string" },
                  publicId: { type: "string" },
                  isMain: { type: "boolean" },
                },
              },
            },
            rating: { type: "number" },
            numReviews: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Order: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  product: { type: "string" },
                  quantity: { type: "number" },
                  price: { type: "number" },
                },
              },
            },
            totalAmount: { type: "number" },
            status: {
              type: "string",
              enum: [
                "pending",
                "processing",
                "confirmed",
                "shipped",
                "delivered",
                "cancelled",
              ],
            },
            paymentStatus: {
              type: "string",
              enum: ["pending", "completed", "failed", "refunded"],
            },
            shippingAddress: {
              type: "object",
              properties: {
                street: { type: "string" },
                city: { type: "string" },
                state: { type: "string" },
                country: { type: "string" },
                zipCode: { type: "string" },
              },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: "Auth", description: "Authentification" },
      { name: "Users", description: "Gestion des utilisateurs" },
      { name: "Products", description: "Gestion des produits" },
      { name: "Orders", description: "Gestion des commandes" },
      { name: "Cart", description: "Gestion du panier" },
      { name: "Wishlist", description: "Liste de souhaits" },
      { name: "Support", description: "Support client" },
      { name: "Admin", description: "Administration" },
    ],
  },
  apis: ["./routes/*.js", "./controllers/*.js", "./models/*.js"],
};

// Génération de la documentation Swagger
export const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware Swagger UI
export const swaggerUiMiddleware = swaggerUi.serve;
export const swaggerUiSetup = swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "API Documentation - E-commerce Platform",
  swaggerOptions: {
    docExpansion: "none",
    filter: true,
    showRequestDuration: true,
    persistAuthorization: true,
  },
});

// Middleware pour la documentation
export const swaggerDocs = (app) => {
  // Route de documentation
  app.use("/api/docs", swaggerUiMiddleware, swaggerUiSetup);

  // Route pour la spécification JSON
  app.get("/api/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log("📚 Documentation Swagger disponible sur /api/docs");
};

export default {
  swaggerSpec,
  swaggerUiMiddleware,
  swaggerUiSetup,
  swaggerDocs,
};
