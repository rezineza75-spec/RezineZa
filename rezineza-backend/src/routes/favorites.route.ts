// routes/favorites.route.ts
import express from "express";
import { authMiddleware } from "@/middlewares/auth.middleware";
import * as favoriteController from "@/controllers/favorite.controller";

const router: express.Router = express.Router();

// Toutes les routes favoris nécessitent d'être connecté
router.use(authMiddleware);

router.get("/", favoriteController.getAll);
router.get("/check/:articleId", favoriteController.check);  // ← manquait
router.post("/:articleId", favoriteController.create);      // ← /:articleId pas /
router.delete("/:articleId", favoriteController.remove);    // ← /:articleId pas /:id

export default router;