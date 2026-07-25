import { Request, Response } from "express";
import { IdentificadorModel } from "../models/identificador.model";
import { CertificacionModel } from "../models/certificacion.model";

const APP_URL = process.env.APP_URL || "http://localhost:4200";

export const IdentificadoresController = {

  async listarTipos(req: Request, res: Response): Promise<void> {
    try {
      const tipos = await IdentificadorModel.listarTipos();
      res.json(tipos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async generar(req: Request, res: Response): Promise<void> {
    try {
      const { tipo_documento_id } = req.body;

      if (!tipo_documento_id) {
        res.status(400).json({ error: "tipo_documento_id es requerido" });
        return;
      }

      const identificador = await IdentificadorModel.generar(tipo_documento_id);

      const parrafo = `Para verificar la integridad e inalterabilidad del presente documento, consulte en el sitio web ${APP_URL}/consultar ingresando el identificador que se encuentra en la esquina superior derecha de este documento.`;

      res.status(201).json({
        identificador,
        parrafo,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async consultar(req: Request, res: Response): Promise<void> {
    try {
      const codigo = req.params.codigo as string;
      const resultado = await IdentificadorModel.buscarPorCodigo(codigo);

      if (!resultado) {
        res.status(404).json({
          existe: false,
          mensaje: "Identificador no encontrado"
        });
        return;
      }

      if (!resultado.certificacion_id) {
        res.status(200).json({
          existe: true,
          certificado: false,
          codigo: resultado.codigo,
          mensaje: "El identificador existe pero aún no tiene un documento certificado asociado"
        });
        return;
      }

      res.json({
        existe: true,
        certificado: true,
        codigo: resultado.codigo,
        tipo_documento: resultado.tipo_nombre,
        descripcion: resultado.descripcion,
        wallet_address: resultado.wallet_address,
        tx_hash: resultado.tx_hash,
        hash_documento: resultado.hash_documento,
        fecha_certificacion: resultado.cert_created_at,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
