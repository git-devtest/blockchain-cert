import { Request, Response } from "express";
import crypto from "crypto";
import { contrato } from "../config/contrato";
import { CertificacionModel } from "../models/certificacion.model";

export const CertificacionesController = {
  async certificar(req: Request, res: Response): Promise<void> {
    try {
      const { contenido, descripcion } = req.body;

      if (!contenido || !descripcion) {
        res.status(400).json({ error: "contenido y descripcion son requeridos" });
        return;
      }

      const hashDocumento = crypto
        .createHash("sha256")
        .update(contenido)
        .digest("hex");

      const existeEnDB = await CertificacionModel.buscarPorHash(hashDocumento);
      if (existeEnDB) {
        res.status(409).json({ error: "Documento ya certificado", data: existeEnDB });
        return;
      }

      const tx = await contrato.certificar(hashDocumento, descripcion);
      await tx.wait();

      const certificacion = await CertificacionModel.crear({
        hash_documento: hashDocumento,
        descripcion,
        wallet_address: await (contrato.runner as any).getAddress(),
        tx_hash: tx.hash,
      });

      res.status(201).json({
        mensaje: "Documento certificado exitosamente",
        hash: hashDocumento,
        tx_hash: tx.hash,
        data: certificacion,
      });
    } catch (error: any) {
      if (error.code === 'INSUFFICIENT_FUNDS') {
        res.status(503).json({ error: "Wallet sin fondos para pagar el fee" });
        return;
      }
      if (error.code === 'NETWORK_ERROR' || error.code === 'SERVER_ERROR') {
        res.status(503).json({ error: "Red blockchain no disponible" });
        return;
      }
      if (error.message?.includes("Documento ya certificado")) {
        res.status(409).json({ error: "Documento ya certificado en blockchain" });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  },

  async verificar(req: Request, res: Response): Promise<void> {
    try {
      const hash = req.params.hash as string;

      const [existe, descripcion, certificadoPor, timestamp] =
        await contrato.verificar(hash);

      if (!existe) {
        res.status(404).json({ existe: false, mensaje: "Documento no certificado" });
        return;
      }

      const enDB = await CertificacionModel.buscarPorHash(hash);

      res.json({
        existe: true,
        hash,
        descripcion,
        certificadoPor,
        timestamp: new Date(Number(timestamp) * 1000).toISOString(),
        tx_hash: enDB?.tx_hash,
        created_at: enDB?.created_at,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async listar(req: Request, res: Response): Promise<void> {
    try {
      const certificaciones = await CertificacionModel.listar();
      res.json(certificaciones);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};