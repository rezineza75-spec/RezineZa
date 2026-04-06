import { z } from "zod/v4";

export const createCategorySchema = z.object({
    name : z.string() .min(1, "le titre est obligatoire") .max(255, "le titre doit faire moins que 255 caractères"),
});

export const updateCategorySchema = z.object({
    name : z.string() .min(1, "le titre est obligatoire") .max(255, "le titre doit faire moins que 255 caractères")
});

export const patchCategorySchema = z.object({
    name : z.string() .min(1, "le titre est obligatoire") .max(255, "le titre doit faire moins que 255 caractères")
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
export type PatchCategoryDto = z.infer<typeof patchCategorySchema>;