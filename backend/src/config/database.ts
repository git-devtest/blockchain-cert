import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ override: false });

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  options: "-c timezone=America/Bogota",
});

pool.on("error", (err) => {
  console.error("PostgreSQL error:", err);
  process.exit(-1);
});