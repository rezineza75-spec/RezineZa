import type { Category } from "../interfaces/categories.interface";

const API_URL = "http://localhost:3000";

export const getCategories = async (): Promise<Category[]> => {
    const res = await fetch(`${API_URL}/categories`);
    if (!res.ok) throw new Error("Erreur lors de la récupération des catégories");
    return res.json();
};