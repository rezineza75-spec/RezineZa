import express from "express";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { adminMiddleware } from "@/middlewares/admin.middleware";
import * as categoryController from "@/controllers/categorie.controller";

const router: express.Router = express.Router();

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);

router.post("/", authMiddleware, adminMiddleware, categoryController.create);
router.delete("/:id", authMiddleware, adminMiddleware, categoryController.remove);

export default router