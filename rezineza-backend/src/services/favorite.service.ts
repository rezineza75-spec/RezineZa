import db from "@/lib/db";

export const getAllFavorites = async (userId: string) => {
    return db.favorite.findMany({
        where: { userId },
        include: {
            article: {
                include: {
                    images: true,
                    category: {
                        select: { name: true },
                    },
                },
            },
        },
    });
};

export const checkFavorite = async (userId: string, articleId: number) => {
    const favorite = await db.favorite.findFirst({
        where: { userId, articleId },
    });
    return !!favorite;
};

export const createFavorite = async (userId: string, articleId: number) => {
    const article = await db.article.findUnique({ where: { id: articleId } });
    if (!article) return "Article not found";

    const already = await db.favorite.findFirst({ where: { userId, articleId } });
    if (already) return "Already favorite";

    return db.favorite.create({
        data: { userId, articleId },
    });
};

export const deleteFavorite = async (userId: string, articleId: number) => {
    const existing = await db.favorite.findFirst({ where: { userId, articleId } });
    if (!existing) return null;

    await db.favorite.delete({ where: { id: existing.id } });
    return true;
};