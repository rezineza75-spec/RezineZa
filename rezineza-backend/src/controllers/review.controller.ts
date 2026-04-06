import { Request, Response } from "express";
import { createReviewSchema, updateReviewSchema, patchReviewSchema } from "@/dtos/review.dto";
import * as reviewService from "@/services/review.service";

export const getAll = async (req: Request, res: Response) => {
    try{
        const search = typeof req.query.name === "string" ? req.query.name : undefined;
        const reviews = await reviewService.getAllReviews(search);
        res.json(reviews);
    } catch(error) {
        res.status(500).json({message : "Erreur server", error})
    };
};

export const getById =  async (req: Request, res: Response) => {
      try {
        const review = await reviewService.getReviewById(Number(req.params.id), req.userId!);
        if(!review){
            return res.status(404).json({message : "Review not found"})
        };
        res.json(review);
    } catch (error) {
        res.status(500).json({message : "Erreur server", error});
    };
};

export const create = async (req: Request, res: Response) => {
    try {
        const parsed = createReviewSchema.safeParse(req.body);
        if(!parsed.success){
            return res.status(400).json({message : "Données invalides", errors : parsed.error.issues});
        }
        const review = await reviewService.createReview(req.userId! , parsed.data);
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({message : "Erreur server", error});    
    };
};

export const update = async (req : Request, res : Response) => {
    try {
        const parsed = updateReviewSchema.safeParse(req.body);
        if(!parsed.success){
            return res.status(400).json({message : "Données invalides", errors : parsed.error.issues});
        }
        const review = await reviewService.updateReview(Number(req.params.id), req.userId!, parsed.data);
        if(!review){
            return res.status(404).json({message : "Review not found"});
        }  
        res.json(review)   
    } catch (error) {
       res.status(500).json({message : "Erreur server", error}); 
    };
};


export const patch = async (req : Request, res : Response) => {
    try {
        const parsed = patchReviewSchema.safeParse(req.body);
        if(!parsed.success){
            return res.status(400).json({message : "Données invalides", errors : parsed.error.issues});
        };
        
        if (Object.keys(parsed.data).length === 0){
            return res.status(400).json({
                message : "Aucun champs à modifier"
            })
        };

        const review = await reviewService.patchReview(Number(req.params.id), req.userId!, parsed.data);
        if(!review){
            return res.status(404).json({message : "Note not found"});
        } 
        res.json(review)
    } catch (error) {
        res.status(500).json({message : "Erreur server", error}); 
    };
};

export const remove = async (req: Request, res: Response) => {
  try {
    const reviewId = Number(req.params.id);
    const userId = req.userId!; // sûr d'être défini grâce au middleware
    const userRole = req.userRole!;

    // récupérer l'avis pour vérifier
    const review = await reviewService.getReviewById(reviewId, userId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // autoriser si admin ou propriétaire
    if (userRole !== "admin" && review.userId !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    await reviewService.deleteReview(reviewId, userId); // passer les 2 arguments
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};