import express from "express";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { adminMiddleware } from "@/middlewares/admin.middleware";
import * as articleController from "@/controllers/article.controller";

const router: express.Router = express.Router();

// Routes publiques — tout le monde peut voir les articles
router.get("/", articleController.getAll);
router.get("/:id", articleController.getById);

// Routes admin — connecté + admin obligatoire
router.post("/", authMiddleware, adminMiddleware, articleController.create);
router.put("/:id", authMiddleware, adminMiddleware, articleController.update);
router.patch("/:id", authMiddleware, adminMiddleware, articleController.patch);
router.delete("/:id", authMiddleware, adminMiddleware, articleController.remove);

export default router;