import { Request, Response, NextFunction } from "express";
import { verificarToken } from "../config/jwt";
import { AuditoriaModel } from "../models/auditoria.model";

export interface RequestConUsuario extends Request {
  usuario?: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
  };
}

export const autenticar = (req: RequestConUsuario, res: Response, next: NextFunction): void => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ error: "No autenticado" });
    return;
  }

  try {
    const payload = verificarToken(token);
    req.usuario = payload;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};

export const autorizar = (...roles: string[]) => {
  return (req: RequestConUsuario, res: Response, next: NextFunction): void => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      res.status(403).json({ error: "No tienes permisos para realizar esta acción" });
      return;
    }
    next();
  };
};

export const registrarActividad = (actividad: string, detalle?: (req: RequestConUsuario) => object) => {
  return async (req: RequestConUsuario, res: Response, next: NextFunction): Promise<void> => {
    if (req.usuario) {
      await AuditoriaModel.registrar({
        usuario_id: req.usuario.id,
        rol: req.usuario.rol,
        actividad,
        detalle: detalle ? detalle(req) : undefined,
        ip_address: req.ip
      });
    }
    next();
  };
};
