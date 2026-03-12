import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { getReviews, createReview, deleteReview } from "../api/review";
import type { Review } from "../interfaces/reviews.interface";
import Button from "../components/Button";

const Avis = () => {
  // Récupération de la session de l'utilisateur connecté
  const { data: session } = authClient.useSession();
  // State contenant la liste des avis récupérés depuis l'API
  const [reviews, setReviews] = useState<Review[]>([]);
  // States pour le formulaire d'avis
  const [name, setName] = useState("");       // nom de l'utilisateur
  const [comment, setComment] = useState(""); // commentaire
  const [rating, setRating] = useState(0);    // note sélectionnée (1 à 5)
  const [hoverRating, setHoverRating] = useState(0); // note survolée avec la souris
  // States pour afficher les messages d'erreur ou de succès
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fonction qui récupère les avis depuis l'API
  const fetchReviews = async () => {
    const data = await getReviews();
    setReviews(data);
  };

  // useEffect exécuté au chargement de la page
  useEffect(() => {
    fetchReviews();
  }, []);

  // Fonction appelée lors de l'envoi du formulaire
  const handleSubmit = async () => {
    // Réinitialisation des messages
    setError("");
    setSuccess("");
    // Vérification des champs obligatoires
    if (!name || !comment || rating === 0) {
      setError("Veuillez remplir tous les champs et choisir une note");
      return;
    }
    try {
      // Appel API pour créer un nouvel avis
      await createReview({ name, rating, comment });
      // Réinitialisation du formulaire
      setName("");
      setComment("");
      setRating(0);
      // Message de succès
      setSuccess("Votre avis a bien été publié !");
      // Rechargement des avis pour afficher le nouveau
      await fetchReviews();
    } catch (error) {
      // Message d'erreur si problème
      setError("Une erreur est survenue, veuillez réessayer");
    }
  };

  // Fonction pour supprimer un avis
  const handleDelete = async (id: number) => {
    try {
      // Appel API pour supprimer l'avis
      await deleteReview(id);
      // Rechargement de la liste des avis
      await fetchReviews();
    } catch (error) {
      setError("Erreur lors de la suppression de l'avis");
    }
  };
  return (
    // Conteneur principal de la page
    <div className="flex flex-col items-center py-16 px-8 gap-10">
      <div className="flex flex-col items-center gap-2">
        <h1 className="font-['Playfair_Display'] text-[#405882] text-4xl italic">
          Vos avis compte !
        </h1>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="text-yellow-400 text-2xl">★</span>
          ))}
        </div>
      </div>

          {/* FORMULAIRE D'AVIS */}
      {/* Le formulaire s'affiche uniquement si l'utilisateur est connecté */}
      {session ? (
        <div className="bg-[#405882] rounded-[20px] p-10 w-full max-w-2xl flex flex-col gap-5">
          <h2 className="font-['Playfair_Display'] text-white text-2xl text-center">
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
          {/* Système de notation avec étoiles */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                // Change la couleur si l'étoile est survolée ou sélectionnée
                className={`text-3xl cursor-pointer transition-colors ${
                  star <= (hoverRating || rating)
                    ? "text-yellow-400"
                    : "text-white"
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
            <p className="font-['Lato'] text-red-300 text-sm text-center">
              {error}
            </p>
          )}
          {success && (
            <p className="font-['Lato'] text-white text-sm text-center">
              {success}
            </p>
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
        // Message affiché si l'utilisateur n'est pas connecté
        <div className="bg-[#405882] rounded-[20px] p-10 w-full max-w-2xl flex flex-col items-center gap-4">
          <h2 className="font-['Playfair_Display'] text-white text-2xl text-center">
            Nous laissez un avis
          </h2>
          <p className="font-['Lato'] text-white text-sm text-center">
            Vous devez être connecté pour laisser un avis
          </p>
          <div className="flex gap-4">
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
      <div className="flex flex-col gap-6 w-full max-w-2xl">
        {reviews.length === 0 ? (
          <p className="font-['Lato'] text-gray-400 text-center">
            Aucun avis pour le moment
          </p>
        ) : (
          // Affichage de chaque avis
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-6 flex flex-col gap-3 border border-[#9C9475]"
            >
              <div className="flex justify-between items-center">
                <p className="font-['Lato'] text-[#405882] font-bold">
                  {review.name}
                </p>
                {/* Suppression possible si c'est son avis ou si admin */}
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
                      star <= review.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
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