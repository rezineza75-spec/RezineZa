import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { getFavorites, removeFavorite } from "../api/favorite";
import { authClient } from "../lib/auth-client";
import type { Favorite } from "../interfaces/favorites.interface";

const Favoris = () => {

  // Récupération de la session de l'utilisateur connecté
  const { data: session } = authClient.useSession();

  // State React pour stocker la liste des favoris
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  // Fonction qui récupère les favoris depuis l'API
  const fetchFavorites = async () => {
    try {
      const data = await getFavorites(); // appel API
      setFavorites(data); // mise à jour du state
    } catch (error) {
      console.error("Erreur lors de la récupération des favoris", error);
    }
  };

  // useEffect exécuté au chargement ou quand la session change
  useEffect(() => {

    // On récupère les favoris uniquement si l'utilisateur est connecté
    if (session) {
      fetchFavorites();
    }
  }, [session]);

  // Fonction pour supprimer un article des favoris
  const handleRemoveFavorite = async (e: React.MouseEvent, articleId: number) => {

    // On empêche le clic de déclencher la navigation vers la page article
    e.preventDefault();

    try {
      // Appel API pour supprimer le favori
      await removeFavorite(articleId);
      // Mise à jour du state local sans recharger la page
      setFavorites((prev) =>
        prev.filter((fav) => fav.articleId !== articleId)
      );
    } catch (error) {
      console.error("Erreur lors de la suppression du favori", error);
    }
  };

  // Si l'utilisateur n'est pas connecté
  // on affiche un message et un bouton pour se connecter
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <p className="font-['Lato'] text-[#405882] text-lg text-center">
          Connectez-vous pour voir vos favoris
        </p>
        <Link
          to="/connexion"
          className="font-['Lato'] text-white bg-[#405882] px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
        >
          Se connecter
        </Link>

      </div>
    );
  }

  return (
    // Conteneur principal de la page
    <div className="flex flex-col w-full px-8 py-10 gap-10">
      <div className="flex items-center gap-4 w-full">
        <div className="flex-1 bg-[#405882] rounded-full" style={{ height: "1.5px" }} />
        <h1 className="font-['Playfair_Display'] text-[#9C9475] text-2xl whitespace-nowrap">
          Mes Favoris !
        </h1>
        <div className="flex-1 bg-[#405882] rounded-full" style={{ height: "1.5px" }} />
      </div>

      {/* Si la liste de favoris est vide */}
      {favorites.length === 0 ? (
        // Message informant l'utilisateur qu'il n'a pas encore de favoris
        <div className="flex flex-col items-center gap-4 py-20">
          <p className="font-['Lato'] text-gray-400 text-center">
            Vous n'avez pas encore de favoris
          </p>
          {/* Lien pour découvrir les créations */}
          <Link
            to="/creations"
            className="font-['Lato'] text-[#405882] text-sm hover:underline"
          >
            Découvrir les créations →
          </Link>
        </div>

      ) : (
        // Sinon on affiche la grille des favoris
        <div className="grid grid-cols-3 gap-6">
          {/* On parcourt la liste des favoris */}
          {favorites.map((favorite) => (
            // Chaque carte est un lien vers la page détail de l'article
            <Link
              key={favorite.id}
              to={`/creations/${favorite.articleId}`}
              className="relative rounded-[10px] overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white"
            >
              {/* Image principale de l'article */}
              {favorite.article.images && favorite.article.images.length > 0 ? (
                <img
                  src={
                    // On affiche l'image principale si elle existe
                    favorite.article.images.find((img) => img.isMain)?.url ||
                    // Sinon on prend la première image
                    favorite.article.images[0].url
                  }
                  alt={favorite.article.title}
                  className="w-full h-52 object-cover"
                />
              ) : (

                // Placeholder si l'article n'a pas d'image
                <div className="w-full h-52 bg-gray-200 flex items-center justify-center">
                  <span className="font-['Lato'] text-gray-400 text-sm">
                    Pas d'image
                  </span>
                </div>
              )}
              {/* Section avec le titre, le prix et l'icône favori */}
              <div className="flex justify-between items-center px-3 py-2">
                {/* Titre et prix */}
                <div className="flex flex-col gap-1">
                  <p className="font-['Lato'] text-[#405882] text-sm font-medium truncate max-w-[150px]">
                    {favorite.article.title}
                  </p>
                  <p className="font-['Lato'] text-[#9C9475] text-xs">
                    {favorite.article.price
                      ? `${favorite.article.price.toFixed(2)}€`
                      : "Sur devis"}
                  </p>
                </div>
                {/* Bouton pour retirer le favori */}
                <button
                  onClick={(e) => handleRemoveFavorite(e, favorite.articleId)}
                  className="p-1"
                >
                  {/* Icône cœur rempli (car c'est déjà un favori) */}
                  <Heart
                    size={20}
                    className="text-red-900 fill-red-900"
                  />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
export default Favoris;