import { pool } from "../config/database";

export interface RegistroAuditoria {
  id?: number;
  usuario_id?: number;
  rol?: string;
  actividad: string;
  detalle?: object;
  ip_address?: string;
  created_at?: string;
  usuario_nombre?: string;
  usuario_email?: string;
}

export const AuditoriaModel = {

  async registrar(data: Omit<RegistroAuditoria, 'id' | 'created_at'>): Promise<void> {
    await pool.query(
      `INSERT INTO auditoria (usuario_id, rol, actividad, detalle, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        data.usuario_id || null,
        data.rol || null,
        data.actividad,
        data.detalle ? JSON.stringify(data.detalle) : null,
        data.ip_address || null
      ]
    );
  },

  async listar(limite: number = 100): Promise<RegistroAuditoria[]> {
    const result = await pool.query(
      `SELECT a.*, u.nombre as usuario_nombre, u.email as usuario_email
       FROM auditoria a
       LEFT JOIN usuarios u ON a.usuario_id = u.id
       ORDER BY a.created_at DESC
       LIMIT $1`,
      [limite]
    );
    return result.rows;
  }
};