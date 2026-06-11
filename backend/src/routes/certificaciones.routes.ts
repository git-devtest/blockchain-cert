import { Router } from "express";
import { CertificacionesController } from "../controllers/certificaciones.controller";

const router = Router();

/**
 * @openapi
 * /api/certificar:
 *   post:
 *     summary: Certifica un documento on-chain
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contenido
 *               - descripcion
 *             properties:
 *               contenido:
 *                 type: string
 *                 example: "Texto del documento a certificar"
 *               descripcion:
 *                 type: string
 *                 example: "Acta de reunión junio 2026"
 *     responses:
 *       201:
 *         description: Documento certificado exitosamente
 *       400:
 *         description: Campos requeridos faltantes
 *       409:
 *         description: Documento ya certificado
 *       503:
 *         description: Wallet sin fondos o red no disponible
 */
router.post("/certificar", CertificacionesController.certificar);

/**
 * @openapi
 * /api/verificar/{hash}:
 *   get:
 *     summary: Verifica un documento por su hash
 *     parameters:
 *       - in: path
 *         name: hash
 *         required: true
 *         schema:
 *           type: string
 *         example: "64e1fbf65625147393a5fc68b248551188d5df37544d41822f7854ade0c23a19"
 *     responses:
 *       200:
 *         description: Documento encontrado y verificado
 *       404:
 *         description: Documento no certificado
 */
router.get("/verificar/:hash", CertificacionesController.verificar);

/**
 * @openapi
 * /api/certificaciones:
 *   get:
 *     summary: Lista todas las certificaciones
 *     responses:
 *       200:
 *         description: Lista de certificaciones
 */
router.get("/certificaciones", CertificacionesController.listar);

export default router;