import { z } from "zod/v4"

export const createArticleSchema = z.object ({
    title : z.string().min(1, "le titre est obligatoire").max(255, "le titre doit faire moins de 255 carctères"),
    description : z.string() .max(500),
    price : z.number() .optional(),
    isAvailable : z.boolean() .optional().default(true),
    categoryId : z.number() .int() .positive() .nullable() .optional()
});

export const updateArticleSchema = z.object({
    title : z.string().min(1, "le titre est obligatoire").max(255, "le titre doit faire moins de 255 carctères"),
    description : z.string() .max(500),
    price : z.number() .optional(),
    isAvailable : z.boolean(),
    categoryId : z.number() .int() .positive() .nullable() .optional()
});

export const patchArticleSchema = z.object({
    title : z.string().min(1, "le titre est obligatoire").max(255, "le titre doit faire moins de 255 carctères"),
    description : z.string() .max(500),
    price : z.number() .optional(),
    isAvailable : z.boolean(),
    categoryId : z.number() .int() .positive() .nullable() .optional()
});

export type CreateArticleDto = z.infer<typeof createArticleSchema>;
export type UpdateArticleDto = z.infer<typeof updateArticleSchema>;
export type PatchArticleDto = z.infer<typeof patchArticleSchema>;


