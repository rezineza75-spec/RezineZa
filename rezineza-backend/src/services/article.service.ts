import db from "../lib/db";
import type { CreateArticleDto, UpdateArticleDto, PatchArticleDto } from "@/dtos/article.dto";

export const getAllArticles =  async (search? : string) =>{
    return db.article.findMany({
        where: {
            ...(search ? {description : {contains : search}} : {})
        },
        include: {category : {select : {name : true}},
        images : true

        }
    });
};

export const getArticleById = async (id : number) => {
    const article = await db.article.findUnique({
        where : {id},
        include: {category : {select : {name : true}}
        , images : true
    }
    });
    return article ?? null;
};

export const createArticle = async (d : CreateArticleDto) => {
    return db.article.create({
        data : {
            title : d.title,
            description : d.description,
            isAvailable : d.isAvailable ?? true,
            categoryId : d.categoryId ?? null,
            price : d.price  ?? null
        }
    });
};

export const updateArticle = async (id: number, d: UpdateArticleDto) => {
    const existing = await db.article.findUnique({ where: { id } });
    if (!existing) return null;
    return db.article.update({ where: { id }, 
        data:{
            ...d, 
            categoryId: d.categoryId ?? null
         }
    });
};

export const patchArticle = async (id: number, data : PatchArticleDto) => {
    const existing = await db.article.findUnique({where : {id}});
    if (!existing) return null;
    return db.article.update({
        where : {id},
        data
    });
};

export const deleteArticle = async (id: number) =>{
    const existing = await db.article.findUnique({where : {id}});
    if (!existing) return null;
    await db.article.delete({where : {id}});
    return true;
}