import express from "express";
import dotenv from "dotenv";
import certificacionesRoutes from "./routes/certificaciones.routes";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", certificacionesRoutes);

export default app;