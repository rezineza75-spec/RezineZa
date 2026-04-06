// routes/siteImage.routes.ts
import express from "express";
import multer from "multer";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { adminMiddleware } from "@/middlewares/admin.middleware";
import * as siteImageController from "@/controllers/siteImage.controller";

const router: express.Router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/")) cb(null, true);
        else cb(new Error("Seules les images sont autorisées"));
    },
});

// Route publique
router.get("/", siteImageController.getAll);

// Routes admin
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), siteImageController.upload);
router.put("/:id/order", authMiddleware, adminMiddleware, siteImageController.updateOrder);
router.delete("/:id", authMiddleware, adminMiddleware, siteImageController.remove);

// Doit être après toutes les routes
router.use(siteImageController.multerErrorHandler);

export default router;