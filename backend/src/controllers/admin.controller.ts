import { Request, Response } from "express";
import { AuditoriaModel } from "../models/auditoria.model";
import { UsuarioModel } from "../models/usuario.model";
import { pool } from "../config/database";

export const AdminController = {

  async auditoria(req: Request, res: Response): Promise<void> {
    try {
      const limite = parseInt(req.query.limite as string) || 100;
      const registros = await AuditoriaModel.listar(limite);
      res.json(registros);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async certificaciones(req: Request, res: Response): Promise<void> {
    try {
      const result = await pool.query(
        `SELECT c.*, u.nombre as usuario_nombre, u.email as usuario_email
         FROM certificaciones c
         LEFT JOIN usuarios u ON c.usuario_id = u.id
         ORDER BY c.created_at DESC`
      );
      res.json(result.rows);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async usuarios(req: Request, res: Response): Promise<void> {
    try {
      const usuarios = await UsuarioModel.listar();
      res.json(usuarios);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
