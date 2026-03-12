import type { Review } from "../interfaces/reviews.interface";

const API_URL = "http://localhost:3000";

// Récupérer tous les avis
export const getReviews = async (): Promise<Review[]> => {
    const res = await fetch(`${API_URL}/reviews`);
    if (!res.ok) throw new Error("Erreur lors de la récupération des avis");
    return res.json();
};

// Laisser un avis (utilisateur connecté uniquement)
export const createReview = async (review: {
    name: string;
    rating: number;
    comment: string;
}): Promise<Review> => {
    const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(review),
    });
    if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Erreur lors de la création de l'avis");
    }
    return res.json();
};

// Supprimer un avis (utilisateur peut supprimer le sien, admin peut tout supprimer)
export const deleteReview = async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/reviews/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Erreur lors de la suppression de l'avis");
    }
};