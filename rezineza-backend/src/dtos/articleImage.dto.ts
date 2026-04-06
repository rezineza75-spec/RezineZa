import { z } from "zod/v4";

// On n'a pas besoin de schéma pour l'upload (Multer valide le fichier)
// ni pour le delete (juste des ids dans l'URL)
// On crée un schéma uniquement pour setMain pour valider les ids
export const setMainImageSchema = z.object({
    imageId: z.number().int().positive(),
    articleId: z.number().int().positive(),
});

export type SetMainImageDto = z.infer<typeof setMainImageSchema>;