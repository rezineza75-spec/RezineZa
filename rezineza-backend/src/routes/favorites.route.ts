import express, { Request, Response } from "express";
import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";

const router: express.Router = express.Router();

// Fonction pour récupérer l'ID de l'utilisateur connecté, si l'utilisateur n'est pas connecté, on retourne null
const getUserId = async (req: Request): Promise<string | null> => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return session?.user?.id ?? null;
};

// Récupérer tous les favoris de l'utilisateur connecté , L'utilisateur doit être connecté pour voir ses favoris , On inclut les détails de l'article et ses images avec "include"
router.get("/", async (req: Request, res: Response) => {
  try {
    // On vérifie que l'utilisateur est connecté
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    // On récupère uniquement les favoris de l'utilisateur connecté
    // "where: { userId }" filtre pour ne retourner QUE ses favoris
    const data = await db.favorite.findMany({
      where: { userId },
      include: {
        article: {
          include: {
            images: true,   // on inclut les images de l'article
            category: {
              select: {
                name: true, // on prend juste le nom de la catégorie
              },
            },
          },
        },
      },
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});


// Vérifier si UN article est en favori pour l'utilisateur connecté
// Utile pour afficher le coeur rempli ❤️ ou vide 🤍 sur la page d'un article
// Cette route est AVANT /:articleId pour qu'Express ne confonde pas "check" avec un id
router.get("/check/:articleId", async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    const { articleId } = req.params;

    // On cherche si ce favori existe pour cet utilisateur et cet article
    const favorite = await db.favorite.findFirst({
      where: {
        userId,
        articleId: Number(articleId),
      },
    });

    // convertit le résultat en booléen
    // si favorite existe → true , si favorite est null → false
    res.status(200).json({ isFavorite: !!favorite });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});


// Ajouter un article en favori , L'utilisateur doit être connecté , On vérifie que l'article existe avant de l'ajouter et on vérifie que l'article n'est pas déjà en favori
router.post("/:articleId", async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    // On récupère l'id de l'article depuis l'URL
    // Exemple : POST /favorites/3 → articleId = "3"
    const { articleId } = req.params;
    // On vérifie que l'article existe en base de données
    const article = await db.article.findUnique({
      where: { id: Number(articleId) },
    });
    if (!article) {
      return res.status(404).json({ message: "Article introuvable" });
    }

    // On vérifie que cet article n'est pas déjà dans les favoris de l'utilisateur le "findFirst" cherche le premier résultat qui correspond aux deux conditions
    const alreadyFavorite = await db.favorite.findFirst({
      where: {
        userId,
        articleId: Number(articleId),
      },
    });
    if (alreadyFavorite) {
      return res.status(400).json({ message: "Article déjà en favori" });
    }

    // On crée le favori en liant l'utilisateur et l'article
    const newFavorite = await db.favorite.create({
      data: {
        userId,
        articleId: Number(articleId),
      },
    });
    res.status(201).json(newFavorite);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Retirer un article des favoris , L'utilisateur doit être connecté On vérifie que le favori existe avant de le supprimer Un utilisateur ne peut supprimer que SES favoris
router.delete("/:articleId", async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    // On récupère l'id de l'article depuis l'URL
    const { articleId } = req.params;

    // On vérifie que ce favori existe et appartient à l'utilisateur connecté
    const existing = await db.favorite.findFirst({
      where: {
        userId,                       
        articleId: Number(articleId), 
      },
    });

    // Si le favori n'existe pas on retourne une erreur 404
    if (!existing) {
      return res.status(404).json({ message: "Favori introuvable" });
    }

    // On supprime le favori avec son id
    await db.favorite.delete({
      where: { id: existing.id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

export default router;