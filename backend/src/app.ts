import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import certificacionesRoutes from "./routes/certificaciones.routes";
import identificadoresRoutes from "./routes/identificadores.routes";
import { pool } from "./config/database";
import { contrato } from "./config/contrato";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", async (req, res) => {
  const health: any = {
    status: "ok",
    timestamp: new Date().toISOString(),
    servicios: {
      api: "ok",
      database: "checking",
      blockchain: "checking",
    },
  };

  try {
    await pool.query("SELECT 1");
    health.servicios.database = "ok";
  } catch {
    health.servicios.database = "error";
    health.status = "degraded";
  }

  try {
    await contrato.verificar("health-check-ping");
    health.servicios.blockchain = "ok";
  } catch (err: any) {
    health.servicios.blockchain = err.code ? "error" : "ok";
    if (err.code) health.status = "degraded";
  }

  res.status(health.status === "ok" ? 200 : 503).json(health);
});

app.use("/api", certificacionesRoutes);
app.use("/api/identificadores", identificadoresRoutes);

export default app;
