import { Request, Response } from "express";
import { createCategorySchema, updateCategorySchema, patchCategorySchema } from "@/dtos/categorie.dto";
import * as categoryService from "@/services/categorie.service";

export const getAll = async (req: Request, res: Response) => {
    try {
        const search = typeof req.query.name === "string" ? req.query.name : undefined;
        const categories = await categoryService.getAllCategories(search);
        res.json(categories);
    } catch (error) {
        res.status(500).json({message : "Erreur server", error});
    };
};

export const getById = async (req: Request, res: Response) => {
    try{
        const category = await categoryService.getCategoryById (Number(req.params.id));
        if(!category){
            return res.status(404).json({message : "category not found"})
        };
        res.json(category);
    } catch (error) {
        res.status(500).json({message : "Erreur server", error});
    };
};

export const create = async (req : Request, res : Response) =>{
    try{
        const parsed = createCategorySchema.safeParse(req.body);
        if(!parsed.success){
            return res.status(400).json({message : "Données invalides", errors : parsed.error.issues});
        }
        const category = await categoryService.createCategory(parsed.data);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({message : "Erreur server", error});
    };
};


export const update = async (req: Request, res: Response) => {
    try {
        const parsed = updateCategorySchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ message: "Données invalides", errors: parsed.error.issues });
        const category = await categoryService.updateCategory(Number(req.params.id), parsed.data);
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: "Erreur server", error });
    }
};

export const patch = async (req: Request, res: Response) => {
    try {
        const parsed = patchCategorySchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ message: "Données invalides", errors: parsed.error.issues });
        const category = await categoryService.patchCategory(Number(req.params.id), parsed.data);
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: "Erreur server", error });
    }
};
export const remove = async (req : Request, res : Response) => {
    try {
        const result = await categoryService.deleteCategory(Number(req.params.id))
        if(!result){
           return res.status(404).json({message : "Category not found"}); 
        }
        res.status(204).send()
    } catch (error) {
        res.status(500).json({message : "Erreur server", error});
    }
}