import express from "express";
import multer from "multer";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { adminMiddleware } from "@/middlewares/admin.middleware";
import * as articleImageController from "@/controllers/articleImage.controller";

const router: express.Router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/")) cb(null, true);
        else cb(new Error("Seules les images sont autorisées"));
    },
});

router.post("/:id/images", authMiddleware, adminMiddleware, upload.single("image"), articleImageController.upload);
router.put("/:id/images/:imageId/main", authMiddleware, adminMiddleware, articleImageController.setMain);
router.delete("/:id/images/:imageId", authMiddleware, adminMiddleware, articleImageController.remove);

router.use(articleImageController.multerErrorHandler);

export default router