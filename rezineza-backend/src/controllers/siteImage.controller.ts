import { Request, Response, NextFunction } from "express";
import multer from "multer";
import * as siteImageService from "@/services/siteImage.service";
import { createSiteImageSchema, updateOrderSchema } from "@/dtos/siteImage.dto";

// GET / — public, filtre optionnel par ?type=hero ou ?type=carousel
export const getAll = async (req: Request, res: Response) => {
    try {
        const type = typeof req.query.type === "string" ? req.query.type : undefined;
        const images = await siteImageService.getAllSiteImages(type);
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// POST / — upload d'une image (admin)
export const upload = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Aucune image fournie" });
        }

        // order vient du body en string (multipart/form-data), on le convertit en number
        const parsed = createSiteImageSchema.safeParse({
            type: req.body.type,
            order: req.body.order ? Number(req.body.order) : 0,
        });
        if (!parsed.success) {
            return res.status(400).json({ message: "Données invalides", errors: parsed.error.issues });
        }

        const image = await siteImageService.uploadSiteImage(parsed.data, req.file.buffer);
        res.status(201).json(image);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// PUT /:id/order — modifier l'ordre (admin)
export const updateOrder = async (req: Request, res: Response) => {
    try {
        const parsed = updateOrderSchema.safeParse({ order: Number(req.body.order) });
        if (!parsed.success) {
            return res.status(400).json({ message: "Données invalides", errors: parsed.error.issues });
        }

        const image = await siteImageService.updateImageOrder(Number(req.params.id), parsed.data);
        if (!image) return res.status(404).json({ message: "Image introuvable" });
        res.json(image);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// DELETE /:id — supprimer une image (admin)
export const remove = async (req: Request, res: Response) => {
    try {
        const result = await siteImageService.deleteSiteImage(Number(req.params.id));
        if (!result) return res.status(404).json({ message: "Image introuvable" });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Gestionnaire d'erreurs Multer — déclaré dans les routes après les routes
export const multerErrorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        res.status(400).json({ message: err.message });
        return;
    }
    if (err.message === "Seules les images sont autorisées") {
        res.status(400).json({ message: err.message });
        return;
    }
    res.status(500).json({ message: "Erreur serveur" });
};