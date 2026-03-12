import express, { Request, Response } from "express";
import db from "@/lib/db";
import {auth} from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";

const router: express.Router = express.Router();

// //Fonction pour récupérer l'ID de l'utilisateur connecté on demande à Better Auth de lire la session depuis les headers de la requête si l'utilisateur n'est pas connecté, on retourne null
// const getUserId = async (req: Request): Promise<string | null> => {
//   const session = await auth.api.getSession({
//     headers: fromNodeHeaders(req.headers), // on convertit les headers Express pour Better Auth
//   });
//   return session?.user?.id ?? null; // si pas de session, on retourne null
// };

//Récupérer tous les articles ,pas besoin d'être connecté, les articles sont publics le "include" permet de récupérer les données liées 
// on récupère uniquement le "name" de la catégorie avec "select"
router.get("/", async (req: Request, res: Response) => {
  try {
    const { title } = req.query; // on récupère ?title=... dans l'URL

    // Si un titre est fourni dans l'URL on filtre les articles
    if (title && typeof title === "string") {
      const trimmedTitle = title.trim(); // on supprime les espaces avant/après le titre
      const data = await db.article.findMany({
        where: {
          title: {
            contains: trimmedTitle, // cherche les articles dont le titre contient le mot
            mode: "insensitive", // insensible à la casse (bague = Bague = BAGUE)
          },
        },
        include: {
          category: {
            select: {
              name: true,
            },
          },
          images: true,
        },
      });
      return res.status(200).json(data);
    }
    // sinon on retourne tous les articles
    const data = await db.article.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
        images: true,
      },
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// récupérer les articles d'une catégorie, cette route doit être avant get/:id sinon Express va lire "category" comme un id numérique et ca va crasher
router.get("/category/:categoryId", async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    const data = await db.article.findMany({
      where: { categoryId: Number(categoryId) },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        images: true,
      },
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});


// Récupérer un seul article par son ID le "findUnique" cherche un seul enregistrement si l'article n'existe pas, on retourne une erreur
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const data = await db.article.findUnique({
      where: { id: Number(id) },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        images: true,
      },
    });

    if (!data) {
      return res.status(404).json({ message: "Article introuvable" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// créer un article (ADMIN uniquement)
router.post("/", async (req: Request, res: Response) => {
  try {
    // On vérifie si quelqu'un est connecté
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    if (session.user.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const { title, description, price, isAvailable, categoryId } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Les champs 'title' et 'description' sont obligatoires",
      });
    }

    const data = await db.article.create({
      data: {
        title,
        description,
        price: price || null,
        isAvailable: isAvailable ?? true,
        categoryId: categoryId || null,
      },
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

//modifier un article entièrement (ADMIN uniquement) 
router.put("/:id", async (req: Request, res: Response) => {
  try {
    // On vérifie si quelqu'un est connecté
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
    const { title, description, price, isAvailable, categoryId } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Les champs 'title' et 'description' sont obligatoires",
      });
    }
    const existing = await db.article.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({ message: "Article introuvable" });
    }

    const article = await db.article.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        price: price || null,
        isAvailable: isAvailable ?? true,
        categoryId: categoryId || null,
      },
    });

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// modifier un article partiellement (ADMIN uniquement) contrairement au PUT, on ne modifie que les champs envoyés on construit un objet "data" dynamiquement avec seulement les champs reçus si aucun champ n'est envoyé, on retourne une erreur 400
  router.patch("/:id", async (req: Request, res: Response) => {
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

    const existing = await db.article.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({ message: "Article introuvable" });
    }

    const { title, description, price, isAvailable, categoryId } = req.body;
    // On construit l'objet data dynamiquementet on ajoute un champ que s'il a été envoyé dans la requête
    const data: {
      title?: string;
      description?: string;
      price?: number | null;
      isAvailable?: boolean;
      categoryId?: number | null;
    } = {};

    if (title !== undefined){
      data.title = title
    }
    if (description !== undefined){
      data.description = description
    }
    if (price !== undefined){
      data.price = price || null
    }
    if (isAvailable !== undefined){
      data.isAvailable = isAvailable
    }
    if (categoryId !== undefined){
      data.categoryId = categoryId || null
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Aucun champ à modifier" });
    }

    const article = await db.article.update({
      where: { id: Number(id) },
      data,
    });

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// supprimer un article (ADMIN uniquement)on vérifie que l'article existe avant de supprimer les images liées sont supprimées automatiquement grâce au onDelete: Cascade du schéma Prisma
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
    const existing = await db.article.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: "Article introuvable" });
    }

    await db.article.delete({
      where: { id: Number(id) },
    });

    res.status(204).json("Article supprimé avec succès");
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

export default router;
