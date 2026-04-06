// controllers/articleImage.controller.ts
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import * as imageService from "@/services/articleImage.service";

// Upload une image pour un article
// Le fichier est récupéré via req.file (mis en place par le middleware Multer dans les routes)
export const upload = async (req: Request, res: Response) => {
    try {
        // Multer a déjà validé le type du fichier, mais on vérifie qu'il est bien présent
        if (!req.file) {
            return res.status(400).json({ message: "Aucune image fournie" });
        }

        // On passe l'id de l'article (depuis l'URL) et le buffer du fichier au service
        const result = await imageService.uploadImage(Number(req.params.id), req.file.buffer);

        // Le service retourne la string "Article not found" si l'article n'existe pas
        if (result === "Article not found")
            return res.status(404).json({ message: "Article introuvable" });

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Définir une image comme image principale
// Route : PUT /:id/images/:imageId/main
export const setMain = async (req: Request, res: Response) => {
    try {
        // On récupère les deux ids depuis l'URL et on les passe au service
        const image = await imageService.setMainImage(
            Number(req.params.id),      // id de l'article
            Number(req.params.imageId)  // id de l'image à passer en principale
        );
        // Le service retourne null si l'image n'existe pas ou n'appartient pas à cet article
        if (!image) return res.status(404).json({ message: "Image introuvable" });
        res.json(image);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Supprimer une image
// Route : DELETE /:id/images/:imageId
export const remove = async (req: Request, res: Response) => {
    try {
        const result = await imageService.deleteImage(
            Number(req.params.id),      // id de l'article
            Number(req.params.imageId)  // id de l'image à supprimer
        );
        // Le service retourne null si l'image n'existe pas ou n'appartient pas à cet article
        if (!result) return res.status(404).json({ message: "Image introuvable" });
        res.status(204).send(); // 204 = succès sans contenu retourné
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Middleware de gestion des erreurs Multer
// Ce middleware DOIT être enregistré après les routes dans le fichier de routes
// car Express ne l'appelle que si une erreur est lancée par Multer
// Sa signature à 4 paramètres (err, req, res, next) est obligatoire pour qu'Express
// le reconnaisse comme un gestionnaire d'erreurs
export const multerErrorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        // Erreur native Multer (ex: fichier trop grand si on avait mis une limite)
        res.status(400).json({ message: err.message });
        return;
    }
    if (err.message === "Seules les images sont autorisées") {
        // Erreur qu'on lance manuellement dans le fileFilter de Multer
        res.status(400).json({ message: err.message });
        return;
    }
    res.status(500).json({ message: "Erreur serveur" });
};