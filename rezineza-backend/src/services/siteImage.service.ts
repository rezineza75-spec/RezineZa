import db from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import type { CreateSiteImageDto, UpdateOrderDto } from "@/dtos/siteImage.dto";

// Récupérer toutes les images, avec filtre optionnel par type
export const getAllSiteImages = async (type?: string) => {
    return db.siteImage.findMany({
        where: type ? { type } : undefined,
        orderBy: { order: "asc" },
    });
};

// Upload une image sur Cloudinary et la sauvegarde en base
export const uploadSiteImage = async (data: CreateSiteImageDto, buffer: Buffer) => {
    // Si c'est une image hero, on supprime l'ancienne
    // car il ne peut y en avoir qu'une seule à la fois
    if (data.type === "hero") {
        const existingHero = await db.siteImage.findFirst({ where: { type: "hero" } });
        if (existingHero) {
            await cloudinary.uploader.destroy(existingHero.publicId); // suppression Cloudinary
            await db.siteImage.delete({ where: { id: existingHero.id } }); // suppression BDD
        }
    }

    // Upload vers Cloudinary via stream (même pattern que articleImage)
    const result = await new Promise<{ secure_url: string; public_id: string }>(
        (resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "rezineza/site",
                    transformation: [
                        { width: 1920, crop: "limit" },
                        { quality: "auto", fetch_format: "webp" },
                    ],
                },
                (error, result) => {
                    if (error || !result) reject(error || new Error("Upload échoué"));
                    else resolve({ secure_url: result.secure_url, public_id: result.public_id });
                }
            );
            stream.end(buffer);
        }
    );

    return db.siteImage.create({
        data: {
            url: result.secure_url,
            publicId: result.public_id,
            type: data.type,
            order: data.order ?? 0,
        },
    });
};

// Modifier l'ordre d'une image carousel
export const updateImageOrder = async (id: number, data: UpdateOrderDto) => {
    const existing = await db.siteImage.findUnique({ where: { id } });
    if (!existing) return null;

    return db.siteImage.update({
        where: { id },
        data: { order: data.order },
    });
};

// Supprimer une image — Cloudinary en premier, puis BDD
export const deleteSiteImage = async (id: number) => {
    const existing = await db.siteImage.findUnique({ where: { id } });
    if (!existing) return null;

    await cloudinary.uploader.destroy(existing.publicId);
    await db.siteImage.delete({ where: { id } });
    return true;
};