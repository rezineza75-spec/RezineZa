import { z } from "zod/v4";

// Schéma pour l'upload — type obligatoire, order optionnel
export const createSiteImageSchema = z.object({
    type: z.enum(["hero", "carousel"], {
        error : "Le type doit être  'hero' ou 'carousel'"}),
    order: z.number() .int().optional() .default(0)
});

// Schéma pour modifier l'ordre
export const updateOrderSchema = z.object({
    order : z.number() .int("L'ordre doit être un nombre entier") 
});

export type CreateSiteImageDto = z.infer<typeof createSiteImageSchema>;
export type UpdateOrderDto = z.infer<typeof updateOrderSchema>;