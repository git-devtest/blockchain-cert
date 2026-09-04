import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { autenticar } from "../middleware/auth.middleware";

const router = Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@blockchaincert.local
 *               password:
 *                 type: string
 *                 example: Admin2026*
 *     responses:
 *       200:
 *         description: Sesión iniciada exitosamente
 *       401:
 *         description: Credenciales incorrectas
 */
router.post("/login", AuthController.login);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     responses:
 *       200:
 *         description: Sesión cerrada
 */
router.post("/logout", autenticar, AuthController.logout);

/**
 * @openapi
 * /api/auth/perfil:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *       401:
 *         description: No autenticado
 */
router.get("/perfil", autenticar, AuthController.perfil);

/**
 * @openapi
 * /api/auth/recuperar-password:
 *   post:
 *     summary: Solicitar recuperación de contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@blockchaincert.local
 *     responses:
 *       200:
 *         description: Instrucciones enviadas
 */
router.post("/recuperar-password", AuthController.recuperarPassword);

/**
 * @openapi
 * /api/auth/cambiar-password/{token}:
 *   post:
 *     summary: Cambiar contraseña con token de recuperación
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nueva_password
 *             properties:
 *               nueva_password:
 *                 type: string
 *                 example: NuevoPassword2026*
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *       400:
 *         description: Token inválido o expirado
 */
router.post("/cambiar-password/:token", AuthController.cambiarPassword);

export default router;
