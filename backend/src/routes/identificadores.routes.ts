import { Router } from "express";
import { IdentificadoresController } from "../controllers/identificadores.controller";
import { autenticar } from "../middleware/auth.middleware";

const router = Router();

/**
 * @openapi
 * /api/identificadores/tipos:
 *   get:
 *     summary: Lista los tipos de documento disponibles
 *     responses:
 *       200:
 *         description: Lista de tipos de documento
 */
router.get("/tipos", autenticar, IdentificadoresController.listarTipos);

/**
 * @openapi
 * /api/identificadores/generar:
 *   post:
 *     summary: Genera un nuevo identificador para un tipo de documento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo_documento_id
 *             properties:
 *               tipo_documento_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Identificador generado exitosamente
 *       400:
 *         description: tipo_documento_id es requerido
 */
router.post("/generar", autenticar, IdentificadoresController.generar);

/**
 * @openapi
 * /api/identificadores/consultar/{codigo}:
 *   get:
 *     summary: Consulta un identificador y su documento certificado asociado
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         example: CBC-CARTA-00001-2026
 *     responses:
 *       200:
 *         description: Información del identificador
 *       404:
 *         description: Identificador no encontrado
 */
router.get("/consultar/:codigo", IdentificadoresController.consultar);

export default router;
