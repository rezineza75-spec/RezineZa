import type { Review } from "../interfaces/reviews.interface";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getReviews = async (): Promise<Review[]> => {
    const res = await fetch(`${API_URL}/api/reviews`);
    if (!res.ok) throw new Error("Erreur lors de la récupération des avis");
    return res.json();
};

export const createReview = async (review: {
    name: string;
    rating: number;
    comment: string;
}): Promise<Review> => {
    const res = await fetch(`${API_URL}/api/reviews`, {
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

export const deleteReview = async (id: number) => {
    const res = await fetch(`${API_URL}/api/reviews/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Impossible de supprimer l'avis");
    }
};