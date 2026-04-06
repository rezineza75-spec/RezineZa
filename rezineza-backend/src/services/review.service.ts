import db from "@/lib/db";
import type { CreateReviewDto, UpdateReviewDto, PatchReviewDto } from "@/dtos/review.dto";

export const getAllReviews = async (search?: string) => {
    return db.review.findMany({
        where: search ? {
        comment: { contains: search } } : undefined,
        orderBy: { createdAt: "desc" }
    });
};

export const getReviewById = async (id : number, userId: string) => {
    const review = await db.review.findUnique({
        where : {id},
    });
    if(!review || review.userId !== userId) return null;
    return review
};

export const createReview =  async (userId : string, d : CreateReviewDto) => {
    return db.review.create({
        data : {
            name : d.name,
            rating : d.rating ,
            comment : d.comment,
            userId
        }
    });
};


export const updateReview = async (id : number, userId : string, d : UpdateReviewDto) =>{
    const existing = await db.review.findUnique({where : {id}});
    if(!existing || existing.userId !== userId) return null;

    return db.review.update({
        where : {id},
        data : {
        name : d.name,
        rating : d.rating ?? null,
        comment : d.comment,
        createdAt : new Date()
        }
    });
};


export const patchReview = async (id: number, userId: string, data : PatchReviewDto) => {
    const existing = await db.review.findUnique({where : {id}});
    if (!existing || existing.userId !== userId) return null;
    return db.review.update({
        where : {id},
        data
    });
};


export const deleteReview = async (id: number, userId : string) => {
    const existing = await db.review.findUnique({where : {id}});
    if(!existing || existing.userId !== userId) return null;
    
    await db.review.delete({where : {id}});
    return true;
};