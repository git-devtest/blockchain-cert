import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blockchain Cert API",
      version: "1.0.0",
      description: "API REST para certificación de documentos on-chain en Polygon Amoy testnet",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor Backend local",
      },
      {
        url: "http://localhost:3000/health",
        description: "Estado de salud, servidor backend local",
      },
      {
        url: "http://localhost:3000/api-docs",
        description: "Este documento (servidor)",
      },
      {
        url: "http://localhost:4200",
        description: "Servidor Frontend local",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
