import type { Favorite } from "../interfaces/favorites.interface";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getFavorites = async (): Promise<Favorite[]> => {
    const res = await fetch(`${API_URL}/api/favorites`, { credentials: "include" });
    if (!res.ok) throw new Error("Erreur lors de la récupération des favoris");
    return res.json();
};

export const checkFavorite = async (articleId: number): Promise<{ isFavorite: boolean }> => {
    const res = await fetch(`${API_URL}/api/favorites/check/${articleId}`, { credentials: "include" });
    if (!res.ok) throw new Error("Erreur lors de la vérification du favori");
    return res.json();
};

export const addFavorite = async (articleId: number): Promise<Favorite> => {
    const res = await fetch(`${API_URL}/api/favorites/${articleId}`, {
        method: "POST",
        credentials: "include",
    });
    if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Erreur lors de l'ajout du favori");
    }
    return res.json();
};

export const removeFavorite = async (articleId: number): Promise<void> => {
    const res = await fetch(`${API_URL}/api/favorites/${articleId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Erreur lors de la suppression du favori");
    }
};