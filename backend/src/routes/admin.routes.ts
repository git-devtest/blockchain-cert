import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { autenticar, autorizar } from "../middleware/auth.middleware";

const router = Router();

/**
 * @openapi
 * /api/admin/auditoria:
 *   get:
 *     summary: Lista registros de auditoría (solo admin)
 *     parameters:
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           example: 100
 *     responses:
 *       200:
 *         description: Lista de registros de auditoría
 *       403:
 *         description: No autorizado
 */
router.get("/auditoria", autenticar, autorizar("admin"), AdminController.auditoria);

/**
 * @openapi
 * /api/admin/certificaciones:
 *   get:
 *     summary: Lista todas las certificaciones con usuario (solo admin)
 *     responses:
 *       200:
 *         description: Lista de certificaciones
 *       403:
 *         description: No autorizado
 */
router.get("/certificaciones", autenticar, autorizar("admin"), AdminController.certificaciones);

/**
 * @openapi
 * /api/admin/usuarios:
 *   get:
 *     summary: Lista todos los usuarios (solo admin)
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       403:
 *         description: No autorizado
 */
router.get("/usuarios", autenticar, autorizar("admin"), AdminController.usuarios);

export default router;
