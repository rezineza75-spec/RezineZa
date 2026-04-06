import { Request, Response } from "express";
import { createArticleSchema, updateArticleSchema, patchArticleSchema } from "@/dtos/article.dto";
import * as articleService from "@/services/article.service";

export const getAll = async (req: Request, res: Response) => {
    try {
        const search = typeof req.query.title === "string" ? req.query.title : undefined;
        const articles =  await articleService.getAllArticles(search);
        res.json(articles);
    } catch (error) {
        res.status(500).json({message : "Erreur server", error});
    };
};

export const getById = async (req: Request, res: Response) => {
    try{
        const article = await articleService.getArticleById (Number(req.params.id));
        if(!article){
            return res.status(404).json({message : "article not found"})
        };
        res.json(article);
    } catch (error) {
        res.status(500).json({message : "Erreur server", error});
    };
};

export const create = async (req : Request, res : Response) =>{
    try{
        const parsed = createArticleSchema.safeParse(req.body);
        if(!parsed.success){
            return res.status(400).json({message : "Données invalides", errors : parsed.error.issues});
        }
       const article = await articleService.createArticle(parsed.data);
       res.status(201).json(article);
    } catch (error) {
        res.status(500).json({message : "Erreur server", error});
    };
};

export const update = async (req : Request, res : Response) => {
    try {
        const parsed = updateArticleSchema.safeParse(req.body);
        if(!parsed.success){
            return res.status(400).json({message : "Données invalides", errors : parsed.error.issues});
        }
        const article = await articleService.updateArticle(Number(req.params.id), parsed.data);
        if(!article){
            return res.status(404).json({message : "Note not found"});
        }  
        res.json(article)   
    } catch (error) {
       res.status(500).json({message : "Erreur server", error}); 
    };
};

export const patch = async (req : Request, res : Response) => {
    try {
        const parsed = patchArticleSchema.safeParse(req.body);
        if(!parsed.success){
            return res.status(400).json({message : "Données invalides", errors : parsed.error.issues});
        };
        
        if (Object.keys(parsed.data).length === 0){
            return res.status(400).json({
                message : "Aucun champs à modifier"
            })
        };

        const article = await articleService.patchArticle(Number(req.params.id), parsed.data);
        if(!article){
            return res.status(404).json({message : "Note not found"});
        } 
        res.json(article)
    } catch (error) {
        res.status(500).json({message : "Erreur server", error}); 
    };
};

export const remove = async (req : Request, res : Response) => {
    try {
        const result = await articleService.deleteArticle(Number(req.params.id))
        if(!result){
           return res.status(404).json({message : "Article not found"}); 
        }
        res.status(204).send()
    } catch (error) {
        res.status(500).json({message : "Erreur server", error});
    }
}