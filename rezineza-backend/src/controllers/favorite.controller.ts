import { Request, Response } from "express";
import * as favoriteService from "@/services/favorite.service";
import { createFavoriteSchema } from "@/dtos/favorite.dto";

export const getAll = async (req: Request, res: Response) => {
    try {
        const favorites = await favoriteService.getAllFavorites(req.userId!);
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

export const check = async (req: Request, res: Response) => {
    try {
        const articleId = Number(req.params.articleId);
        const isFavorite = await favoriteService.checkFavorite(req.userId!, articleId);
        res.json({ isFavorite });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const parsed = createFavoriteSchema.safeParse({ articleId: Number(req.params.articleId) });
        if (!parsed.success) {
            return res.status(400).json({ message: "Données invalides", errors: parsed.error.issues });
        }

        const result = await favoriteService.createFavorite(req.userId!, parsed.data.articleId);

        if (result === "Article not found")
            return res.status(404).json({ message: "Article introuvable" });
        if (result === "Already favorite")
            return res.status(400).json({ message: "Article déjà en favori" });

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const result = await favoriteService.deleteFavorite(req.userId!, Number(req.params.articleId));
        if (!result) return res.status(404).json({ message: "Favori introuvable" });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

export function getById(arg0: string, getById: any) {
  throw new Error("Function not implemented.");
}
