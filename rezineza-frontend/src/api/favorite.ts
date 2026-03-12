import type { Favorite } from "../interfaces/favorites.interface";

const API_URL = "http://localhost:3000";

// Récupérer tous les favoris de l'utilisateur connecté
export const getFavorites = async (): Promise<Favorite[]> => {
    const res = await fetch(`${API_URL}/favorites`, { credentials: "include" });
    if (!res.ok) throw new Error("Erreur lors de la récupération des favoris");
    return res.json();
};

// Vérifier si un article est en favori retourne isFavorite: true/false 
export const checkFavorite = async (articleId: number): Promise<{ isFavorite: boolean }> => {
    const res = await fetch(`${API_URL}/favorites/check/${articleId}`, { credentials: "include" });
    if (!res.ok) throw new Error("Erreur lors de la vérification du favori");
    return res.json();
};

// Ajouter un article en favori
export const addFavorite = async (articleId: number): Promise<Favorite> => {
    const res = await fetch(`${API_URL}/favorites/${articleId}`, {
        method: "POST",
        credentials: "include",
    });
    if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Erreur lors de l'ajout du favori");
    }
    return res.json();
};

// Retirer un article des favoris
export const removeFavorite = async (articleId: number): Promise<void> => {
    const res = await fetch(`${API_URL}/favorites/${articleId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Erreur lors de la suppression du favori");
    }
};