import { pool } from "../config/database";
import bcrypt from "bcryptjs";

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  password_hash?: string;
  rol: 'admin' | 'certificador';
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const UsuarioModel = {

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const result = await pool.query(
      `SELECT * FROM usuarios WHERE email = $1 AND activo = true`,
      [email]
    );
    return result.rows[0] || null;
  },

  async buscarPorId(id: number): Promise<Usuario | null> {
    const result = await pool.query(
      `SELECT id, nombre, email, rol, activo, created_at, updated_at
       FROM usuarios WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async validarPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },

  async cambiarPassword(id: number, nuevaPassword: string): Promise<void> {
    const hash = await bcrypt.hash(nuevaPassword, 12);
    await pool.query(
      `UPDATE usuarios SET password_hash = $1 WHERE id = $2`,
      [hash, id]
    );
  },

  async guardarTokenRecuperacion(email: string, token: string, expira: Date): Promise<void> {
    await pool.query(
      `UPDATE usuarios SET reset_token = $1, reset_token_expira = $2 WHERE email = $3`,
      [token, expira, email]
    );
  },

  async buscarPorToken(token: string): Promise<Usuario | null> {
    const result = await pool.query(
      `SELECT * FROM usuarios
       WHERE reset_token = $1
       AND reset_token_expira > NOW()
       AND activo = true`,
      [token]
    );
    return result.rows[0] || null;
  },

  async invalidarToken(id: number): Promise<void> {
    await pool.query(
      `UPDATE usuarios SET reset_token = NULL, reset_token_expira = NULL WHERE id = $1`,
      [id]
    );
  },

  async listar(): Promise<Usuario[]> {
    const result = await pool.query(
      `SELECT id, nombre, email, rol, activo, created_at FROM usuarios ORDER BY created_at DESC`
    );
    return result.rows;
  }
};
