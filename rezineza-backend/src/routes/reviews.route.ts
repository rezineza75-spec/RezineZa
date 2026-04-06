// routes/reviews.route.ts
import express from "express";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { adminMiddleware } from "@/middlewares/admin.middleware";
import * as reviewController from "@/controllers/review.controller";

const router: express.Router = express.Router();

// public — tout le monde peut lire les avis
router.get("/", reviewController.getAll);
router.get("/:id", reviewController.getById);

// connecté obligatoire pour créer
router.post("/", authMiddleware, reviewController.create);

// admin uniquement pour supprimer
router.delete("/:id", authMiddleware, reviewController.remove);
export default router;