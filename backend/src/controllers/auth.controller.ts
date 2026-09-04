import { Request, Response } from "express";
import { UsuarioModel } from "../models/usuario.model";
import { AuditoriaModel } from "../models/auditoria.model";
import { generarToken } from "../config/jwt";
import crypto from "crypto";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 8 * 60 * 60 * 1000, // 8 horas
};

export const AuthController = {

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email y contraseña son requeridos" });
        return;
      }

      const usuario = await UsuarioModel.buscarPorEmail(email);

      if (!usuario || !usuario.password_hash) {
        res.status(401).json({ error: "Credenciales incorrectas" });
        return;
      }

      const passwordValida = await UsuarioModel.validarPassword(password, usuario.password_hash);

      if (!passwordValida) {
        await AuditoriaModel.registrar({
          usuario_id: usuario.id,
          rol: usuario.rol,
          actividad: "LOGIN_FALLIDO",
          detalle: { email },
          ip_address: req.ip
        });
        res.status(401).json({ error: "Credenciales incorrectas" });
        return;
      }

      const token = generarToken({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      });

      await AuditoriaModel.registrar({
        usuario_id: usuario.id,
        rol: usuario.rol,
        actividad: "LOGIN",
        ip_address: req.ip
      });

      res.cookie("token", token, COOKIE_OPTIONS);
      res.json({
        mensaje: "Sesión iniciada",
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("token");
      res.json({ mensaje: "Sesión cerrada" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async perfil(req: any, res: Response): Promise<void> {
    try {
      const usuario = await UsuarioModel.buscarPorId(req.usuario.id);
      if (!usuario) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }
      res.json(usuario);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async recuperarPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ error: "Email es requerido" });
        return;
      }

      const usuario = await UsuarioModel.buscarPorEmail(email);

      if (!usuario) {
        // No revelar si el email existe o no
        res.json({ mensaje: "Si el email existe, recibirás instrucciones de recuperación" });
        return;
      }

      const token = crypto.randomUUID();
      const expira = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

      await UsuarioModel.guardarTokenRecuperacion(email, token, expira);

      await AuditoriaModel.registrar({
        usuario_id: usuario.id,
        rol: usuario.rol,
        actividad: "RECUPERAR_PASSWORD",
        ip_address: req.ip
      });

      // En desarrollo: retornar el token directamente
      // En producción: enviar email con el link
      const enlace = `http://localhost:4200/cambiar-password/${token}`;

      if (process.env.NODE_ENV === "production") {
        res.json({ mensaje: "Si el email existe, recibirás instrucciones de recuperación" });
      } else {
        res.json({
          mensaje: "Token de recuperación generado (modo desarrollo)",
          enlace,
          token,
          expira
        });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async cambiarPassword(req: Request, res: Response): Promise<void> {
    try {
      const token = req.params.token as string;
      const { nueva_password } = req.body;

      if (!nueva_password || nueva_password.length < 8) {
        res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });
        return;
      }

      const usuario = await UsuarioModel.buscarPorToken(token);

      if (!usuario) {
        res.status(400).json({ error: "Token inválido o expirado" });
        return;
      }

      await UsuarioModel.cambiarPassword(usuario.id!, nueva_password);
      await UsuarioModel.invalidarToken(usuario.id!);

      await AuditoriaModel.registrar({
        usuario_id: usuario.id,
        rol: usuario.rol,
        actividad: "CAMBIAR_PASSWORD",
        ip_address: req.ip
      });

      res.json({ mensaje: "Contraseña actualizada exitosamente" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
