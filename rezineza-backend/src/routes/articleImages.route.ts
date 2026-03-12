import { auth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import db from "@/lib/db";
import { fromNodeHeaders } from "better-auth/node";
import express, { NextFunction, Request, Response } from "express";
import multer from "multer";

const router: express.Router = express.Router();

// Configuration Multer le memoryStorage() sert a stocker le fichier en mémoire (buffer) avant envoi à Cloudinary
// fileFilter: vérifie que le fichier envoyé est bien une image
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true); // on accepte le fichier
    } else {
      cb(new Error("Seules les images sont autorisées")); // on refuse le fichier
    }
  },
});


router.post("/:id/images", upload.single("image"), async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    if (session.user.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Aucune image fournie" });
    }

    const { id } = req.params;

    // On vérifie que l'article existe avant d'uploader
    const article = await db.article.findUnique({
      where: { id: Number(id) },
    });
    if (!article) {
      return res.status(404).json({ message: "Article introuvable" });
    }

    // On envoie l'image à Cloudinary via un stream
    // on utilise une Promise pour attendre la réponse de Cloudinary
    const resultat = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "rezineza/articles", // dossier dans Cloudinary
            transformation: [
              { width: 1920, crop: "limit" },               // on limite la largeur à 1920px
              { quality: "auto", fetch_format: "webp" },    // on optimise la qualité et le format
            ],
          },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error("Upload échoué"));
            } else {
              resolve({ secure_url: result.secure_url, public_id: result.public_id });
            }
          }
        );
        stream.end(req.file!.buffer); // on envoie le buffer à Cloudinary
      }
    );

    // On sauvegarde l'image en base de données
    const newImage = await db.articleImage.create({
      data: {
        url: resultat.secure_url,     // l'URL de l'image sur Cloudinary
        publicId: resultat.public_id, // l'identifiant pour la supprimer plus tard
        isMain: false,                // par défaut ce n'est pas l'image principale
        articleId: Number(id),
      },
    });

    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// Définir une image comme principale (ADMIN uniquement)
// On remet d'abord toutes les images de l'article à isMain: false puis on met l'image choisie à isMain: true
// Comme ça il ne peut y avoir qu'une seule image principale par article
router.put("/:id/images/:imageId/main", async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    if (session.user.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const { id, imageId } = req.params;

    // On vérifie que l'image existe et appartient bien à cet article
    const image = await db.articleImage.findUnique({
      where: { id: Number(imageId) },
    });
    if (!image || image.articleId !== Number(id)) {
      return res.status(404).json({ message: "Image introuvable" });
    }

    // On remet toutes les images de l'article à isMain: false
    await db.articleImage.updateMany({
      where: { articleId: Number(id) },
      data: { isMain: false },
    });

    // On met l'image choisie comme principale
    const updatedImage = await db.articleImage.update({
      where: { id: Number(imageId) },
      data: { isMain: true },
    });

    res.status(200).json(updatedImage);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Supprimer une image (ADMIN uniquement)
// On supprime d'abord l'image sur Cloudinary avec son publicId Puis on la supprime en base de données
// L'ordre est important : si on supprime en base d'abord et que Cloudinary échoue, on se retrouve avec une image orpheline sur Cloudinary
router.delete("/:id/images/:imageId", async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      res.status(401).json({ message: "Non authentifié" });
      return;
    }
    if (session.user.role !== "admin") {
      res.status(403).json({ message: "Accès refusé" });
      return;
    }

    const { id, imageId } = req.params;
    // On vérifie que l'image existe et appartient bien à cet article
    const existing = await db.articleImage.findUnique({
      where: { id: Number(imageId) },
    });

    if (!existing || existing.articleId !== Number(id)) {
      return res.status(404).json({ message: "Image introuvable" });
    }
    // On supprime l'image sur Cloudinary en premier
    await cloudinary.uploader.destroy(existing.publicId);
    // Puis on la supprime en base de données
    await db.articleImage.delete({
      where: { id: Number(imageId) },
    });

    res.status(204).send();
  } catch (error: any) {
    if (error.code === "P2025") {
      // P2025 est le code Prisma pour "enregistrement introuvable"
      res.status(404).json({ message: "Image introuvable" });
      return;
    }
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Gestionnaire d'erreurs Multerc e middleware intercepte les erreurs lancées par Multer il doit être déclaré APRÈS toutes les routes
router.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ message: err.message });
    return;
  }
  if (err.message === "Seules les images sont autorisées") {
    res.status(400).json({ message: err.message });
    return;
  }
  res.status(500).json({ message: "Erreur serveur" });
});

export default router;