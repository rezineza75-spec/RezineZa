import type { Article } from "../interfaces/articles.interface";

const API_URL = "http://localhost:3000";

// Récupérer tous les articles
export const getArticles = async (): Promise<Article[]> => {
    const res = await fetch(`${API_URL}/articles`);
    if (!res.ok) throw new Error("Erreur lors de la récupération des articles");
    return res.json();
};

// Récupérer un article par son id
export const getArticleById = async (id: number): Promise<Article> => {
    const res = await fetch(`${API_URL}/articles/${id}`);
    if (!res.ok) throw new Error("Erreur lors de la récupération de l'article");
    return res.json();
};

// Récupérer les articles d'une catégorie
export const getArticlesByCategory = async (categoryId: number): Promise<Article[]> => {
    const res = await fetch(`${API_URL}/articles/category/${categoryId}`);
    if (!res.ok) throw new Error("Erreur lors de la récupération des articles par catégorie");
    return res.json();
};

// Rechercher des articles par titre
export const searchArticles = async (title: string): Promise<Article[]> => {
    const res = await fetch(`${API_URL}/articles?title=${title}`);
    if (!res.ok) throw new Error("Erreur lors de la recherche des articles");
    return res.json();
};