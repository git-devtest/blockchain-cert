import { pool } from "../config/database";

export interface Certificacion {
  id?: number;
  hash_documento: string;
  descripcion: string;
  wallet_address: string;
  tx_hash?: string;
  created_at?: Date;
}

export const CertificacionModel = {
  async crear(data: Omit<Certificacion, "id" | "created_at">): Promise<Certificacion> {
    const result = await pool.query(
      `INSERT INTO certificaciones (hash_documento, descripcion, wallet_address, tx_hash)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.hash_documento, data.descripcion, data.wallet_address, data.tx_hash]
    );
    return result.rows[0];
  },

  async buscarPorHash(hash: string): Promise<Certificacion | null> {
    const result = await pool.query(
      `SELECT * FROM certificaciones WHERE hash_documento = $1`,
      [hash]
    );
    return result.rows[0] || null;
  },

  async listar(): Promise<Certificacion[]> {
    const result = await pool.query(
      `SELECT * FROM certificaciones ORDER BY created_at DESC`
    );
    return result.rows;
  },
};