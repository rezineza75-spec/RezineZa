import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { getReviews, createReview, deleteReview } from "../api/review";
import type { Review } from "../interfaces/reviews.interface";
import Button from "../components/Button";

const Avis = () => {
  const { data: session } = authClient.useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

const fetchReviews = async () => {
    try {
        const data = await getReviews();
        setReviews(data);
    } catch (error) {
        console.error("Erreur lors de la récupération des avis", error);
    }
};
  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    if (!name || !comment || rating === 0) {
      setError("Veuillez remplir tous les champs et choisir une note");
      return;
    }
    try {
      await createReview({ name, rating, comment });
      setName("");
      setComment("");
      setRating(0);
      setSuccess("Votre avis a bien été publié !");
      await fetchReviews();
    } catch (error) {
      setError("Une erreur est survenue, veuillez réessayer");
    }
  };

const handleDelete = async (id: number) => {
  try {
    await deleteReview(id); // le cookie est envoyé automatiquement
    await fetchReviews();
  } catch (error: any) {
    setError(error.message || "Erreur lors de la suppression de l'avis");
  }
};

  return (
    <div className="flex flex-col items-center py-10 md:py-16 px-4 md:px-8 gap-8 md:gap-10">

      {/* TITRE */}
      <div className="flex flex-col items-center gap-2">
        <h1 className="font-['Playfair_Display'] text-[#405882] text-3xl md:text-4xl italic text-center">
          Vos avis comptent !
        </h1>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="text-yellow-400 text-2xl">★</span>
          ))}
        </div>
      </div>

      {/* FORMULAIRE */}
      {session ? (
        <div className="bg-[#405882] rounded-[20px] p-6 md:p-10 w-full max-w-2xl flex flex-col gap-5">
          <h2 className="font-['Playfair_Display'] text-white text-xl md:text-2xl text-center">
            Nous laissez un avis
          </h2>
          <input
            type="text"
            placeholder="Votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 bg-white rounded-lg px-4 font-['Lato'] text-sm outline-none"
          />
          <textarea
            placeholder="Votre commentaire"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-white rounded-lg p-4 font-['Lato'] text-sm outline-none resize-none h-32"
          />
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-3xl cursor-pointer transition-colors ${
                  star <= (hoverRating || rating) ? "text-yellow-400" : "text-white"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </span>
            ))}
          </div>
          {error && (
            <p className="font-['Lato'] text-red-300 text-sm text-center">{error}</p>
          )}
          {success && (
            <p className="font-['Lato'] text-white text-sm text-center">{success}</p>
          )}
          <div className="flex justify-center">
            <Button
              text="Envoyer"
              type="button"
              onClick={handleSubmit}
              bgColor="bg-[#9C9475]"
              width="w-48"
              radius="rounded-full"
            />
          </div>
        </div>
      ) : (
        <div className="bg-[#405882] rounded-[20px] p-6 md:p-10 w-full max-w-2xl flex flex-col items-center gap-4">
          <h2 className="font-['Playfair_Display'] text-white text-xl md:text-2xl text-center">
            Nous laissez un avis
          </h2>
          <p className="font-['Lato'] text-white text-sm text-center">
            Vous devez être connecté pour laisser un avis
          </p>
          {/* Sur mobile les boutons s'empilent */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/connexion">
              <Button text="Se connecter" bgColor="bg-[#9C9475]" width="w-40" radius="rounded-full" />
            </Link>
            <Link to="/inscription">
              <Button text="S'inscrire" bgColor="bg-white" textColor="text-[#405882]" width="w-40" radius="rounded-full" />
            </Link>
          </div>
        </div>
      )}

      {/* LISTE DES AVIS */}
      <div className="flex flex-col gap-4 md:gap-6 w-full max-w-2xl">
        {reviews.length === 0 ? (
          <p className="font-['Lato'] text-gray-400 text-center">
            Aucun avis pour le moment
          </p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-4 md:p-6 flex flex-col gap-3 border border-[#9C9475]"
            >
              <div className="flex justify-between items-center">
                <p className="font-['Lato'] text-[#405882] font-bold text-sm md:text-base">
                  {review.name}
                </p>
                {session && (
                  session.user.id === review.userId ||
                  session.user.role === "admin"
                ) && (
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="font-['Lato'] text-xs text-red-400 hover:text-red-600 cursor-pointer"
                  >
                    Supprimer
                  </button>
                )}
              </div>
              <p className="font-['Lato'] text-gray-600 text-sm">
                {review.comment}
              </p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-lg ${
                      star <= review.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Avis;