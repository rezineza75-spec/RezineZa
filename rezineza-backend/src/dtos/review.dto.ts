import { z } from "zod/v4";

export const createReviewSchema = z.object({
    name: z.string().min(1, "Le nom est obligatoire"),
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(200, "Le commentaire doit faire moins de 200 caractères"),
});

export const updateReviewSchema = z.object ({
    name :  z.string() .min(1, " Le nom est obligatoire"),
    rating :  z.int(),
    comment : z.string() .max(200, "Le commentaire doit faire moins de 200 caractères"),
});

export const patchReviewSchema = z.object ({
    name : z.string() .min(1, "Le nom est obligatoire"),
    rating : z.int(),
    comment :  z.string() .min(1, "Le commentaire doit faire moins de 200 caractères"),
});

export type CreateReviewDto = z.infer<typeof createReviewSchema>;
export type UpdateReviewDto = z.infer<typeof updateReviewSchema>;
export type PatchReviewDto = z.infer<typeof patchReviewSchema>;