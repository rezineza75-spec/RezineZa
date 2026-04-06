import { z } from "zod/v4";

export const createFavoriteSchema = z.object({
    articleId: z.number().int().positive("L'id de l'article est obligatoire"),
});

export type CreateFavoriteDto = z.infer<typeof createFavoriteSchema>;