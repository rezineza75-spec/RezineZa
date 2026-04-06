import type { Article } from "../interfaces/articles.interface";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getArticles = async (): Promise<Article[]> => {
    const res = await fetch(`${API_URL}/api/articles`);
    if (!res.ok) throw new Error("Erreur lors de la récupération des articles");
    return res.json();
};

export const getArticleById = async (id: number): Promise<Article> => {
    const res = await fetch(`${API_URL}/api/articles/${id}`);
    if (!res.ok) throw new Error("Erreur lors de la récupération de l'article");
    return res.json();
};

export const getArticlesByCategory = async (categoryId: number): Promise<Article[]> => {
    const res = await fetch(`${API_URL}/api/articles/category/${categoryId}`);
    if (!res.ok) throw new Error("Erreur lors de la récupération des articles par catégorie");
    return res.json();
};

export const searchArticles = async (title: string): Promise<Article[]> => {
    const res = await fetch(`${API_URL}/api/articles?title=${title}`);
    if (!res.ok) throw new Error("Erreur lors de la recherche des articles");
    return res.json();
};

export const createArticle = async (data: Partial<Article>): Promise<Article> => {
    const res = await fetch(`${API_URL}/api/articles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la création de l'article");
    return res.json();
};

export const updateArticle = async (id: number, data: Partial<Article>): Promise<Article> => {
    const res = await fetch(`${API_URL}/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la modification de l'article");
    return res.json();
};

export const deleteArticle = async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/api/articles/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) throw new Error("Erreur lors de la suppression de l'article");
};