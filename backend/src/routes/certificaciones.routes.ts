import { Router } from "express";
import { CertificacionesController } from "../controllers/certificaciones.controller";

const router = Router();

router.post("/certificar", CertificacionesController.certificar);
router.get("/verificar/:hash", CertificacionesController.verificar);
router.get("/certificaciones", CertificacionesController.listar);

export default router;