import db from "@/lib/db";
import cloudinary from "@/lib/cloudinary";

// Upload une image sur Cloudinary et la sauvegarde en base
// On reçoit l'id de l'article et le buffer du fichier (envoyé par Multer)
export const uploadImage = async (articleId: number, buffer: Buffer) => {
    // On vérifie que l'article existe avant d'uploader
    const article = await db.article.findUnique({ where: { id: articleId } });
    if (!article) return "Article not found"; // le controller gèrera le 404
    // Cloudinary ne supporte pas les Promises nativement avec upload_stream ,donc on l'enveloppe dans une Promise manuellement
    const result = await new Promise<{ secure_url: string; public_id: string }>(
        (resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "rezineza/articles", // dossier de stockage sur Cloudinary
                    transformation: [
                        { width: 1920, crop: "limit" },            // on limite la largeur max à 1920px
                        { quality: "auto", fetch_format: "webp" }, // optimisation auto en webp
                    ],
                },
                (error, result) => {
                    // callback appelé par Cloudinary quand l'upload est terminé
                    if (error || !result) reject(error || new Error("Upload échoué"));
                    else resolve({ secure_url: result.secure_url, public_id: result.public_id });
                }
            );
            // on envoie le buffer (contenu du fichier en mémoire) au stream Cloudinary
            stream.end(buffer);
        }
    );

    // On sauvegarde l'image en base avec l'URL et le publicId retournés par Cloudinary
    // publicId est important : c'est ce qui permet de supprimer l'image sur Cloudinary plus tard
    return db.articleImage.create({
        data: {
            url: result.secure_url,     // URL publique de l'image
            publicId: result.public_id, // identifiant Cloudinary pour la suppression
            isMain: false,              // par défaut ce n'est pas l'image principale
            articleId,
        },
    });
};

// Définir une image comme image principale d'un article
// Un article ne peut avoir qu'une seule image principale
export const setMainImage = async (articleId: number, imageId: number) => {
    // On vérifie que l'image existe ET qu'elle appartient bien à cet article
    // (sécurité : évite qu'on définisse comme principale une image d'un autre article)
    const image = await db.articleImage.findUnique({ where: { id: imageId } });
    if (!image || image.articleId !== articleId) return null;

    // On remet TOUTES les images de l'article à isMain: false
    // comme ça il ne peut jamais y en avoir deux à true en même temps
    await db.articleImage.updateMany({
        where: { articleId },
        data: { isMain: false },
    });

    // Puis on passe uniquement l'image choisie à isMain: true
    return db.articleImage.update({
        where: { id: imageId },
        data: { isMain: true },
    });
};

// Supprimer une image
// L'ordre est important : on supprime Cloudinary EN PREMIER
// Si on supprimait d'abord en BDD et que Cloudinary échouait,
// l'image serait orpheline sur Cloudinary (stockée mais jamais supprimable)
export const deleteImage = async (articleId: number, imageId: number) => {
    // On vérifie que l'image existe et appartient bien à cet article
    const existing = await db.articleImage.findUnique({ where: { id: imageId } });
    if (!existing || existing.articleId !== articleId) return null;

    // 1. Suppression sur Cloudinary avec le publicId stocké en base
    await cloudinary.uploader.destroy(existing.publicId);
    // 2. Suppression en base seulement si Cloudinary a réussi
    await db.articleImage.delete({ where: { id: imageId } });
    return true;
};