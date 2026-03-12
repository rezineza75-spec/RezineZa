import express, { Request, Response } from "express";
import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";

const router: express.Router = express.Router();

//Récupérer toutes les catégories
router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await db.category.findMany();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

//Récupérer une catégorie par son ID avec ses articles
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await db.category.findUnique(
    {
      where: { id: Number(id) },
      include: {
        articles: true, // pour inclure les articles liés à la catégorie
      },
    }
 );
    if (!data) {
      res.status(404).json({ message: "Catégorie introuvable" });
      return;
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Créer une catégorie (ADMIN uniquement)
router.post("/", async (req: Request, res: Response) => {
  try {

    // On demande à Better Auth de vérifier si quelqu'un est connecté req.headers contient les infos de connexion envoyées par le navigateur fromNodeHeaders les convertit dans un format que Better Auth comprend
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    // Si personne n'est connecté → session vaut null → erreur 401
    if (!session) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    // Si connecté mais pas admin → erreur 403
    // 403 = connecté mais pas les droits
    // La différence avec le 401 : ici on sait qui tu es mais tu n'as pas le droit d'entrer
    if (session.user.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé" });
    }

    // Si on arrive ici c'est que l'utilisateur est bien admin
    // On continue normalement
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: "Le champ 'nom' est obligatoire" });
      return;
    }

    const newCategory = await db.category.create({
      data: { name },
    });

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Modifier une catégorie (ADMIN uniquement)
router.put("/:id", async (req: Request, res: Response) => {
  try {

    // Même vérification admin que dans le POST
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    if (session.user.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: "Le champ 'nom' est obligatoire" });
      return;
    }

    const category = await db.category.update({
      where: { id: Number(id) },
      data: { name },
    });

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Supprimer une catégorie (ADMIN uniquement)
router.delete("/:id", async (req: Request, res: Response) => {
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

    const { id } = req.params;
    const data = await db.category.delete({
      where: { id: Number(id) },
    });

    res.status(204).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

export default router;