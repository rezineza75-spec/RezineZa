import express from "express";
import * as contactController from "@/controllers/contact.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { adminMiddleware } from "@/middlewares/admin.middleware";

const router: express.Router = express.Router();

router.post("/", contactController.send);
router.get("/", authMiddleware, adminMiddleware, contactController.getAll);         // admin
router.delete("/:id", authMiddleware, adminMiddleware, contactController.remove);

export default router;