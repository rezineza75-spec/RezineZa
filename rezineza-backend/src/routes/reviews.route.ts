import express, { Request, Response } from "express";
import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";

const router: express.Router = express.Router();

// Fonction pour récupérer l'ID de l'utilisateur connecté si l'utilisateur n'est pas connecté, on retourne null
const getUserId = async (req: Request): Promise<string | null> => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return session?.user?.id ?? null;
};

// Récupérer tous les avis pas besoin d'être connecté, les avis sont publics , on trie du plus récent au plus ancien avec "orderBy"
router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await db.review.findMany({
      orderBy: { createdAt: "desc" }, // du plus récent au plus ancien
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

//Créer un avis , L'utilisateur doit être connecté pour laisser un avis On vérifie que les champs obligatoires sont présents , Le "name" vient du body car l'utilisateur peut mettre un pseudo différent , Le "userId" vient de la session pour lier l'avis au compte
router.post("/", async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const { name, rating, comment } = req.body;
    // On vérifie que tous les champs sont présents
    if (!name || !rating) {
      return res.status(400).json({
        message: "Les champs 'name' et 'rating' sont obligatoires",
      });
    }
    // On vérifie que la note est bien entre 1 et 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "La note doit être comprise entre 1 et 5",
      });
    }

    //crée l'avis en base de données. Number(rating) convertit le rating en nombre car ce qui vient du body est toujours une chaîne de caractères. On retourne l'avis créé avec un code 201 (créé avec succès).
    const newReview = await db.review.create({
      data: {
        name,
        rating: Number(rating),
        comment,
        userId, // on lie l'avis au compte connecté
      },
    });

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Supprimer un avis
// Deux cas possibles :
// 1. L'utilisateur connecté supprime SON propre avis
// 2. L'admin supprime N'IMPORTE quel avis
router.delete("/:id", async (req: Request, res: Response) => {
  try {

    // On récupère la session complète pour avoir accès au rôle
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const { id } = req.params;
    // On vérifie que l'avis existe
    const existing = await db.review.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({ message: "Avis introuvable" });
    }

    // Vérification en une seule condition :
    // admin → peut supprimer 
    // utilisateur normal + c'est son avis → peut supprimer 
    // utilisateur normal + ce n'est pas son avis → accès refusé ( erreur 403)
    if (session.user.role !== "admin" && existing.userId !== session.user.id) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    await db.review.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

export default router;