const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const uploadArticleImage = async (articleId: number, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${API_URL}/api/articles/${articleId}/images`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });
    if (!res.ok) throw new Error("Erreur lors de l'upload de l'image");
    return res.json();
};

export const setMainImage = async (articleId: number, imageId: number): Promise<void> => {
    const res = await fetch(`${API_URL}/api/articles/${articleId}/images/${imageId}/main`, {
        method: "PUT",
        credentials: "include",
    });
    if (!res.ok) throw new Error("Erreur lors de la définition de l'image principale");
};

export const deleteArticleImage = async (articleId: number, imageId: number): Promise<void> => {
    const res = await fetch(`${API_URL}/api/articles/${articleId}/images/${imageId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) throw new Error("Erreur lors de la suppression de l'image");
};